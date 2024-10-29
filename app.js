
   
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
          email: email
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
  
  // Function to handle login
  function login(email, password) {
    Swal.fire({
        title: 'Loading...',
        text: 'Please wait while we Log you In',
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading(); // Show the loading spinner
        }
      });
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Welcome, ${user.email}!`,
        });
        localStorage.setItem('currentUsername', user.email);
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
  
  // Function to read user data from Firestore
  function readUserData() {
    const user = firebase.auth().currentUser;
    
    if (user) {
      db.collection('users').doc(user.uid).get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            console.log("User Data:", data);
            // You can now use this data in your app
            Swal.fire({
              icon: 'info',
              title: 'User Data',
              text: `Username: ${data.username}, Address: ${data.address}`,
            });
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
  
  // Function to handle form submission for login
  /**document.getElementById('signup').addEventListener('click', () => {
    const email = document.getElementById('email2').value.trim();
    const password = document.getElementById('password2').value.trim();
  
    // Validate input fields
    if (!email || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill all fields',
      });
      return;
    }
  
    login(email, password);
  });
  */
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