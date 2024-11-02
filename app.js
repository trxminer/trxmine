// Function to handle form submission for signup
document.getElementById('signup').addEventListener('click', signupFormHandler);

// Function to handle signup form submission
async function signupFormHandler() {
  const username = document.getElementById('name1').value.trim();
  const address = document.getElementById('address1').value.trim();
  const email = document.getElementById('email1').value.trim();
  const password = document.getElementById('password1').value.trim();
  const confirmPassword = document.getElementById('confirmPassword1').value.trim();

  // Validate input fields
  if (!validateInputFields(username, address, email, password, confirmPassword)) {
    return;
  }

  try {
    await signup(username, address, email, password);
  } catch (error) {
    handleError(error);
  }
}

// Function to validate input fields
function validateInputFields(username, address, email, password, confirmPassword) {
  if (!username ||!address ||!email ||!password ||!confirmPassword) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Please fill all fields',
    });
    return false;
  }

  if (password.length < 8) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Password must be at least 8 characters long',
    });
    return false;
  }

  if (password!== confirmPassword) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Passwords do not match',
    });
    return false;
  }

  return true;
}

// Function to handle signup
async function signup(username, address, email, password) {
  // Show loading dialog
  Swal.fire({
    title: 'Loading...',
    text: 'Please wait while we Sign you Up.',
    allowEscapeKey: false,
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading(); // Show the loading spinner
    }
  });

  try {
    // Create user with email and password
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Prepare user data
    const userMap = [
      {
        price: "00.00$TRX",
        plan: "FREE PLAN",
        power: "50",
        earning: "0.050",
      },
    ];

    // Save additional user data to Firestore
    await db.collection('users').doc(user.uid).set({
      username: username,
      address: address,
      email: email,
      balance: 0.5,
      referrals: 0,
      plan: userMap,
    }, { merge: true });

    // Hide loading dialog and show success message
    Swal.close();
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Signup successful',
    });

    // Store user data in local storage and navigate
    localStorage.setItem('currentUsername', username);
    localStorage.setItem('userId', user.uid);
    window.location.href = 'update.html';
  } catch (error) {
    throw error;
  }
}

// Function to handle errors
function handleError(error) {
  Swal.close();
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: error.message,
  });
}

// Listen for authentication state changes
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    console.log("Logged In");
  } else {
    // User is signed out
    console.log("User is signed out.");
  }
});