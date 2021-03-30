const { STARTING_BALANCE } = require('../config');
const { ec, cryptoHash } = require('../util');
const Transaction = require('./transaction');

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

    //Create new transaction to send amount
    createTransaction({ recipent, amount }) {

        if(amount > this.balance) {
            throw new Error('Amount exceeds balance');
        }

        //Create new transaction if balance is within senders balance
        return new Transaction({ senderWallet: this, recipent, amount });
    }
}

//const wallet = new Wallet();

module.exports = Wallet;