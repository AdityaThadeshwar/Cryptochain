//Native crypto library
const crypto = require('crypto');

//Create hash for input data and return
const cryptoHash = (...inputs) => {
    const hash = crypto.createHash('sha256');
    hash.update(inputs.sort().join(' '));

    return hash.digest('hex');

}

module.exports = cryptoHash;