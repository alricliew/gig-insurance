// This is core js
var uid; // For tutor-portal
var userId; // for client
var current_id; // This was added to check if different user is logged in on the same browser.
var current_name, current_email, current_phone, current_gender, current_imgUrl, current_nric, current_nricVerified,
  current_address,  current_status, current_dateCreate, current_lastOnline;

// Check if user logged on
function AuthCheck(){
  firebase.auth().onAuthStateChanged(function(user){
    if(!user){
      // Return to login if user does not exist.
      // window.location.href = "https://app.golearn.com.my/"
    }else{
      // if the displayName is null, it means user register using Phone
      uid = firebase.auth().currentUser.uid

      loadUserObj(uid);

    }

  });
}

// Set the nav name and global var, if user already login and have session Storage
var userObj = null;
// Check If userObj exist
function loadUserObj(uid){

  if (JSON.parse(sessionStorage.getItem(USER_OBJ)) == null ){
    console.log("USER_OBJ does not exist. uid: " + uid)

    // Although user exist, but the storage is null. Reload.
    loadUserInfo(uid);
  }
  else{
    // Set the nav user name
    userObj = JSON.parse(sessionStorage.getItem(USER_OBJ));
    current_id = (userObj.id == null || userObj.id == "") ? "NO_ID" : userObj.id; // This was added to check if different user is logged in on the same browser.
    current_name = (userObj.name == null || userObj.name == "")? "New Tutor" : userObj.name;
    current_email = (userObj.email == null || userObj.email == "")? "" : userObj.email;
    current_phone = (userObj.phone == null || userObj.phone == "")? "New Tutor" : userObj.phone;
    current_age = (userObj.age == null || userObj.age == "")? "18" : userObj.age;
    current_gender= (userObj.gender == 0)? "Male" : "Female";
    current_imgUrl = (userObj.img_url == null || userObj.img_url == "")? "https://app.golearn.com.my/assets/img/hello.gif" : userObj.img_url;
    current_nric= (userObj.nric == null || userObj.nric == "")? "" : userObj.nric;
    current_nricVerified= (userObj.nric_verified != null || userObj.nric_verified)?  true: false;
    current_status = userObj.status; // bool
    current_address= (userObj.address == null || userObj.address == "")? "" : userObj.address;
    current_dateCreate= (userObj.dateCreate == null || userObj.dateCreate == "")? "" : userObj.dateCreate;
    current_lastOnline= (userObj.lastOnline == null || userObj.lastOnline == "")? "" : userObj.lastOnline;

    // Check if user logged in with other number. If true, logout
    if (current_id != uid){
      // console.log("Stored uid in session storage is equal to latest uid. ")
      window.location.href = "https://app.golearn.com.my/school/login.html";
    }
    // console.log(current_lastOnline)
    // let secondLastOnline = current_lastOnline.seconds;
    // let secondCurrent = new Date().getTime() / 1000;
    // let hoursEllapsed = (secondCurrent - secondLastOnline) / 60 / 60;
    // let reload = hoursEllapsed > 6;
    // console.log(secondLastOnline, secondCurrent, hoursEllapsed, reload)

    // Check last online. If > 6hr, reload
    if (current_lastOnline == null || current_lastOnline == ""){
      console.log("USER_OBJ exits, current_lastOnline is null")
      loadUserInfo(uid);
    }
    else{
      let secondLastOnline = current_lastOnline.seconds;
      let secondCurrent = new Date().getTime() / 1000;
      let hoursEllapsed = (secondCurrent - secondLastOnline) / 60 / 60;
      let reload = hoursEllapsed > 6;

      // console.log(secondLastOnline, secondCurrent, hoursEllapsed, reload);
      if (reload){
        console.log("USER_OBJ exits, current_lastOnline: "+hoursEllapsed+", reload true")
        loadUserInfo(uid);
      }
      else {
        console.log("USER_OBJ exits, current_lastOnline: "+hoursEllapsed+", reload false")
        // Update the general view
        updateGeneralView();
        // Finally, load page specific view.
        // This function will be declared separately in each page
        loadPageInitFunc();

        // Update Last Online
        let docLastOnlineRef = db.collection("user").doc(uid);
        docLastOnlineRef.update({
          lastOnline : new Date(),
          merge: true
        });


      }

    }


  }
}

