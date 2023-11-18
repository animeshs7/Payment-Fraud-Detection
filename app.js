const express = require('express');
const path = require("path");
const bodyParser = require("body-parser");
var CryptoJS = require("crypto-js");
const NodeRSA = require('node-rsa');
const key = new NodeRSA('-----BEGIN RSA PRIVATE KEY-----MIIBPAIBAAJBANwHBPVb3nSuO + nCtEKsRL4Wo75WAd1CC7SxUgylkV5vJgBfrjqCYKyuCPJwUwbikFpGMJE7Xi7zzYThhyGAKEsCAwEAAQJAcCrb6kFVXOJeBMOPpdWwjb945lVuSd + bnBgxneTiAONyP3KYf8nxFAVah1t260IQd6jLrXaUZgY3OSCP9s4hUQIhAP70LsceT8WKFcbxXXj16baGfZ6hiHF3eqamir / YyTeHAiEA3O4l5mb6pg / dVm04cPqbEMTFV3SAUspNe2emgTlfsh0CIQDyZG1k2ii1gocZ0bgwnHxLEKq1 + pWiaxms / 4HCy / TiWQIhAJJRdvBdC2un3iM7OsI4dzJn33rIQaSTLzWns / KpmONRAiEA5rq90Zb4zExtiNMH0925ZDuguiukHVgAlocaHelXwSE = ----- END RSA PRIVATE KEY-- ---');
const key1 = new NodeRSA('-----BEGIN PUBLIC KEY-----MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANwHBPVb3nSuO + nCtEKsRL4Wo75WAd1CC7SxUgylkV5vJgBfrjqCYKyuCPJwUwbikFpGMJE7Xi7zzYThhyGAKEsCAwEAAQ == ----- END PUBLIC KEY----- ');
key.setOptions({ encryptionScheme: 'pkcs1' });
var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static('./public'));
app.post('/pay', function (req, res) {
    console.log("DONE");
    console.log(req.body);
    var a = req.body.cardNumber;
    var totLen = a.length;
    var pwd = a.substr(totLen - 88);
    var msg = a.substr(0, totLen - 88);
    const decrypted = key.decrypt(pwd).toString();
    // console.log('decrypted: ', decrypted);
    msg = CryptoJS.TripleDES.decrypt(msg, decrypted);
    var plaintext = msg.toString(CryptoJS.enc.Utf8);
    // console.log(plaintext);
    var md = plaintext.substr(plaintext.length - 88);
    var card = plaintext.substr(0, plaintext.length - 88);
    md = key.decrypt(md).toString();
    var t1 = CryptoJS.MD5(card).toString();
    var md1 = t1;
    console.log(md);
    console.log(md1);
    console.log(md == md1);
    res.send("<h1><center>Details Received</center></h1><p>CARD NUMBER -" + req.body.cardNumber + "</p ><p>EXPIRY DATE -" + req.body.expiryDate + "</p><p>CVV - " + req.body.cvv + "</p><p>PIN -" + req.body.pin + "</p>");
});
app.listen(3000, function (err) {
    console.log("Server running on PORT 3000");
});