const express = require('express');
const app = express();
const request = require('request');
const eachAsync = require('each-async');
const cors = require('cors');
const router = require('./router/main')(app);
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const iamport = require('./router/iamport')(app);


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(cors());


app.listen(3000, function(){
    console.log("server run")
});

app.use(express.static('public'));