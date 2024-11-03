import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getFirestore, doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';


const firebaseConfig = {
    apiKey: "AIzaSyCiMCm1OfKguEexfaOF5jy5XJAQ8w_Jqag",
    authDomain: "tronxminerfarm.firebaseapp.com",
    projectId: "tronxminerfarm",
    storageBucket: "tronxminerfarm.appspot.com",
    messagingSenderId: "480890240487",
    appId: "1:480890240487:web:a7b4712586b25e0f6b1142",
    measurementId: "G-Z6X3JHQ5MN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get the input and button elements
const referralInput = document.getElementById('referralInput');
const submitButton = document.getElementById('submit');
const idButton = document.getElementById('id');
const skip = document.getElementById('skip');
const id = localStorage.getItem('userId');
idButton.innerHTML = id;


function go(){
  window.location.href = 'dashboard.html';
}


skip.addEventListener('click',go)


// Add event listener to the submit button
submitButton.addEventListener('click', async function() {
  try {
    // Get the user ID from the input field
    let referralCode = referralInput.value.trim();

    // Ensure the referral code is a string
    referralCode = String(referralCode);

    // Check if the input field is empty
    if (referralCode === '') {
      window.location.href = 'dashboard.html';
    }

    // Show loading dialog
    Swal.fire({
      title: 'Loading...',
      text: 'Please wait while we process your request.',
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(); // Show the loading spinner
      }
    });

    // Get the user document reference
    console.log(referralCode);
    const userRef = doc(db, 'users', referralCode);

    // Get the user document snapshot
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // Get the current referrals count
      const currentReferrals = userDoc.data().referrals;
   
      // Update the referrals count
      await updateDoc(userRef, {
        referrals: currentReferrals + 1,
      });
      

      // Hide loading dialog and show success message
      Swal.close();
      Swal.fire({
        title: 'Successfully claimed free referral!',
        text: 'You have been awarded 1 free plan.',
        icon: 'success',
      }).then(() => {
        // Navigate to dashboard.html
        window.location.href = 'dashboard.html';
      });
    } else {
      // Handle the case where the user document does not exist
      Swal.close();
      Swal.fire({
        title: 'Error',
        text: 'Referral code not found.',
        icon: 'error',
      });
      window.location.href = 'dashboard.html';
    }
  } catch (error) {
    // Hide loading dialog if it's still showing
    Swal.close();

    // Display error message
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message,
    }).then(() => {
      window.location.href = 'dashboard.html';
    });
  }
});