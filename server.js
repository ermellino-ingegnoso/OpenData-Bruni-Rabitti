const http = require('http');
const express = require("express");
const path = require("path");
const cors = require('cors');
const bodyParser=require("body-parser");
const { json } = require('body-parser');
const fs = require('fs');
var app = express();        // cambiato l'ambito di visibilità
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://opendatatep:x9AhDgW1KvCx3Vtw@opendatatep.yv8t4tb.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.set('port', process.env.PORT || 3000);
app.set('appName', "Appalti");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(cors({
    origin: '*'
  }));
app.use(bodyParser.json());
var appalti = require('./public/data/appalti.json');
var appalti_db;

const collection = client.db('appalti').collection('appalti');
const changeStream = collection.watch();
changeStream.on('change', async next => {
    appalti_db = await collection.find({}).toArray();
    appalti_db=appalti_db.map(el=>{
        delete el._id;
        return el;
    })
    })



function appaltoRegex(appalto)
{
    const regex=/^[a-zA-Z][a-zA-Z0-9]{9}$/;
    return Boolean(appalto.match(regex));
}

function dataRegex(data)
{
    const regex=/^\d{4}-\d{2}-\d{2}$/;
    return Boolean(data.match(regex));
}

function valoreRegex(valore)
{
    const regex=/^\d+(\.\d+)?$/;
    return Boolean(valore.match(regex));

}

function testoRegex(testo)
{
    const regex=/^[A-Za-z .,:;'"()-]+$/;
    return Boolean(testo.match(regex));
}

function controlloDuplicati(key,val)
{
    let arr_val=appalti.map(el=>el[key]);
    return arr_val.includes(val);
}

app.get("/", function(req,res) {
    res.sendFile('index.html');
});

app.get("/lavoro", function(req,res) {
    res.sendFile(__dirname + '/public/pages/lavoro.html');
});

app.get("/aggiunta", function(req,res) {
    res.sendFile(__dirname + '/public/pages/form.html');
});

app.get('/docs', (req, res) => {
    fs.readFile('./public/data/docs.txt', (err, data) => {
      if (err) {
        res.status(500).send('Errore nel leggere il file.');
      } else {
        res.setHeader('Content-Type', 'text/plain');
        res.send(data);
      }
    });
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
    const filteredAppalti = appalti.filter(appalto => appalto["VALORE A BASE DI ASTA"] >= min && appalto["VALORE A BASE DI ASTA"] <= max);
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

app.post('/aggiuntaAppalto', async function(req,res){
    let obj_esito = Object.fromEntries(Object.keys(req.body).map(chiave => [chiave, true]));
    Object.keys(obj_esito).forEach(el=>{
        if(el=="CIG"){obj_esito[el]=appaltoRegex(req.body[el]) && !controlloDuplicati("CIG",req.body[el])}
        else if(el=="DATA PUBBLICAZIONE"){obj_esito[el]=dataRegex(req.body[el])}
        else if(el=="VALORE A BASE D'ASTA" || el=="VALORE AGGIUDICAZIONE"){obj_esito[el]=valoreRegex(req.body[el])}
        else if(el=="LOCALIZZAZIONE" || el=="TIPOLOGIA CONTRATTO" || el=="AMMINISTRAZIONE APPALTANTE" || el=="OGGETTO"){obj_esito[el]=testoRegex(req.body[el])}
    })
    let arrErrori=Object.keys(obj_esito).filter(el=>obj_esito[el]==false);
    if(arrErrori.length==0)
    {
        //appalti.push(req.body);
        try {
            //await fs.promises.writeFile('./public/data/appalti.json', JSON.stringify(appalti));
            collection.insertOne(req.body);
            res.sendStatus(200);
          } catch {
            res.status(400).send("Errore nella sovrascrittura del file, appalto non aggiunto");
          }
    }
    else{
        let testo_errori=arrErrori.reduce((tot,v)=>tot+=v+"<br>","")
        res.status(400).send(testo_errori);
    }

});


app.use("*", function(req,res,next){
    res.status(404); 
    res.send('Url non presente');
});

const server = app.listen(app.get('port'), async function(){
    console.log('Server in ascolto');
    //await readJsonFile("appalti","appalti");
    //console.log(appalti_db)
    //  console.log('http://localhost:'+app.get('port'))
});
