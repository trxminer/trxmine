// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    getFirestore,
    collection,
    addDoc,
    getDocs 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your web app's Firebase configuration
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
let email = document.getElementById("email");
let password = document.getElementById("password");

// Signup Function
export async function signup() {
    if (!validateEmail(email)) {
        await Swal.fire({
            icon: 'error',
            title: 'Invalid Email',
            text: 'Please enter a valid email address.'
        });
        return;
    }

    if (password.length <= 8) {
        await Swal.fire({
            icon: 'error',
            title: 'Weak Password',
            text: 'Password must be more than 8 characters.'
        });
        return;
    }

    const loading = Swal.fire({
        title: 'Signing Up...',
        text: 'Please wait while we create your account.',
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        loading.close();
        await Swal.fire({
            icon: 'success',
            title: 'Signup Successful',
            text: `User signed up: ${userCredential.user.email}`
        });
        return userCredential.user;
    } catch (error) {
        loading.close();
        await Swal.fire({
            icon: 'error',
            title: 'Signup Error',
            text: error.message
        });
    }
}

// Login Function
export async function login(email, password) {
    if (!validateEmail(email)) {
        await Swal.fire({
            icon: 'error',
            title: 'Invalid Email',
            text: 'Please enter a valid email address.'
        });
        return;
    }

    const loading = Swal.fire({
        title: 'Logging In...',
        text: 'Please wait while we log you in.',
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        loading.close();
        await Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: `User logged in: ${userCredential.user.email}`
        });
        return userCredential.user;
    } catch (error) {
        loading.close();
        await Swal.fire({
            icon: 'error',
            title: 'Login Error',
            text: error.message
        });
    }
}

// Create User Data Function
export async function createUserData(userId, data) {
    const loading = Swal.fire({
        title: 'Creating User Data...',
        text: 'Please wait while we save your data.',
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        const usersCollection = collection(db, "users");
        const docRef = await addDoc(usersCollection, {
            userId: userId,
            ...data,
            createdAt: new Date().toISOString()
        });
        
        loading.close();
        await Swal.fire({
            icon: 'success',
            title: 'User Data Created',
            text: `User data created with ID: ${docRef.id}`
        });
        return docRef.id;
    } catch (error) {
        loading.close();
        await Swal.fire({
            icon: 'error',
            title: 'Error Creating User Data',
            text: error.message
        });
    }
}

// Read User Data Function
export async function readUserData() {
    const loading = Swal.fire({
        title: 'Reading User Data...',
        text: 'Please wait while we fetch your data.',
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

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
        await Swal.fire({
            icon: 'info',
            title: 'Data Fetched Successfully!',
            text: `Retrieved ${users.length} user records.`
        });

        return users;
    } catch (error) {
        loading.close();
        await Swal.fire({
            icon: 'error',
            title: 'Error Reading User Data',
            text: error.message
        });
        return [];
    }
}

// Counter Function
let counterValue = 10000;
export function incrementCounter() {
    const counterElement = document.getElementById("counter");
    
    if (!counterElement) {
        console.error("Counter element not found!");
        return;
    }
    
    setInterval(() => {
        counterValue += 1.5;
        counterElement.innerText = counterValue.toFixed(2);
    }, 1000);
}

// Email Validation Helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Initialize counter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    incrementCounter();
});

// Example usage in the browser console:
window.signup = signup;
window.login = login;
window.createUserData = createUserData;
window.readUserData = readUserData;
window.incrementCounter = incrementCounter;

/*
Example usage:
await signup('user@example.com', 'password123');
await login('user@example.com', 'password123');
await createUserData('userId123', { name: 'John Doe', email: 'user@example.com' });
const users = await readUserData();
*/