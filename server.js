const http = require('http');
const express = require("express");
const path = require("path");
const cors = require('cors');
const bodyParser=require("body-parser");
const { json } = require('body-parser');
const fs = require('fs');
let app = express();

app.set('port', process.env.PORT || 3000);
app.set('appName', "Appalti");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(cors({
    origin: '*'
  }));
app.use(bodyParser.urlencoded({ extended: true }));

var appalti= require('./data/appalti.json')


app.get("/", function(req,res) {
    res.sendFile('index.html');
});

app.get("/appalti", function(req,res) {
    res.json(appalti);
});

app.get('/appalti/CIG/:cig', function(req, res){
    const cig = req.params.cig;
    const filteredAppalti = appalti.filter(appalto => appalto["CIG"] === cig.toUpperCase());
    res.json(filteredAppalti);
});

app.get('/appalti/dataAdOggi/:data', function(req,res){
    const data = new Date(req.params.data);
    const filteredAppalti = appalti.filter(appalto => new Date(appalto["DATA PUBBLICAZIONE"]) >= data);
    res.json(filteredAppalti);
});

app.get('/appalti/data/:data', function(req,res){
    const data = req.params.data;
    const filteredAppalti = appalti.filter(appalto => appalto["DATA PUBBLICAZIONE"] === data);
    res.json(filteredAppalti);
});

app.get('/appalti/valBaseAsta/:minmax', function(req,res){
    const [min, max] = req.params.minmax.split('-').map(val => parseInt(val));
    const filteredAppalti = appalti.filter(appalto => appalto["VALORE A BASE D'ASTA"] >= min && appalto["VALORE A BASE D'ASTA"] <= max);
    res.json(filteredAppalti);
});

app.get('/appalti/loc/:loc', function(req,res){
    let loc = req.params.loc;
    loc=loc.replaceAll("_"," ");
    const filteredAppalti = appalti.filter(appalto => appalto["LOCALIZZAZIONE"].toLowerCase() === loc.toLowerCase());
    res.json(filteredAppalti);
});

app.get('/appalti/contratto/:contratto', function(req,res){
    const contratto = req.params.contratto;
    const filteredAppalti = appalti.filter(appalto => appalto["TIPOLOGIA CONTRATTO"].toLowerCase() === contratto.toLowerCase());
    res.json(filteredAppalti);
});


app.use("*", function(req,res,next){
    res.status(404); 
    res.send('Url non presente');
});

    
const server = app.listen(app.get('port'), function(){
    console.log('Server in ascolto');

});