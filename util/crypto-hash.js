//Native crypto library
const crypto = require('crypto');

//Create hash for input data and return
const cryptoHash = (...inputs) => {
    const hash = crypto.createHash('sha256');

    /*Used stringify for outputMap attribute of Transaction not creating new hash when its values are updated
    as outputMap is a reference. In javascript since reference is the same, updated outputMap creates
    same hash */
    hash.update(inputs.map(input => JSON.stringify(input)).sort().join(' '));

    return hash.digest('hex');

}

module.exports = cryptoHash;