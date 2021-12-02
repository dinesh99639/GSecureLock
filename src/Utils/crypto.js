import crypto from 'crypto';

const cipher = {
    encrypt: (text, key) => {
        let cipher = crypto.createCipher('aes-256-cbc', key);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    },

    decrypt: (text, key) => {
        var decipher = crypto.createDecipher('aes-256-cbc', key)
        var encrypted = decipher.update(text, 'hex', 'utf8')
        encrypted += decipher.final('utf8');
        return encrypted;
    }
}

export default cipher;