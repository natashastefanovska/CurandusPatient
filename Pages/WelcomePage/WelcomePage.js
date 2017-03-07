var Storage = require("FuseJS/Storage");
var Observable = require("FuseJS/Observable");
var activeUrl = require("Constants/SERVICE_URL.js");
        var myToast = require("myToast");


var isAgree = Observable(false);

function toogleIsAgree() {
    isAgree.value = !isAgree.value;
}

function isLogged() {

    Storage.read("userInfo").then(function(content) {
        debug_log("Registered");
        debug_log(content);
        goToMain();
    }, function(error) {
        debug_log("Not Registered");
        goToLogin();
    });

}

function Continue(){
    console.log(isAgree.value);
    if (isAgree.value==true)
    {
        router.goto("login");
    }
    else 
    if(isAgree.value==false)
    {
        myToast.toastIt("You must agree with the Terms and Conditions") 
    }
}

function goToLogin() {
    router.goto("login");
}
function goToTerms() {
    router.push("terms");
}

function goToMain() {
    router.goto("main");
}

module.exports = {
    toogleIsAgree:toogleIsAgree,
    isAgree: isAgree,
    goToTerms:goToTerms,
    Continue: Continue
};

// setTimeout(function() {
//     isLogged();
// }, 1500);