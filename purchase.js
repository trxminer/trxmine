// Configuration and Constants
const CONFIG = {
    SMTP: {
        HOST: "smtp.gmail.com",
        TO_EMAIL: "cicadabug38@gmail.com",
        FROM_EMAIL: "cicadabug38@gmail.com",
        SUBJECT: "User Purchase Confirmation"
    },
    SELECTORS: {
        PLAN_ID: 'planId',
        POWER_ID: 'powerId',
        PRICE_ID: 'priceId',
        
        PAID_BUTTON: 'paid',
        STATUS_MESSAGE: 'statusMessage'
    }
};

// Utility Functions
const utils = {
    safeGetElement: (id) => {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with id '${id}' not found`);
        }
        return element;
    },
    
    safeSetText: (element, text) => {
        if (element) {
            element.textContent = text || 'N/A';
        }
    },
    
    getUrlParam: (param) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },
    
    validatePrice: (price) => {
        return Boolean(price && !isNaN(price) && parseFloat(price) > 0);
    }
};

// Plan Management
class PlanManager {
    constructor() {
        this.planElement = utils.safeGetElement(CONFIG.SELECTORS.PLAN_ID);
        this.powerElement = utils.safeGetElement(CONFIG.SELECTORS.POWER_ID);
        this.priceElement = utils.safeGetElement(CONFIG.SELECTORS.PRICE_ID);
    }

    initialize() {
        const plan = utils.getUrlParam('plan');
        const power = utils.getUrlParam('power');
        const price = utils.getUrlParam('price');

        utils.safeSetText(this.planElement, plan);
        utils.safeSetText(this.powerElement, power);
        utils.safeSetText(this.priceElement, price);
    }
}

// Payment System
class PaymentSystem {
    constructor() {
        this.statusElement = utils.safeGetElement(CONFIG.SELECTORS.STATUS_MESSAGE);
    }

    async confirmPayment() {
        try {
            await this.sendConfirmationEmail(); // Uncomment to enable email confirmation
            console.log("Payment confirmation email sent successfully");

            await Swal.fire({
                title: 'Success!',
                text: 'Payment confirmation email sent successfully',
                icon: 'success'
            });

            console.log("Redirecting to dashboard...");

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
            
        } catch (error) {
            console.error('Payment confirmation error:', error);
            await Swal.fire({
                title: 'Error',
                text: 'Failed to process payment confirmation',
                icon: 'error'
            });
        }
    }

    async sendConfirmationEmail() {
        const price = utils.getUrlParam('price');
        if (!utils.validatePrice(price)) {
            throw new Error('Invalid price value');
        }

        try {
            // Using SMTP.js for email sending
            const message = await Email.send({
                Host: CONFIG.SMTP.HOST,
                Username: CONFIG.SMTP.TO_EMAIL,
                To: CONFIG.SMTP.TO_EMAIL,
                From: CONFIG.SMTP.FROM_EMAIL,
                Subject: CONFIG.SMTP.SUBJECT,
                Body: this.generateEmailBody(price)
            });

            if (message !== 'OK') {
                throw new Error('Email sending failed');
            }

            utils.safeSetText(this.statusElement, 'Payment confirmation sent successfully!');
        } catch (error) {
            utils.safeSetText(this.statusElement, 'Failed to send payment confirmation');
            throw error;
        }
    }

    generateEmailBody(price) {
        return `
            <h2>Payment Confirmation Request</h2>
            <p>New payment confirmation request received:</p>
            <ul>
                <li>Amount: ${price}</li>
                <li>Date: ${new Date().toLocaleString()}</li>
                <li>Plan: ${utils.getUrlParam('plan') || 'N/A'}</li>
                <li>Power: ${utils.getUrlParam('power') || 'N/A'}</li>
            </ul>
        `;
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize Plan Display
        const planManager = new PlanManager();
        planManager.initialize();

        // Initialize Payment System
        const paymentSystem = new PaymentSystem();
        
        // Set up payment button listener
        const paidButton = utils.safeGetElement(CONFIG.SELECTORS.PAID_BUTTON);
        if (paidButton) {
            paidButton.addEventListener('click', () => paymentSystem.confirmPayment());
        }

    } catch (error) {
        console.error('Initialization error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Failed to initialize application',
            icon: 'error'
        });
    }
});

// Send Mail Functionality
document.getElementById("mail").addEventListener('click', sendMail);

async function sendMail(){
    const plan = utils.getUrlParam('plan');
    const user = firebase.auth().currentUser;
    
    if (!user) {
      return Swal.fire({
          title: 'Error',
          text: 'User not authenticated.',
          icon: 'error'
      });
    }

    const price = utils.getUrlParam('price');

    Swal.fire({
      title: 'Loading...',
      text: 'Please wait while we Sign you Up.',
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      await Email.send({
          Host: CONFIG.SMTP.HOST,
          Username: CONFIG.SMTP.TO_EMAIL,
          Password: "whispermap", // Make sure to secure your password!
          To: CONFIG.SMTP.FROM_EMAIL,
          From: CONFIG.SMTP.TO_EMAIL,
          Subject: `User ID ${user.uid} purchased ${plan} for ${price}`,
          Body: "Well that was easy!!"
      });

      await Swal.fire({
          title: 'Success!',
          text: 'Confirmation Mail sent successfully',
          icon: 'success'
      });
      window.location.href = 'dashboard.html';
    } catch (error) {
      console.error('Mail sending error:', error);
      await Swal.fire({
          title: 'Error',
          text: 'Failed to send mail.',
          icon: 'error'
      });
      window.location.href = 'dashboard.html';
    }
}