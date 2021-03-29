const EC = require('elliptic').ec;

//Elliptic cryptography using secp256k1 implementation (Same used by BTC)
const ec = new EC('secp256k1');

module.exports = { ec };