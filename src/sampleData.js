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
    templates: [{
        id: "t1",
        name: "Default",
        data: [
            { user: "", password: "", website: "" }
        ],
        labels: []
    }],
    credentials: [
        {
            id: "C1",
            user: "user1",
            name: "Credentials 1",
            category: "Passwords",
            data: [
                { name: "User", value: "user1", type: "text" },
                { name: "Password", value: "user1 password", type: "password" },
                { name: "Website", value: "https://samplesite.com", type: "link" },
                { name: "Temporary Key", value: "sd8h677ifsc67e6", type: "hidden" },
            ],
            
            createdAt: "Thu Dec 30 2021 22:52:56",
            lastModifiedAt: "Thu Dec 30 2021 22:52:56"
        },
        {
            id: "C2",
            user: "user2",
            name: "Credentials 2",
            category: "Passwords",
            data: [
                { name: "Password", value: "user2 password", type: "password" },
                { name: "Website", value: "https://samplesite.com", type: "link" }
            ],

            createdAt: "Thu Dec 30 2021 22:52:56",
            lastModifiedAt: "Thu Dec 30 2021 22:52:56"
        },
        {
            id: "C3",
            user: "user1",
            name: "Card 1",
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

            createdAt: "Thu Dec 30 2021 22:52:56",
            lastModifiedAt: "Thu Dec 30 2021 22:52:56"
        },
        {
            id: "C4",
            user: "user1",
            name: "Testing 1",
            category: "Testing",
            data: [
                { name: "Password", value: "Testing Password", type: "password" },
                { name: "Website", value: "https://test.com", type: "link" }
            ],

            createdAt: "Thu Dec 30 2021 22:52:56",
            lastModifiedAt: "Thu Dec 30 2021 22:52:56"
        }
    ]
}

let jsonData = JSON.stringify(data);
let encryptedData = encrypt(jsonData, process.argv[2]);

// node sampleData.js <password>

console.log("\'\'\'\n");
console.log(encryptedData);
console.log("\n\n\'\'\'");