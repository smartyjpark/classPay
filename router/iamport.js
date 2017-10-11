const axios = require('axios');
const hostName = "https://api.iamport.kr";
const config = require('../config');


let token;

module.exports = (app) => {
    app.post('/token', (req, res) => {
        axios({
            method: 'post',
            url: hostName + "/users/getToken",
            data: {
                imp_key: config.RESTKey,
                imp_secret: config.RESTSecretKey
            }
        })
            .then(function(response){
                token = response.data.response;
            })
            .catch(function(error){
                console.log(error);
            })
    });

    app.post('/pay', (req, res) => {
        axios({
            method: 'post',
            url: hostName + "/subscribe/payments/onetime",
            headers: {"Authorization": token['access_token']},
            data: req.body
        })
            .then(function(response){
                res.send(response.data)
                console.log("pay success")
            })
            .catch(function(error){
                console.log(error);
                res.send(response.data)
            })
    })

    app.post('/refund', (req, res, err) => {
        const uid = "merchant_uid";
        const email = "buyer_email";
        const name = "buyer_name";
        axios({
            method: 'get',
            url: hostName + "/payments/find/" + req.body[uid] + "/paid",
            headers: {"Authorization": token['access_token']},
            data: req.body
        })
            .then(function(response){
                console.log(response.data);
                console.log(req.body[name]);
                console.log(req.body[email]);
                if(req.body[name] === response.data.response[name] && req.body[email] === response.data.response[email]) {
                    axios({
                        method: 'post',
                        url: hostName + "/payments/cancel",
                        headers: {"Authorization": token['access_token']},
                        data: req.body
                    })
                        .then((response)=>{
                            if(response.data)
                            res.send(response.data)
                        })
                } else {
                    res.send("구매시 입력한 정보와 다릅니다")
                }
            })
            .catch(function(error){
                console.log("error!! " + error.response.data.message);
                res.send("구매번호를 다시 확인해주세요")
            })
    })

};