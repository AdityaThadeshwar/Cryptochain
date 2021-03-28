const Block = require('./block');
const cryptoHash = require('./crypto-hash');

class Blockchain{

    //create genesis block when blockchain is created
    constructor(){
        this.chain = [Block.genesis()];
    }

    //add new block to the blockchain
    addBlock(data){
        const newBlock = Block.mineBlock(this.chain[this.chain.length-1], data);

        if(Blockchain.isVaidChain(this.chain)) {
            this.chain.push(newBlock);
        }

        else{
            console.log('Invalid chain');
            return;
        } 
    }


    //validate if whole blockchain is valid
    static isVaidChain(chain){

        //compare only key/value pairs to be equal
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;


        //validate each block
        for(let i = 1; i < chain.length; i++){

            const {timestamp, lasthash, hash, data, nonce, difficulty} = chain[i];

            //validate previous hash of current block
            const actualLastHash = chain[i-1].hash;
            if(lasthash !== actualLastHash) return false;

            //validate hash of current block
            const validatedHash = cryptoHash(timestamp, lasthash, data, nonce, difficulty)
            if(hash !== validatedHash) return false;

            //validate if difficulty jump between current and previous block is more than 1
            const lastDifficulty = chain[i-1].difficulty;

            if(Math.abs(lastDifficulty-difficulty) > 1) return false;
        }

        //return true if bockchain is valid
        return true;
    }

    replaceChain(chain){

        //return is incomming chain is same length as current chain
        if(chain.lenght <= this.chain.lenght) {
            console.error('Incoming chain must be longer');
            return;
        };

        //Return if incomming chain is invalid
        if(!Blockchain.isVaidChain(chain)) {
            console.error('Incoming chain is invalid');
            return;
        }

        //Replace current chain with incomming chain
        console.log('Replacing chain with ',chain);
        this.chain = chain;
    }
}

// const blockchain = new Blockchain();

// console.log('Started')

// blockchain.addBlock('Aditya');
// console.log('First block added')

// blockchain.addBlock('Thadeshwar');
// console.log('Second block added')

// blockchain.addBlock('Bears');
// console.log('Third block added')

// blockchain.addBlock('Battle');
// console.log('Forth block added')

// blockchain.addBlock('Thadeshwar');
// console.log('Fifth block added')


// console.log(blockchain);

module.exports = Blockchain;