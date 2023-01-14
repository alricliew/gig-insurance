var coderesult;

window.onload=function () {
  render();
};
function render() {


  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      // 'size': 'normal',
      'callback': (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // ...
          // Enable the step1 verify button
          document.getElementById("btnVerify").setAttribute("style", "background-color: #2e74b6");
          document.getElementById("btnVerify").style.cursor='pointer';
          document.getElementById("btnVerify").style.pointerEvents='auto';
          document.getElementById("btnVerify").disabled = false;

          document.getElementById("verificationCode").style.backgroundColor = '#eeeeee'
          document.getElementById("verificationCode").focus();

      },
      'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          // ...
      }
    });
    recaptchaVerifier.render();


}

function phoneAuth() {
  //get the number
  // let number = document.getElementById('phone').value;
  let number = itiPhone.getNumber();
  console.log(number)
  //phone number authentication function of firebase
  //it takes two parameter first one is number,,,second one is recaptcha
  firebase.auth().signInWithPhoneNumber(number,window.recaptchaVerifier).then(function (confirmationResult) {
    //s is in lowercase
    window.confirmationResult=confirmationResult;
    coderesult=confirmationResult;

    // Enable the step2 button
    document.getElementById("btnLogin").setAttribute("style", "background-color: #2e74b6");
    document.getElementById("btnLogin").style.cursor='pointer';
    document.getElementById("btnLogin").disabled = false;

    func.showNotification('top','center', 'success', 'check_circle', "We just sent a 6-digit verification code to "+itiPhone.getNumber());

    console.log(coderesult);

      // alert("Message sent");
  }).catch(function (error) {

    document.getElementById("phone").setAttribute("style", "background-color: #fff");
    document.getElementById("phone").disabled = false;

    //Disable the step 1 button
    document.getElementById("btnVerify").setAttribute("style", "background-color: #c1c1c1");
    document.getElementById("btnVerify").style.cursor='not-allowed';
    document.getElementById("btnVerify").disabled = true;
    console.log("Phone Verification Failed Error Code: "+ error);
    // func.showNotification('top','center', 'danger', 'error_outline', "Phone Verification Failed. Please make sure you enter a valid phone number." );
    func.showNotification('top','center', 'danger', 'error_outline', "Phone verification failed. "+ error.message );

  });
}
function codeverify() {


  let code=document.getElementById('verificationCode').value;

  coderesult.confirm(code)
  .then(function (result) {

    document.getElementById("btnLogin").setAttribute("disabled", true);
    document.getElementById("btnLogin").textContent = 'Please wait. Confirming ... ';

    // alert("Successfully registered");
    let user=result.user;
    let uid = user.uid;

    // Check if User Exists
    const promiseArray = []
    var tutorRef = db.collection('user').doc(uid).get();
    return Promise.resolve(tutorRef);

  })
  // Layer 2
  .then((doc)=> {
    document.getElementById("btnLogin").setAttribute("disabled", true);
    document.getElementById("btnLogin").textContent = 'Please wait. Almost there ... ';

    if (!doc.exists) {

      var newUserDocRef = db.collection("user").doc(uid)

      const promiseArray = []
      // User does not exist. Register a new user.
      var docData = {
        id  : newUserDocRef.id, //main
        name : 'user' + newUserDocRef.id,    //main
        phone  : itiPhone.getNumber(), //main
        email: "",
        nric  : "",
        nric_verified  : false,
        gender: "",
        address  : "",
        postcode  : "",
        img_url  : "",
        status  : "NEW",
        lastOnline : firebase.firestore.Timestamp.fromDate(new Date()),
        dateCreate : firebase.firestore.Timestamp.fromDate(new Date())
      }

      newUserDocRef.set(docData, {merge: true})

      promiseArray.push(newUserDocRef);


      return Promise.all(promiseArray);

    } else {

      return null;
    }
  })
  .then(() => {
    console.log('Go To Main Page')
    document.getElementById("btnLogin").removeAttribute("disabled");
    document.getElementById("btnLogin").textContent = 'Confirm And Login';

    window.location.href = './'
  })
  .catch(function (error) {
    // alert(error.message);
    // alert("Phone Verification Failed. Please make sure you enter a valid 6-digit verification code." +  error.message);
    func.showNotification('top','center', 'danger', 'error_outline', "Phone Verification Failed. "+ error.message);

    document.getElementById("btnLogin").removeAttribute("disabled");
    document.getElementById("btnLogin").textContent = 'Confirm And Login';
    console.log("Phone Verification Failed. Please make sure you enter a valid 6-digit verification code."+  error.message);
  });
}


