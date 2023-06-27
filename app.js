const { NseIndia } = require("stock-nse-india");
const ejs = require("ejs");
const express = require("express");
const logger = require("logger").createLogger("poc.log")
var cors = require('cors');
const nseIndia = new NseIndia()


const app = express();
app.set('view engine', 'ejs');
const corsOpts = {
    origin: '*',

    methods: [
        'GET',
        'POST',
    ],

    allowedHeaders: [
        'Content-Type',
    ],
};

app.use(cors(corsOpts))


app.get("/", (req, res) => {
    return "all fine"
})



app.get('/api', (req, res) => {
    
    nseIndia.getAllStockSymbols().then(data => {
        res.send(data);
    })
   
})

app.get('/api/:symbol', (req, res) => {
    logger.info(req.params.symbol);
    nseIndia.getEquityCorporateInfo(req.params.symbol).then(data=>{
        res.send(data);
    })
})


app.get("/api/details/:symbol", (req, res) => {
   //logger.info(JSON.stringify(req.headers))
    nseIndia.getEquityDetails(req.params.symbol).then(data => {
        res.send(data);
    })
})

app.listen(3030, () => {
    console.log("server started")
})

