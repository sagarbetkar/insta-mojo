var express = require('express');
var bodyParser = require('body-parser');

const { Instamojo, Config, Buyer, Transaction, Refund } = require('../');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var instamojoConfig = new Config({
    api_key : 'test_23bbbff3f9dd1bd9289f9dbabc0',
    auth_token : 'test_50321f5ff353ef2af4756132980',
    redirect_url : 'http://localhost:3000/payment/status',
});
var txn = new Transaction({
    amount: 100,
    purpose: 'Testing plugin',
    send_sms: true,
    send_email: true
});
var buyer = new Buyer({
    name: 'Sagar',
    email: 'sagarbetkar1994@gmail.com',
    phone: '9702396398'
});
var payment = {
  payment_id: "MOJO5a06005J21512197",
  type: "QFL",
  body: "Customer isn't satisfied with the quality"
}

app.get('/', function(req, res){

    var instamojo = new Instamojo(instamojoConfig, txn, buyer);

    instamojo.initiatePayment(function(error, response, body){
        if(!error && response.statusCode == 201){

          res.json(JSON.parse(body));
        }
        else if(!error){
            res.json(response);
        }
        else {
            res.send(error);
        }
      });
});

app.get('/refunds', function (req, res) {
  var instamojo = new Instamojo(instamojoConfig, payment);

  instamojo.refunds(function(error, response, body){
    if(!error && response.statusCode == 201){

      res.json(JSON.parse(body));
    }
    else if(!error){
        res.json(response);
    }
    else {
        res.send(error);
    }
  })
})
app.get('/payment/status', function(req, res){
    res.send('We got it');
});

app.listen('3000', function () {
    console.log('Server at 3000');
});
