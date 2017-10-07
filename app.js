const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const config = require('./config');
const eachAsync = require('each-async');
const cors = require('cors');
const hostName = "https://api.iamport.kr";
const axios = require('axios')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => {
    console.log('start 3000port!')
});

function getToken(){
    axios({
        method: 'post',
        url: hostName + "/users/getToken",
        data: {
            imp_key: config.RESTKey,
            imp_secret: config.RESTSecretKey
        }
    })
        .then(function(response){
            console.log(response.data)
        })
        .catch(function(error){
            console.log(error);
        })
}

getToken();