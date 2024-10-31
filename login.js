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
  





document.getElementById('login').addEventListener('click', () => {
    const email = document.getElementById('email1').value.trim();
    const password = document.getElementById('password1').value.trim();
  
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
  