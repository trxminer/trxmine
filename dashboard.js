  
  
  
  
  
  
  
  
  
  
  // Function to read user data from Firestore
  function readUserData() {
var username = document.getElementById("username");
var address = document.getElementById("address");
var balance = document.getElementById("balance");

const user = firebase.auth().currentUser;
    
    if (user) {
      db.collection('users').doc(user.uid).get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            console.log("User Data:", data);
            // You can now use this data in your app

username.innerHTML = data.username;
address.innerHTML = data.address;
balance.innerHTML = data.balance;

          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.error("Error getting document:", error);
        });
    } else {
      console.log("No user is signed in.");
    }
  }
  

async  function referral(){
    const user = firebase.auth().currentUser;
        const websiteName = window.location.hostname+"/"+user.uid; // Get the hostname (website name)
    
        try {
            await navigator.clipboard.writeText(websiteName); // Copy to clipboard
            Swal.fire({
                icon: 'success',
                title: 'Referral',
                text: 'Referral has been copied',
              });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: 'couldnt copy address, make sure you are logged in.',
              });
        }
    }
    
    // Add event listener to the button
    document.getElementById('referral').addEventListener('click', referral);

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      //readUserData(); // Optionally read user data on sign-in
      console.log("auth confirmed");
      readUserData();
    } else {
      // User is signed out
      console.log("User is signed out.");
    }
  });