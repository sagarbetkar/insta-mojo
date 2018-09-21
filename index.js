const request = require('request');

function InstamojoData(config) {
  if(typeof config.api_key !== 'undefined' || typeof config.auth_token !== 'undefined' || typeof config.redirect_url !== 'undefined') {
    this.api_key = config.api_key;
    this.auth_token = config.auth_token;
    this.redirect_url = config.redirect_url;
  }
}

function InstamojoBuyer(buyer) {
  this.name = buyer.name || '';
  this.email = buyer.email || '';
  this.phone = buyer.phone || '';
}

function InstamojoTransaction(txn) {
  this.amount = txn.amount || 0;
  this.purpose = txn.purpose || 'Transaction';
  this.allow_repeated_payments = txn.repeat || false;
  this.send_sms = txn.send_sms || false;
  if (txn.expires_at) {
    this.expires_at = txn.expires_at;
  }
}

function InstamojoRefund(pay) {
  if(typeof pay.payment_id !== 'undefined' || typeof pay.type !== 'undefined' || typeof pay.body !== 'undefined'){
    this.payment_id = pay.payment_id;
    this.type = pay.type;
    this.body = pay.body;
  }
}

function Instamojo(config, transaction, refund, buyer) {
  this.data = {
    amount: transaction.amount,
    purpose: transaction.purpose,
    allow_repeated_payments: transaction.repeat,
    send_sms: transaction.send_sms,
    send_email: transaction.send_email,
    redirect_url: config.redirect_url,
    payment_id: refund.payment_id,
    type: refund.type,
    body: refund.body
  };
  if (transaction.expires_at)
    this.data.expires_at = transaction.expires_at;
  if (buyer) {
    if (buyer.name) this.data.buyer_name = buyer.name;
    if (buyer.phone) {
      this.data.phone = buyer.phone;
    } else {
      this.send_sms = false;
    }
    if (buyer.email) {
      this.data.email = buyer.email;
    } else {
      this.send_email = false;
    }
  }
  this.header = {
    'X-Api-Key': config.api_key,
    'X-Auth-Token': config.auth_token
  };
  this.config = {
    CREATE_PAYMENT_URL: 'https://test.instamojo.com/api/1.1/payment-requests/'
  };
}
  Instamojo.prototype.initiatePayment = function(cb) {
    console.log('Creating POST DATA', this.config.CREATE_PAYMENT_URL);
    request.post(this.config.CREATE_PAYMENT_URL, {
      form: this.data,
      headers: this.header
    }, cb);
  };

  Instamojo.prototype.refunds = function(cb) {
    console.log('Creating POST DATA', this.config.CREATE_PAYMENT_URL);
    request.post(this.config.CREATE_PAYMENT_URL, {
      form: this.data,
      headers: this.header
    }, cb);
  };

module.exports = {
  Instamojo: Instamojo,
  Buyer: InstamojoBuyer,
  Transaction: InstamojoTransaction,
  Refund: InstamojoRefund,
  Config: InstamojoData,
};
