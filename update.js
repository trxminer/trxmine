import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js';
import { getFirestore, doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';


const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get the input and button elements
const referralInput = document.getElementById('referralInput');
const submitButton = document.getElementById('submit');
const idButton = document.getElementById('id');
const id = localStorage.getItem('userId');
idButton.innerHTML = id;

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