//Genesis block data

const MINE_RATE = 1000;
const INITIAL_DIFFICULTY = 2;

const GENESIS_DATA = {
    timestamp: Date.now(),
    lasthash: 'last-hash',
    hash: 'hash-one',
    data: [],
    nonce: 1,
    difficulty: INITIAL_DIFFICULTY
};

module.exports = {GENESIS_DATA, MINE_RATE};