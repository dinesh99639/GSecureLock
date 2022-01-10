let exports = {};

exports.staticCategories =  ['Passwords', 'API Keys', 'Cards', 'Coupons'];

exports.newAccountData = {
    templates: [{
        id: "T1",
        user: "",
        category: "",
        name: "Default",
        data: []
    }],
    credentials: []
}

exports.cardData = {
    network: "",
    cardName: "",
    cardType: "",
    cardNo: "",
    validThru: "",
    cardHolderName: "",
    CVV: ""
}

export default exports;