// Load User Information
function loadUserInfo(uid){
  // Tutor Id must be a phone with +60, no spacing or other chars
  let docRef = db.collection("user").doc(uid);

  docRef.get().then((doc) => {
  // docRef.onSnapshot((doc) => {
    if (doc.exists) {
      current_name = (doc.data().name == null || doc.data().name == "")? "New Tutor" : doc.data().name;
      current_email = (doc.data().email == null || doc.data().email == "")? "" : doc.data().email;
      current_phone = (doc.data().phone == null || doc.data().phone == "")? "" : doc.data().phone;
      current_age = (doc.data().age == null || doc.data().age == "")? "18" : doc.data().age;
      current_gender= (doc.data().gender == 0)? "Male" : "Female";
      current_imgUrl = (doc.data().img_url == null || doc.data().img_url == "")? "https://app.golearn.com.my/assets/img/hello.gif" : doc.data().img_url;
      current_nric = (doc.data().nric == null || doc.data().nric == "")? "" : doc.data().nric;
      current_nricVerified = (doc.data().nric_verified != null || doc.data().nric_verified )? true : false;
      current_status = doc.data().accountStatus;
      current_address= (doc.data().address == null || doc.data().address == "")? "" : doc.data().address;
      current_dateCreate= (doc.data().dateCreate == null || doc.data().dateCreate == "")? "" : doc.data().dateCreate;
      current_lastOnline= (doc.data().lastOnline == null || doc.data().lastOnline == "")? "" : doc.data().lastOnline;

      // Store data to sessionStorage
      var tutorDataObj = {
        id : uid, // This was added to check if different user is logged in on the same browser.
        name : doc.data().name,
        phone : doc.data().phone,
        email : doc.data().email,
        nric : doc.data().nric,
        nric_verified : doc.data().nric_verified,
        gender : doc.data().gender,
        address :doc.data().address,
        postcode :doc.data().addressPostCode,
        img_url : doc.data().img_url,
        status : doc.data().status,
        lastOnline : doc.data().lastOnline,
        dateCreate : doc.data().dateCreate,
      }

      // Set userObj as sessionStorage
      sessionStorage.setItem(USER_OBJ, JSON.stringify(tutorDataObj));

      // Update the general view
      updateGeneralView();
      // Finally, load page specific view.
      // This function will be declared separately in each page
      loadPageInitFunc();

      // Update Last Online
      let docLastOnlineRef = db.collection("user").doc(uid);
      docLastOnlineRef.update({
        lastOnline : new Date(),
        merge: true
      });

    }

    else {
      // window.location.href = "https://app.golearn.com.my/"
    }
  });

}


// Update General View
function updateGeneralView(){
  // Set the nav user name.
  document.getElementById("user").textContent = current_name;


}


$( document ).ready(function() {
  // Sign Out
  $('#btnSignOutModalUpdate').on('click', function (e) {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      }).catch((error) => {
        window.alert("Logging out failed");
        func.showNotification('top','center', 'danger', 'error_outline', "Logging out failed." );
      });
  });

});

// Sign out
function signOutFunction(){
  // $('#signOutModal').modal('show');
  $("#signOutModal").appendTo("body");
}

// Check In
function checkInFunction(){
  // $('#signOutModal').modal('show');
  $("#checkInModal").appendTo("body");
}


// Append Modal to Body
// Note: This hack is to (1) make sure the long model scrollable on open &
//       (2) signout Modal open normally.
function appendModal(modalId){
  $("#"+modalId).appendTo("body");
}

// Generate avatar for invalid img
function generateAvatar(text, foregroundColor, backgroundColor, fontSize) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = 200;
  canvas.height = 200;

  // Draw background
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw text
  context.font = "bold "+fontSize+" Arial";
  context.fillStyle = foregroundColor;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  return canvas.toDataURL("image/png");
}

// ------ Notification ------//
func = {
  showNotification: function(from, align, type, material_icon, message) {
    // type = ['', 'info', 'danger', 'success', 'warning', 'rose', 'primary'];
    // color = Math.floor((Math.random() * 6) + 1);
    $.notify({
      icon: material_icon,
      message: message

    }, {
      type: type,
      timer: 3000,
      placement: {
        from: from,
        align: align
      }
    });
  },
}

