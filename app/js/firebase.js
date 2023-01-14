// This js is used for Firebase Init

var firebaseConfig = {
  apiKey: "AIzaSyDbN0bwUcvvRcBvjdJ161o3AHLWf6PMm0s",
  authDomain: "rhb-hackathon-2023.firebaseapp.com",
  projectId: "rhb-hackathon-2023",
  storageBucket: "rhb-hackathon-2023.appspot.com",
  messagingSenderId: "264615384696",
  appId: "1:264615384696:web:b0a3ecada730dac96ebf8d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.auth.Auth.Persistence.LOCAL;

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });

