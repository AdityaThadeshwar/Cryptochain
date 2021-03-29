const EC = require('elliptic').ec;
const cryptoHash = require('./crypto-hash');

//Elliptic cryptography using secp256k1 implementation (Same used by BTC)
const ec = new EC('secp256k1');

//verify signature of a transaction
const verifySignature = ({ publicKey, data, signature }) => {

    //verify method only available withn an instance of key object
    //so create temp key using public key
    const keyFromPublic = ec.keyFromPublic(publicKey, 'hex');

    //verify() requires data in hex format
    return keyFromPublic.verify(cryptoHash(data), signature);

}

module.exports = { ec, verifySignature };