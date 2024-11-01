
   
  // Function to handle signup
  function signup(username, address, email, password) {
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
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
  
        // Save additional user data to Firestore
        return db.collection('users').doc(user.uid).set({
          username: username,
          address: address,
          email: email,
          balance: 0.5,
          referrals:0,
          plans:[]
        });
      })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Signup successful',
        });
        localStorage.setItem('currentUsername', username);
        window.location.href = 'dashboard.html';
      })
      .catch((error) => {
        const errorMessage = error.message;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
        });
      });
  }
  
  
  // Function to handle form submission for signup
  document.getElementById('signup').addEventListener('click', () => {
    const username = document.getElementById('name1').value.trim();
    const address = document.getElementById('address1').value.trim();
    const email = document.getElementById('email1').value.trim();
    const password = document.getElementById('password1').value.trim();
    const confirmPassword = document.getElementById('confirmPassword1').value.trim();
  
    // Validate input fields
    if (!username || !address || !email || !password || !confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill all fields',
      });
      return;
    }
  
    if (password.length < 8) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Password must be at least 8 characters long',
      });
      return;
    }
  
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Passwords do not match',
      });
      return;
    }
  
    signup(username, address, email, password);
  });
  
  //Listen for authentication state changes
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      //readUserData(); // Optionally read user data on sign-in
      console.log("=logged In");
    } else {
      // User is signed out
      console.log("User is signed out.");
    }
  });