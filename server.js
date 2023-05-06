const http = require('http');
const express = require("express");
const path = require("path");
const cors = require('cors');
const bodyParser=require("body-parser");
const { json } = require('body-parser');
const fs = require('fs');
var appalti= require('./appalti.json')
let app = express();

app.set('port', process.env.PORT || 3000);
app.set('appName', "Appalti");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(cors({origin: '*'}));
app.use(bodyParser.urlencoded({ extended: true }));
/*esperimento di stocazzo*/
app.get("/", function(req,res) {
    res.sendFile('index.html');
});
app.get("/appalti", function(req,res) {
    res.json(appalti);
});
app.use("*", function(req,res,next){
    res.status(404); 
    res.send('Url non presente');
}); 
const server = app.listen(app.get('port'), function(){
    console.log('Server in ascolto');

});