module.exports = {
    name: "Phone a Friend",
    port: 8009,
    testPort: 9009,
    jwtSecret: "1231352tSDQ@#)6",
    databaseName: "phoneafriend",
    get databaseNameTest(){
        return this.databaseName + "_test"
    }
};