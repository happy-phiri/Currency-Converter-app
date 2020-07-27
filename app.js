const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const https = require('https');
const _ = require('lodash');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("Public"))
let finalResult = "";
let amountToConvert = "";
let baseCurrency = "";
let finalCurrency = "";

app.get("/", function(req, res){
    res.render("home");
})


app.post("/", function(req, res){
    const oxrApikey = "ab14b8a2315a43788fd42051e32cfc7c";
    const url ="https://openexchangerates.org/api/latest.json?app_id=" + oxrApikey;

    https.get(url, function(response){
        console.log(response.statuscode);

        response.on('data', function(data){
            const currencyData = JSON.parse(data);
            const rates = currencyData.rates;
            const currencySymbols = Object.keys(rates);
            const currencyRates = Object.values(rates);
            amountToConvert = req.body.firstCurrencyInput;
            baseCurrency = _.upperCase(req.body.baseCurrency);
            finalCurrency = _.upperCase(req.body.targetCurrency);
            const numberOfCurrencies = Number(String(currencySymbols.length))
            
            for(var i = 0; i < numberOfCurrencies; i++){
                if (baseCurrency === currencySymbols[i]){
                    const initialCurrency = Number(String(currencyRates[i]));
                    const result = String(Number(amountToConvert / initialCurrency));

                    for(var i = 0; i < numberOfCurrencies; i++){
                        if (finalCurrency === currencySymbols[i]){
                            const chosenCurrency = Number(String(currencyRates[i]));

                            const conversionResult = Number(result * chosenCurrency);

                            console.log("The answer is " + String(conversionResult));
                            finalResult = conversionResult;
                            res.redirect("/result");
                    
                        }
                    }   
                };             
            }           
        });            
    });    
});

app.get("/result", function(req, res){
    res.render("result", {finalResult: finalResult, amountToConvert: amountToConvert, baseCurrency: baseCurrency, finalCurrency: finalCurrency});
  });



app.listen(3000, function(){
    console.log("Server is up and running");
});


/*
apikey
ab14b8a2315a43788fd42051e32cfc7c
rates.GBP
*/



