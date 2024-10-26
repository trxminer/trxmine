// Initialize Firebase first with type="module" in script tag
const initFirebase = async () => {
    try {
        const { initializeApp } = await import("https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js");
        const { getAuth } = await import("https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js");
        const { getFirestore } = await import("https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js");
        
        const firebaseConfig = {
            apiKey: "AIzaSyCP4AqGRzxzVSMIrXfXys53WQvcrh5jnl0",
            authDomain: "tronxminer-fb28a.firebaseapp.com",
            projectId: "tronxminer-fb28a",
            storageBucket: "tronxminer-fb28a.appspot.com",
            messagingSenderId: "269079823252",
            appId: "1:269079823252:web:41250e20620d7531e80581",
            measurementId: "G-7TWMH9L4QM"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        console.log("Firebase initialized:", app);

        // Initialize Authentication
        const auth = getAuth(app);
        console.log("Auth initialized:", auth);

        // Initialize Firestore
        const db = getFirestore(app);
        console.log("Firestore initialized:", db);

        return { app, auth, db };
    } catch (error) {
        console.error("Firebase initialization error:", error);
        throw error;
    }
};

// Wait for DOM content to be loaded
document.addEventListener('DOMContentLoaded', async () => {
    let auth, db;
    
    try {
        // Initialize Firebase and get auth instance
        const firebase = await initFirebase();
        auth = firebase.auth;
        db = firebase.db;
        
        console.log("Firebase setup complete. Auth available:", !!auth);
    } catch (error) {
        console.error("Setup error:", error);
        await showError("Failed to initialize Firebase. Please check console for details.");
        return;
    }

    async function showLoadingMessage(title, text) {
        const loading = Swal.fire({
            title: title,
            text: text,
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        return loading;
    }

    async function showError(message) {
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message
        });
    }

    async function showSuccess(title, text) {
        await Swal.fire({
            icon: 'success',
            title: title,
            text: text
        });
    }

    function validateInputs(email, password) {
        if (!email || !password) {
            console.error("Email or password input element not found.");
            return false;
        }
        if (!email.value || !password.value) {
            showError('Please fill in both email and password fields.');
            return false;
        }
        if (!validateEmail(email.value)) {
            showError('Invalid Email');
            return false;
        }
        if (password.value.length < 8) {
            showError('Weak Password');
            return false;
        }
        return true;
    }

    async function signup(event) {
        if (event) event.preventDefault();
        
        if (!auth) {
            console.error("Auth is not initialized");
            await showError("Authentication service is not available");
            return;
        }

        const email = document.querySelector("#email1");
        const password = document.querySelector("#password1");

        if (!validateInputs(email, password)) return;

        const loading = await showLoadingMessage('Signing Up...', 'Please wait while we create your account.');
        
        try {
            const { createUserWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js");
            const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
            await loading.close();
            await showSuccess('Signup Successful', `User signed up: ${userCredential.user.email}`);
            return userCredential.user;
        } catch (error) {
            console.error("Signup error:", error);
            await loading.close();
            await showError(error.message);
        }
    }

    async function login(event) {
        if (event) event.preventDefault();

        if (!auth) {
            console.error("Auth is not initialized");
            await showError("Authentication service is not available");
            return;
        }

        const email = document.getElementById("email1");
        const password = document.getElementById("password1");

        if (!validateInputs(email, password)) return;

        const loading = await showLoadingMessage('Logging In...', 'Please wait while we log you in.');
        
        try {
            const { signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js");
            const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
            await loading.close();
            await showSuccess('Login Successful', `User logged in: ${userCredential.user.email}`);
            return userCredential.user;
        } catch (error) {
            console.error("Login error:", error);
            await loading.close();
            await showError(error.message);
        }
    }

    // Email validation helper
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Expose functions to window object
    window.signup = signup;
    window.login = login;

    // Add event listeners to forms if they exist
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');

    if (signupForm) {
        signupForm.addEventListener('submit', signup);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', login);
    }
});