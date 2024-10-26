// Ensure DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    let email = document.getElementById("email1");
    let password = document.getElementById("password1");
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

    // Signup Function
    async function signup() {
        if (!email ||!password) {
            console.error("Email or password input element not found.");
            return;
        }

        if (!email.value ||!password.value) {
            await showError('Please fill in both email and password fields.');
            return;
        }

        if (!validateEmail(email.value)) {
            await showError('Invalid Email');
            return;
        }

        if (password.value.length <= 8) {
            await showError('Weak Password');
            return;
        }

        const loading = await showLoadingMessage('Signing Up...', 'Please wait while we create your account.');
        try {
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
        if (!email ||!password) {
            console.error("Email or password input element not found.");
            return;
        }

        if (!email.value ||!password.value) {
            await showError('Please fill in both email and password fields.');
            return;
        }

        if (!validateEmail(email.value)) {
            await showError('Invalid Email');
            return;
        }

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