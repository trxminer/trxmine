document.addEventListener('DOMContentLoaded', async () => {
    const client = new Appwrite.Client();
    client.setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
          .setProject('671f8d37001025732495'); // Your project ID

    const account = new Appwrite.Account(client);
    const databases = new Appwrite.Databases(client);

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePassword(password) {
        return password.length >= 6; // Example: At least 6 characters long
    }
    
    function goToURL(url) {
        window.location.href = url;
    }
    

    async function signup() {
        const email = document.getElementById("email1").value;
        const username = document.getElementById("name1").value;
        const address = document.getElementById("address1").value;
        const password = document.getElementById("password1").value;

        if (!validateEmail(email)) {
            Swal.fire('Error', 'Invalid email format', 'error');
            return;
        }
        if (!validatePassword(password)) {
            Swal.fire('Error', 'Password must be at least 6 characters long', 'error');
            return;
        }

        try {
            Swal.fire({
                title: 'Signing up...',
                text: 'Please wait a moment',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            console.log("logging info "+Appwrite.ID.unique(), email, password, username);
            const user = await account.create(Appwrite.ID.unique(), email, password, username);
            await saveUserToDB(user.$id, username, address);
            Swal.fire('Success', 'User signed up successfully!', 'success');
            goToURL(dashboard.html);

        } catch (error) {
            Swal.fire('Error', 'Signup failed: ' + error.message, 'error' +error.code);
        }
    }



    async function saveUserToDB(accountId, username, address) {
        const userData = {
            accountId,
            username,
            address,
            balance: 0 // Default balance
        };

        try {
            const response = await databases.createDocument(
                '671f97e50018d900dde8', // Replace with your database ID
                '671f987e000d1d707807', // Replace with your collection ID
                Appwrite.ID.unique(),
                userData
            );
            console.log('User saved to DB:', response);
        } catch (error) {
            console.error('Failed to save user to DB:', error);
        }
    }

    async function login() {
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        try {
            Swal.fire({
                title: 'Logging in...',
                text: 'Please wait a moment',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const session = await account.createEmailPasswordSession(email, password);
            Swal.fire('Success', 'User logged in successfully!', 'success');
            await getUserData(); // Fetch user data after login
        } catch (error) {
            Swal.fire('Error', 'Login failed: ' + error.message, 'error');
        }
    }

    async function getUserData() {
        try {
            const user = await account.get(); // Get current user info
            const userData = await databases.getDocument(
                '671f97e50018d900dde8', // Replace with your database ID
                '671f987e000d1d707807', // Replace with your collection ID
                user.$id // Use the user's account ID to fetch their data
            );

            console.log('Username:', userData.username);
            console.log('Address:', userData.address);
        } catch (error) {
            console.error('Failed to retrieve user data:', error);
        }
    }

    document.getElementById('signup').addEventListener('click', signup);
    document.getElementById('login').addEventListener('click', login);
});
