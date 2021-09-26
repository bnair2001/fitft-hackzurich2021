Moralis.initialize("0OAnK3Quiro9e7Q5qm8WWz7OAbY3n5T0Mx07V0Lv"); // Application id from moralis.io
Moralis.serverURL = "https://rke9wdovzebi.moralishost.com:2053/server"; //Server url from moralis.io
const CONTRACT_ADDRESS = "0x61AFF83Db495548999DcFd3111C31175282B9238";

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
        updateMessage: '',
        breedEligible: false,
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
        nft1: {

        },
        nft2: {
            
        }
    },
    mounted: async function () {
        // debugger;
        console.log(evolve("000000000000000018", "000000000000000008"))
        console.log(breed("000000000000000018", "000000000000000008"))

        var self = this;
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
        initiateUpdate: async function (userId) {
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

                axios({
                    method: 'post',
                    url: 'https://wptv1r.deta.dev/connection/operation',
                    responseType: 'json',
                    data: {
                        "connection_id": localStorage.getItem("key"),
                        "user_id": userId,
                        "operation": "update_fitness_activities"
                    }
                }).then(function (response) {
                    console.log(response);
                    // self.updateWorkout(0, response.data.artID, response.data.caloriesBurned, response.data.distanceTravelled);
                    self.nft.id = response.data.artID;
                    self.nft.caloriesBurned = response.data.caloriesBurned;
                    self.nft.weight = response.data.weight;
                    self.nft.height = response.data.height;
                    self.nft.distanceTravelled = response.data.distanceTravelled;
                    // self.getNFTDeets();
                    // const goals = [2000, 2000, 3000, 3000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000]
                    if (response.data.nft_block == 0 || response.data.nft_block == 1) {
                        if (response.data.caloriesBurned > 2000 || response.data.caloriesBurned > 4000) {
                            self.updateMessage = "You are eligible to breed!"
                            self.breedEligible = true;
                        }
                    }
                    else if (response.data.nft_block == 2 || response.data.nft_block == 3) {
                        if (response.data.caloriesBurned > 3000 || response.data.caloriesBurned > 4000) {
                            self.updateMessage = "You are eligible to breed!"
                            self.breedEligible = true;
                        }
                    }
                    else if (response.data.nft_block > 4 && response.data.nft_block < 20) {
                        if (response.data.caloriesBurned > 4000 && response.data.caloriesBurned % 4000 == 0) {
                            self.updateMessage = "You are eligible to breed!"
                            self.breedEligible = true;
                        }
                    }
                    else {
                        self.updateMessage = "You are not eligible to breed."
                        self.breedEligible = false;
                    }

                }

                )
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
                console.log(response.data)
                if (response.data.user != "") {
                    localStorage.setItem("user_id", response.data.user);
                }
                axios({
                    method: 'get',
                    url: 'https://wptv1r.deta.dev/users/' + localStorage.getItem("user_id"),
                    responseType: 'json',
                }).then(function (response) {
                    console.log(response.data);
                    this.nft1 = response.data
                });
                if (response.data.state != "idle") {
                    //here
                    // await self.getNFTDeets();


                    self.initiateUpdate(response.data.user);
                }
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

        updateWorkout: function (athleteId, id, caloriesBurned, distanceTravelled) {
            let abi = this.getAbi();
            let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
            contract.methods.workout(athleteId, id, caloriesBurned, distanceTravelled).send({ from: ethereum.selectedAddress }).on("reciept", (() => {
                console.log("workout updated");
            }));å

        }
    },


});