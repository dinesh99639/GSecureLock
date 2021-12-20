let exports = {};

exports.newAccountData = {
    config: {
        timer: 5,
    },
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