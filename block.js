const {GENESIS_DATA, MINE_RATE} = require('./config');
const cryptoHash = require('./crypto-hash');

class Block{
    constructor({timestamp, lasthash, hash, data, nonce, difficulty}){
        this.timestamp = timestamp;
        this.lasthash = lasthash;
        this.hash = hash;
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

        const lasthash = lastBlock.hash;
        let hash, timestamp;
        let { difficulty } = lastBlock;
        let nonce = 0;
        let i = 1;

        do{
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp })
            hash = cryptoHash(timestamp, lasthash, data, nonce, difficulty);
        } while (
            hash.substring(0, difficulty) !== '0'.repeat(difficulty)
            );

        return new this({
            timestamp,
            lasthash,
            data,
            nonce,
            difficulty,
            hash
        });
    }

    static adjustDifficulty({ originalBlock, timestamp }){
        const { difficulty } = originalBlock;

        if(difficulty <= 1) return 1;

        let difference = timestamp - originalBlock.timestamp;

        //console.log('OriginalBlock: ', originalBlock.timestamp, ' Timestamp: ', timestamp, 'Minerate: ', MINE_RATE)

        if(difference > MINE_RATE) {
            //console.log('Difficulty reduced')
            return difficulty - 1;
        }
        return difficulty + 1;
    }
}

//const block = new Block('01/01/2021', 'last-hash', 'hash', 'data');

//console.log(Block.mineBlock(block, 'aditya'))

//console.log(Block.genesis());



module.exports = Block;