const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const Blockchain = require('./blockchain');
const PubSub = require('./pubsub');

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub(blockchain)

//Used to sync up chains for new peer
const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;
//setTimeout(() => pubsub.broadcastChain(), 1000);

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

if(process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`listening to port: ${PORT}`);
    syncChains();
});