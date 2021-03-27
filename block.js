const {GENESIS_DATA} = require('./config');
const cryptoHash = require('./crypto-hash');

class Block{
    constructor({timestamp, lasthash, hash, data, nonce, difficulty}){
        this.timestamp = timestamp;
        this.lasthash = lasthash;
        this.hash = cryptoHash(timestamp, lasthash, data);
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    //Return genesis block
    static genesis() {
        return new this(GENESIS_DATA);
    }

    //Data for the mined bock
    static mineBlock(lastBlock, data){

        let hash, timestamp;
        const lasthash = lastBlock.hash;
        const { difficulty } = lastBlock;
        let nunce = 0;

        do{
            nunce++;
            timestamp = Date.now();
            hash = cryptoHash(timestamp, lasthash, data, nunce, difficulty);
            console.log(nunce);
        } while (
            hash.substring(0, difficulty) !== '0'.repeat(difficulty)
            );

        return new this({
            timestamp,
            lasthash,
            data,
            nunce,
            difficulty,
            hash
        });
    }
}

//const block = new Block('01/01/2021', 'last-hash', 'hash', 'data');

//console.log(Block.mineBlock(block, 'aditya'))

//console.log(Block.genesis());



module.exports = Block;