const uuid = require('uuid/v1');
const { verifySignature } = require('../util');

class Transaction {
    constructor({ senderWallet, recipient, amount }) {
        this.id = uuid();
        this.outputMap = this.createOutputMap({ senderWallet, recipient, amount });

        this.input = this.createInput({ senderWallet, outputMap: this.outputMap});
    }

    //helper method to create an output Map for transaction
    createOutputMap({ senderWallet, recipient, amount}) {
        const outputMap = {};

        outputMap[recipient] = amount;
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

        return outputMap;
    }

    //helper method to create input for the transaction
    createInput({ senderWallet, outputMap }) {
        return {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(outputMap)
        }
    }

    update({ senderWallet, recipent, amount }) {

        //throw error is user sends more money than balance
        if(amount > this.outputMap[senderWallet.publicKey]) {
            throw new Error('Amount exceeds balance');
        }

        //if new recipent then assign it the amount
        //is sending money to same recipent then update its balance
        if(!this.outputMap[recipent]) {
            this.outputMap[recipent] = amount;
        } 
        else {
            this.outputMap[recipent] = this.outputMap[recipent] + amount;
        }

        this.outputMap[senderWallet.publicKey] = this.outputMap[senderWallet.publicKey] - amount;

        //update input to resign the new transaction
        this.input = this.createInput({ senderWallet, outputMap: this.outputMap});

    }

    //method to validate a transaction
    static validTransaction(transaction) {
        // const { input, outputMap } = transaction;
        // const{ address, amount, signature } = input

        const { input: { address, amount, signature }, outputMap } = transaction;

        //Get total of all the values in the outputmap
        const outputTotal = Object.values(outputMap).reduce((total, outputAmount) => total + outputAmount);

        //sum of outputmap should be equal to sender's balance or else its invalid
        if(amount !== outputTotal) {
            console.error(`Invalid transaction from: ${address}`);
            return false;
        }

        if(!verifySignature({ publicKey: address, data: outputMap, signature})) {
            console.error(`Invalid signature from: ${address}`);
            return false;
        }

        return true;
    }
}

module.exports = Transaction;