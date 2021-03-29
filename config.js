//Genesis block data

const MINE_RATE = 1000;
const INITIAL_DIFFICULTY = 2;
const STARTING_BALANCE = 1000;

const GENESIS_DATA = {
    timestamp: '1617004697360',
    lasthash: 'last-hash',
    hash: 'hash-one',
    data: [],
    nonce: 1,
    difficulty: INITIAL_DIFFICULTY
};

module.exports = {GENESIS_DATA, MINE_RATE, STARTING_BALANCE};