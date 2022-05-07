var CryptoJS = require("crypto-js");

const cipher = {
    encrypt: (text, key) => {
        let encrypted = CryptoJS.AES.encrypt(text, key).toString();
        return encrypted;
    },

    decrypt: (text, key) => {
        let bytes  = CryptoJS.AES.decrypt(text, key);
        let plainText = bytes.toString(CryptoJS.enc.Utf8);
        return plainText;
    }
}

export default cipher;

// import crypto from 'browserify-cipher/browser';

// const cipher = {
//     encrypt: (text, key) => {
//         let cipher = crypto.createCipher('aes-256-cbc', key);
//         let encrypted = cipher.update(text, 'utf8', 'hex');
//         encrypted += cipher.final('hex');
//         return encrypted;
//     },

//     decrypt: (text, key) => {
//         var decipher = crypto.createDecipher('aes-256-cbc', key)
//         var encrypted = decipher.update(text, 'hex', 'utf8')
//         encrypted += decipher.final('utf8');
//         return encrypted;
//     }
// }

// export default cipher;