import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";


document.addEventListener('DOMContentLoaded', () => {

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
      const auth = getAuth(app);
      const db = getFirestore(app);
      const analytics = getAnalytics(app);

      
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

    // Helper function to validate inputs
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
        if (password.value.length < 8) { // Changed to < 8
            showError('Weak Password');
            return false;
        }
        return true;
    }

    // Signup Function
    async function signup() {
        const email = document.querySelector("#email1");
        const password = document.querySelector("#password1");
        console.log("sign up process 1"+auth.value+" "+email.value+" "+password.value);

        if (!validateInputs(email, password)) return;

        const loading = await showLoadingMessage('Signing Up...', 'Please wait while we create your account.');
        console.log("sign up process 2");
        try {
            console.log("sign up process 3");
            console.log("log 3.5"+" "+email.value+" "+password.value);
            console.log("sign up process 4");
            const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
            loading.close();
            await showSuccess('Signup Successful', `User signed up: ${userCredential.user.email}`);
            return userCredential.user;
        } catch (error) {
            loading.close();
            await showError(error.message);
        }
    }

    // Login Function
    async function login() {
        const email = document.getElementById("email1");
        const password = document.getElementById("password1");

        if (!validateInputs(email, password)) return;

        const loading = await showLoadingMessage('Logging In...', 'Please wait while we log you in.');
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
            loading.close();
            await showSuccess('Login Successful', `User logged in: ${userCredential.user.email}`);
            return userCredential.user;
        } catch (error) {
            loading.close();
            await showError(error.message);
        }
    }

    // Create User Data Function
    async function createUserData(userId, data) {
        const loading = await showLoadingMessage('Creating User Data...', 'Please wait while we save your data.');
        try {
            const usersCollection = collection(db, "users");
            const docRef = await addDoc(usersCollection, {
                userId: userId,
                ...data,
                createdAt: new Date().toISOString()
            });

            loading.close();
            await showSuccess('User Data Created', `User data created with ID: ${docRef.id}`);
            return docRef.id;
        } catch (error) {
            loading.close();
            await showError(error.message);
        }
    }

    // Read User Data Function
    async function readUserData() {
        const loading = await showLoadingMessage('Reading User Data...', 'Please wait while we fetch your data.');
        try {
            const usersCollection = collection(db, "users");
            const querySnapshot = await getDocs(usersCollection);
            const users = [];

            querySnapshot.forEach((doc) => {
                users.push({
                    id: doc.id,
                    ...doc.data()
                });
                console.log(`${doc.id} =>`, doc.data());
            });

            loading.close();
            await showSuccess('Data Fetched Successfully!', `Retrieved ${users.length} user records.`);
            return users;
        } catch (error) {
            loading.close();
            await showError(error.message);
            return [];
        }
    }

    // Counter Function
    let counterValue = 10000;
    let counterInterval;

    function incrementCounter() {
        const counterElement = document.getElementById("counter");

        if (!counterElement) {
            console.error("Counter element not found!");
            return;
        }

        counterInterval = setInterval(() => {
            counterValue += 1.5;
            counterElement.innerText = counterValue.toFixed(2);
        }, 1000);
    }

    function stopCounter() {
        clearInterval(counterInterval);
    }

    // Email Validation Helper
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Initialize counter when the page loads
    incrementCounter();

    // Example usage in the browser console:
    window.signup = signup;
    window.login = login;
    window.createUserData = createUserData;
    window.readUserData = readUserData;
    window.incrementCounter = incrementCounter;
    window.stopCounter = stopCounter;

    /*
    Example usage:
    await signup();
    await login();
    await createUserData('userId123', { name: 'John Doe', email: 'user@example.com' });
    const users = await readUserData();
    */
});
