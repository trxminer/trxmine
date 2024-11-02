  
  
function minerIncrementor() {
  setInterval(() => {
      let counter = document.getElementById('counter');
      counter.textContent = (parseFloat(counter.textContent) + 0.005).toFixed(6);
  }, 1000);
}




function readPlan(data){

  const planContainer = document.getElementById('planContainer');
  
  data.forEach((user, index) => {
    const htmlElement = `
    <div class="boxMargin">
      <div class="cs_iconbox cs_style_1 cs_radius_20 wow fadeIn" data-wow-duration="1s" data-wow-delay="0.2s">
        <div class="cs_iconbox_inner">
          <div class="cs_iconbox_header">
            <div style="display: flex; justify-content: center; align-items: center;">
              <img src="package.png" height="30px" width="30px" alt="Icon">
              <P style="margin: 16px; font-size: 12px;color: rgba(222, 181, 250, 0.812);">PLAN NAME:</P>
            </div>
            <P id="planID" style="margin: 12px; font-size: 12px;color: rgba(222, 181, 250, 0.812);">${user.plan}</P>
          </div>
  
          <div class="cs_iconbox_header">
            <div style="display: flex; justify-content: center; align-items: center;">
              <img src="energy.png" height="30px" width="30px" alt="Icon">
              <P style="margin: 16px; font-size: 12px;color: rgba(222, 181, 250, 0.812);">POWER:</P>
            </div>
            <P id="powerID" style="margin: 12px; font-size: 12px;color: rgba(222, 181, 250, 0.812);">${user.power}</P>
          </div>
  
          <div class="cs_iconbox_header">
            <div style="display: flex; justify-content: center; align-items: center;">
              <img src="coin.png" height="30px" width="30px" alt="Icon">
              <P style="margin: 16px; font-size: 12px;color: rgba(222, 181, 250, 0.812);">EARNING RATE:</P>
            </div>
            <P id="earningID" style="margin: 12px; font-size: 12px;color: rgba(222, 181, 250, 0.812);">${user.earning}</P>
          </div>
  
          <div class="cs_iconbox_header">
            <div style="display: flex; justify-content: center; align-items: center;">
              <img src="signal.png" height="30px" width="30px" alt="Icon">
              <P style="margin: 16px; font-size: 12px;color: rgba(222, 181, 250, 0.812);">STATUS:</P>
            </div>
            <P style="margin: 12px; font-size: 12px;color: rgba(222, 181, 250, 0.812);">ACTIVE🟢</P>
          </div>
  
          <div class="cs_iconbox_header">
            <div style="display: flex; justify-content: center; align-items: center;">
              <img src="coin.png" height="30px" width="30px" alt="Icon">
              <P style="margin: 16px; font-size: 12px;color: rgba(222, 181, 250, 0.812);">PRICE:</P>
            </div>
            <P id="priceID" style="margin: 12px; font-size: 12px;color: rgba(222, 181, 250, 0.812);">${user.price} $trx</P>
          </div>
  
        
        </div>
      </div>
      </div>
    `;
  
    planContainer.innerHTML += htmlElement;
  });
}







  // Function to read user data from Firestore
  function readUserData() {
var username = document.getElementById("username");
var address = document.getElementById("address");
var balance = document.getElementById("balance");
var referrals = document.getElementById("referrals");


const user = firebase.auth().currentUser;
    
    if (user) {
      db.collection('users').doc(user.uid).get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            console.log("User Data:", data);
            // You can now use this data in your app

username.innerHTML = data.username;
address.innerHTML = data.address;
balance.innerHTML = data.balance;
referrals.innerHTML = data.referrals;
readPlan(data.plan);
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
  

async  function referral(){
    const user = firebase.auth().currentUser;
         // Get the hostname (website name)
         const websiteName = "Sign Up on www.tronxminerfarms.online and use my referral code "+user.uid+" and earn 5.05$TRX";
        try {
            await navigator.clipboard.writeText(websiteName); // Copy to clipboard
            Swal.fire({
                icon: 'success', 
                title: 'Referral',
                text: 'Your referral code has been copied',
              });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: 'couldnt copy code, make sure you are logged in.',
              });
        }
    }
    
    // Add event listener to the button
    document.getElementById('referral').addEventListener('click', referral);

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      //readUserData(); // Optionally read user data on sign-in
      console.log("auth confirmed");
      readUserData();
      minerIncrementor();
    } else {
      // User is signed out
      console.log("User is signed out.");
    }
  });