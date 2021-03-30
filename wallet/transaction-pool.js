//Transaction pool for every user
class TransactionPool{
    constructor(){
        this.transactionMap = {};
    }

    setTransaction(transaction) {
        //Add/update new transaction to the transactionMap
        this.transactionMap[transaction.id] = transaction;
    }

}

module.exports = TransactionPool;