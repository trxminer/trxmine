function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2]);
}

// Get the referral parameter
var referralId = getParameterByName('referral');

// If the referral parameter exists, do something with it
if (referralId) {
    // Process the referralId here
    console.log(referralId);

    // Remove the parameter from the URL
    var newUrl = window.location.href.replace(/[\?&]referral=[^&]*/, '');
    window.history.pushState({}, '', newUrl);
}

getParameterByName();