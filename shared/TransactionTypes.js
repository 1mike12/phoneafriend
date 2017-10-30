class TransactionTypes {
    static getTypesAsArray(){
        return Object.getOwnPropertyNames(TransactionTypes)
        .filter(key => key === key.toUpperCase())
    }
}

//KEY and VALUE MUST be capital case, or will break getTypesAsArray()
TransactionTypes.DEPOSIT = "DEPOSIT";
TransactionTypes.WITHDRAWAL = "WITHDRAWAL"
TransactionTypes.GIFT = "GIFT";
TransactionTypes.BONUS = "BONUS";
TransactionTypes.PAYMENT = "PAYMENT";

module.exports = TransactionTypes;