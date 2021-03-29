const { STARTING_BALANCE } = require('../config');
const { ec, cryptoHash } = require('../util');

class Wallet{
    constructor(){
        this.balance = STARTING_BALANCE;

        //generate public key for the wallet
        this.keyPair = ec.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    //sign the data using sign() method provided by elliptic library
    //sign() requires data in hex format 
    sign(data) {
        return this.keyPair.sign(cryptoHash(data));
    }
}

//const wallet = new Wallet();

module.exports = Wallet;