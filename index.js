const bodyParser = require('body-parser');
const express = require('express');
const Blockchain = require('./blockchain');
const PubSub = require('./pubsub');

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub(blockchain)

setTimeout(() => pubsub.broadcastChain(), 1000);

app.use(bodyParser.json());

//Endpoint for GET API
app.get('/api/getBlocks', (req, res) => {
    res.json(blockchain.chain);
});

//Endpoint for POST API
app.post('/api/mine', (req, res) => {

    const { data } = req.body;

    blockchain.addBlock({ data });

    res.redirect('/api/getBlocks');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`listening to port: ${PORT}`));