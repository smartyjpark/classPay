const axios = require('axios');
const hostName = "https://api.iamport.kr";
const config = require('../config');


let token;
var Iamport = require('iamport');
var iamport = new Iamport({
    impKey: config.RESTKey,
    impSecret: config.RESTSecretKey
});

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
                res.send(token)
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
                console.log(response)
                res.send(response.data.message)
            })
            .catch(function(error){
                console.log(error);

            })
    })

};