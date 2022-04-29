const crypto =  require('crypto');

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

const { encrypt } = cipher;

const data = {
    templates: [
        {
            id: "T1",
            user: "",
            name: "Password",
            category: "Passwords",
            data: [
                { name: "User", value: "", type: "text" },
                { name: "Password", value: "", type: "password" },
                { name: "Website", value: "", type: "link" }
            ],

            createdAt: "Thu Dec 30 2021 22:52:56",
            lastModifiedAt: "Thu Dec 30 2021 22:52:56"
        },
        {
            id: "T2",
            user: "",
            name: "Card",
            category: "Cards",
            data: {
                network: "",
                cardName: "",
                cardType: "Debit Card",
                cardNo: "",
                validThru: "",
                cardHolderName: "",
                CVV: ""
            },
            cardTheme: "bluePurple",

            createdAt: "Fri Apr 30 1999 00:00:00",
            lastModifiedAt: "Fri Apr 30 1999 00:00:00"
        }
    ],
    credentials: [
        {
            id: "C1",
            user: "Sample user",
            name: "Credentials",
            category: "Passwords",
            data: [
                { name: "User", value: "Sample user", type: "text" },
                { name: "Password", value: "user password", type: "password" },
                { name: "Website", value: "https://www.gsecurelock.ml/", type: "link" },
                { name: "Hidden Field", value: "You can hide info like this", type: "hidden" },
            ],
            
            createdAt: "Fri Apr 30 1999 00:00:00",
            lastModifiedAt: "Fri Apr 30 1999 00:00:00"
        },
        {
            id: "C2",
            user: "Sample user",
            name: "Card",
            category: "Cards",
            data: {
                network: "VISA",
                cardName: "Bank Card",
                cardType: "Debit Card",
                cardNo: "0000 0000 0000 0000",
                validThru: "10/2031",
                cardHolderName: "Firstname Lastname",
                CVV: "000"
            },
            cardTheme: "bluePurple",

            createdAt: "Fri Apr 30 1999 00:00:00",
            lastModifiedAt: "Fri Apr 30 1999 00:00:00"
        }
    ]
}

let jsonData = JSON.stringify(data);
let encryptedData = encrypt(jsonData, process.argv[2]);

// node sampleData.js <password>

console.log("\'\'\'\n");
console.log(encryptedData);
console.log("\n\n\'\'\'");