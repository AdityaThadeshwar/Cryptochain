const redis = require('redis');

//Channels to listen/broadcast to
const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
}

class PubSub {
    constructor(blockchain) {

        this.blockchain = blockchain;

        //create a publisher and a subscriber through redis
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        //Make pubsub instance act as a subscriber to provided channels
        this.subscribeToChannels();

        //Function when subscriber receives a message
        this.subscriber.on(
            'message',
            (channel, message) => this.handleMessage(channel, message)
        );
    }

    //Handle/Log received message
    handleMessage(channel, message) {

        console.log(`Message received. Channel: ${channel}. Message: ${message}.`)

        //replace chain when it recives a chain in blockchain channel
        const parsedMessage = JSON.parse(message);

        if (channel === CHANNELS.BLOCKCHAIN) {
            this.blockchain.replaceChain(parsedMessage);
        }
    }

    subscribeToChannels() {
        Object.values(CHANNELS).forEach(channel => {
            this.subscriber.subscribe(channel);
        });
    }

    //helper method to boradcastChain
    //unsubscribe from own channel before publishing message
    publish({ channel, message }) {
        this.subscriber.unsubscribe(channel, () => {
            this.publisher.publish(channel, message, () => {
                this.subscriber.subscribe(channel);
            });
        });
    }

    //broadcast incoming chain
    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });

    }
}

//const testPubSub = new PubSub();

//Publish a test message 1sec after the class is created
//setTimeout( () => testPubSub.publisher.publish(CHANNELS.TEST, 'foo'), 1000);

module.exports = PubSub;