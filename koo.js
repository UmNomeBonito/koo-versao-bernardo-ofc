const firebaseConfig = {
    apiKey: "AIzaSyCEmthYREyZlbMrEWbn237JSvKqaLaPKPw",
    authDomain: "vamosconversar-55ba5.firebaseapp.com",
    databaseURL: "https://vamosconversar-55ba5-default-rtdb.firebaseio.com/",
    projectId: "vamosconversar-55ba5",
    storageBucket: "vamosconversar-55ba5.appspot.com",
    messagingSenderId: "1002127230055",
    appId: "1:1002127230055:web:71461fb5755d88c15700c2",
    measurementId: "G-QX2PLCF2VP"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  function addUser()
  {
    userName = document.getElementById("userName").value;
    firebase.database().ref("/").child(userName).update({
        purpose : "adding user"
    })
  }