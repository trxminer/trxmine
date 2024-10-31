function getPlan(){
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan');
    const price = urlParams.get('price');
    const power = urlParams.get('power');

    var planId = document.getElementById('planId');
    var powerId = document.getElementById('powerId');
    var priceId = document.getElementById('priceId');


}

function sendEmail() {
    const user = firebase.auth().currentUser;
    const price = urlParams.get('price');
    // Get the subject and body from input fields
    const emailSubject = "User purchase confirmation";
    const emailBody = "User with id: "+user.id+" is requesting confirmation for the payment of: "+price;

    // Use Email.send() method from SmtpJS to send the email
    Email.send({
        Host: "smtp.gmail.com", // SMTP server for Gmail
        Username: "<cicadabug38@gmail.com>", // Your Gmail address
        Password: "<whispermap>", // Your Gmail password (or app password)
        To: "cicadabug38@gmail.com", // Recipient's email address
        From: "<mustaphapai@gmail.com>", // Your Gmail address
        Subject: emailSubject, // Subject of the email
        Body: emailBody, // Body content of the email
    })
    .then(message => {
        // Display success message if the email is sent successfully
        document.getElementById('statusMessage').innerText = "Mail sent successfully!";
    })
    .catch(error => {
        // Display error message if there is a failure in sending the email
        document.getElementById('statusMessage').innerText = "Failed to send mail!";
        console.error("Error sending email:", error); // Log error details in console
    });
}