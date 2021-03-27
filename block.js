const {GENESIS_DATA} = require('./config');
const cryptoHash = require('./crypto-hash');

class Block{
    constructor({timestamp, lasthash, hash, data}){
        this.timestamp = timestamp;
        this.lasthash = lasthash;
        this.hash = cryptoHash(timestamp, lasthash, data);
        this.data = data;
    }

    //Return genesis block
    static genesis() {
        return new this(GENESIS_DATA);
    }

    //Data for the mined bock
    static mineBlock(lastBlock, data){

        const timestamp = Date.now();
        const lasthash = lastBlock.hash;

        return new this({
            timestamp,
            lasthash,
            data,
            hash: cryptoHash(timestamp, lasthash, data)
        });
    }
}

const block = new Block('01/01/2021', 'last-hash', 'hash', 'data');

console.log(Block.mineBlock(block, 'aditya'))

//console.log(Block.genesis());

module.exports = Block;