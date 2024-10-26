document.addEventListener('DOMContentLoaded', () => {
    let signUpBtn = document.getElementById("signup");

    // Helper function to show loading and error messages
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
        const email = document.getElementById("email1");
        const password = document.getElementById("password1");

        if (!validateInputs(email, password)) return;

        const loading = await showLoadingMessage('Signing Up...', 'Please wait while we create your account.');
        try {
            console.log("log::"+auth+" "+email.value," "+password.value);
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

    /***
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

  

    // Example usage in the browser console:
    window.signup = signup;
    window.login = login;
    window.createUserData = createUserData;
    window.readUserData = readUserData;
    window.incrementCounter = incrementCounter;
    window.stopCounter = stopCounter;

    **/
 
});
