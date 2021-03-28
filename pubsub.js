const redis = require('redis');

//Channels to listen/broadcast to
const CHANNELS = {
    TEST: 'TEST'
}

class PubSub {
    constructor() {

        //create a publisher and a subscriber through redis
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        //Make pubsub instance act as a subscriber and provide channel to subscribe to
        this.subscriber.subscribe(CHANNELS.TEST);

        //Function when subscriber receives a message
        this.subscriber.on(
            'message',
            (channel, message) => this.handleMessage(channel, message)
        );
    }

    //Log received message
    handleMessage(channel, message) {
        console.log(`Message received. Channel: ${channel}. Message: ${message}.`)
    }
}

const testPubSub = new PubSub();

//Publish a test message 1sec after of class is created
setTimeout( () => testPubSub.publisher.publish(CHANNELS.TEST, 'foo'), 1000);