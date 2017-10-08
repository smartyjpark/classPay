const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const config = require('./config');
const eachAsync = require('each-async');
const cors = require('cors');
const hostName = "https://api.iamport.kr";
const axios = require('axios');
const router = require('./router/main')(app);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, function(){
    console.log("server run")
});

app.use(express.static('public'));




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
            return(response.data)
        })
        .catch(function(error){
            return(error);
        })
}

console.log(getToken());