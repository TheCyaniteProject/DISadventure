const Keyv = require('keyv');
const KeyvFile = require('keyv-file').KeyvFile;

const keyv = new Keyv({
  store: new KeyvFile()
});
// More options with default value:
const customKeyv = new Keyv({
  store: new KeyvFile({
    namespace: 'users',
    filename: `./userdata.json`, // the file path to store the data
    expiredCheckDelay: 24 * 3600 * 1000, // ms, check and remove expired data in each ms
    writeDelay: 1000, // ms, batch write to disk in a specific duration, enhance write performance.
    encode: JSON.stringify, // serialize function
    decode: JSON.parse // deserialize function
  })
});


class Manager { // Data Manager
    static set(member, data, value) {
        customKeyv.set(`${member}--${data}`, value);
    }

    static get(member, data) {
        return customKeyv.get(`${member}--${data}`);
    }
}

module.exports = Manager;