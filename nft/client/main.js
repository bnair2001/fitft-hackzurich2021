var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!'
    }
});




Moralis.initialize("0OAnK3Quiro9e7Q5qm8WWz7OAbY3n5T0Mx07V0Lv"); // Application id from moralis.io
Moralis.serverURL = "https://rke9wdovzebi.moralishost.com:2053/server"; //Server url from moralis.io

async function login() {
    try {
        currentUser = Moralis.User.current();
        if (!currentUser) {
            currentUser = await Moralis.Web3.authenticate();
            console.log("User logged in: ");
        }
    } catch (error) {
        console.log(error);
    }
}

document.getElementById("login_button").onclick = login;