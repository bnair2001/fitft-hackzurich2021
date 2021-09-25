Moralis.initialize("0OAnK3Quiro9e7Q5qm8WWz7OAbY3n5T0Mx07V0Lv"); // Application id from moralis.io
Moralis.serverURL = "https://rke9wdovzebi.moralishost.com:2053/server"; //Server url from moralis.io
const CONTRACT_ADDRESS = "0x9F665A4dD040842602468d5DdDFB983C7aFCf22f";

var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        qrText: "null",
        notloggedIn: false,
        qrcode: '',
        qrBaseUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=',
        qrCurrent: '',
        username: '',
        showUser: false,
        timer: null,
        showQR: false,
        connectionStatus: '',
        nft: {
            id: '',
            caloriesBurned: '',
            weight: '',
            height: '',
            distanceTravelled: '',
            lastStreak: ''
        },
    },
    mounted: async function () {
        // debugger;
        var self = this;
        // self.showQR = true;
        // self.qrcode = new QRCode("qrcode", {
        //     text: this.qrText,
        //     width: 128,
        //     height: 128,
        //     colorDark: "#000000",
        //     colorLight: "#ffffff",
        //     correctLevel: QRCode.CorrectLevel.H
        // });
        // self.showQR = false;
        //FIX LATER
        // let athleteId = 0;
        // // window.web3 = await Moralis.Web3.enable();
        // const web3 = await Moralis.enable();
        // let abi = await self.getAbi();
        // // let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS)
        // console.log(abi);
        // const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
        // console.log(contract);
        // let data = await contract.methods.getTokenDetails(athleteId).call({ from: ethereum.selectedAddress });
        // console.log(data);
        // self.nft.id = data["id"];
        // self.nft.caloriesBurned = data["caloriesBurned"];
        // self.nft.weight = data["weight"];
        // self.nft.height = data["height"];
        // self.nft.distanceTravelled = data["distanceTravelled"];
        // self.nft.lastStreak = data["lastStreak"];
        // console.log(self.nft);
        // console.log("hello");

        await self.getNFTDeets();

        try {
            // check if user is logged in
            if (ethereum.selectedAddress) {
                console.log("logged in");
                self.notloggedIn = false;
                self.showQR = true;
            }
            else {
                console.log("not logged in");
                self.notloggedIn = true;
                self.showQR = false;
            }

            // currentUser = Moralis.User.current();
            // if (!currentUser) {
            //     self.notloggedIn = true;
            //     self.showQR = false;
            //     console.log("User not logged in");
            // }
            // else {
            //     console.log("User already logged in");
            //     self.notloggedIn = false;
            //     self.showQR = true;
            // }
        } catch (error) {
            console.log(error);
        }

        axios({
            method: 'post',
            url: 'https://wptv1r.deta.dev/connection/new',
            responseType: 'json',
            data: {
                "connection_id": "",
                "user_id": "",
                "operation": ""
            }
        }).then(function (response) {
            console.log(response);
            self.qrText = response.data.key;
            localStorage.setItem("key", response.data.key);
            self.showQR = true;
            self.qrCurrent = self.qrBaseUrl + self.qrText;
            // self.qrcode.clear(); // clear the code.
            // self.qrcode.makeCode(self.qrText); // make another code.
        });

        if (localStorage.getItem("key") != null) {
            self.notloggedIn = false;
            self.showQR = true;
            // window.location.reload();
            self.timer = setInterval(() => {
                self.checkConnection()
            }, 2000)
        } else {
            self.notloggedIn = true;
        }
    },
    methods: {
        login: async function () {
            var self = this;
            try {
                currentUser = Moralis.User.current();
                if (!currentUser) {
                    currentUser = await Moralis.Web3.authenticate();
                    console.log("User logged in");
                    self.notloggedIn = false;
                    window.location.reload();
                }
                else {
                    console.log("User already logged in");
                    self.notloggedIn = false;
                    self.showQR = true;
                    window.location.reload();
                }
            } catch (error) {
                console.log(error);
            }
        },
        getNFTDeets: async function () {
            var self = this;
            try {
                let athleteId = 0;
                // window.web3 = await Moralis.Web3.enable();
                const web3 = await Moralis.enable();
                let abi = await self.getAbi();
                // let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS)
                console.log(abi);
                const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
                console.log(contract);
                let data = await contract.methods.getTokenDetails(athleteId).call({ from: ethereum.selectedAddress });
                console.log(data);
                self.nft.id = data["id"];
                self.nft.caloriesBurned = data["caloriesBurned"];
                self.nft.weight = data["weight"];
                self.nft.height = data["height"];
                self.nft.distanceTravelled = data["distanceTravelled"];
                self.nft.lastStreak = data["lastStreak"];
                console.log(self.nft);
                console.log("hello");
            } catch (error) {
                console.log(error);
            }
        },
        getAbi: function () {
            return new Promise((resolve, reject) => {
                axios({
                    method: 'get',
                    url: 'Token.json',
                    responseType: 'json'
                }).then(function (response) {
                    resolve(response.data.abi);
                });
            });
        },
        checkConnection: function () {
            var self = this;
            var key = localStorage.getItem("key");
            axios({
                method: 'get',
                url: 'https://wptv1r.deta.dev/connection/' + key,
                responseType: 'json',
            }).then(function (response) {
                console.log(response);
                // console.log(response.data.connected);
                self.connectionStatus = response.data.state;
                // if (response.data.state != "idle") {
                //     await self.getNFTDeets();
                // }
                if (response.data.connected == false) {
                    // self.notloggedIn = true;
                    self.showQR = true;
                    // clearInterval(self.timer);
                }
                else {
                    self.showQR = false;
                }
            });
            console.log(self.showQR);
        },

        updateWorkout: function (athleteId, caloriesBurned, distanceTravelled) {
            let abi = this.getAbi();
            let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
            contract.methods.workout(athleteId, caloriesBurned, distanceTravelled).send({ from: ethereum.selectedAddress }).on("reciept", (() => {
                console.log("workout updated");
            }));

        }
    },


});