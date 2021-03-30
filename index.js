const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const Blockchain = require('./bockchain');
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet');

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub(blockchain)

//Used to sync up chains for new peer
const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

app.use(bodyParser.json());

//Endpoint for GET API
app.get('/api/getBlocks', (req, res) => {
    res.json(blockchain.chain);
});

//Endpoint for POST API
app.post('/api/mine', (req, res) => {

    const { data } = req.body;

    blockchain.addBlock(data);

    pubsub.broadcastChain();

    res.redirect('/api/getBlocks');
});

//endpoint to make transaction
app.post('/api/transact', (req, res) => {
    const { amount, recipent} = req.body;

    const transaction = wallet.createTransaction({ recipent, amount});

    transactionPool.setTransaction(transaction);

    console.log('transaction pool', transactionPool);

    res.json({ transactionPool });
});

//sync chain for newly connected peer
const syncChains = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/getBlocks`} , (error, response, body) => {
        if(!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);

            console.log('replace chain on sync with ', rootChain);
            blockchain.replaceChain(rootChain);
        }
    });
}

let PEER_PORT;

//generate new random port between 3000 and 3999 for new peer
if(process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`listening to port: ${PORT}`);

    //sync chain for every new peer that connects to the network
    //No publish for root node as its running on port 3000
    if(PORT !== DEFAULT_PORT) {
        syncChains();
    }
});