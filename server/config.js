module.exports = {
    name: "Phone a Friend",
    port: 8009,
    testPort: 9009,
    jwtSecret: "1231352tSDQ@#)6",
    databaseName: "phoneafriend",
    get databaseNameTest(){
        return this.databaseName + "_test"
    },
    firebaseServerKey: "AAAAKxnSVJw:APA91bHI9ToUmIsYpkqLf3vw21xGcqgjQ_aogPtfDiqeok1myZv7vxvNIGDeHCyj5RAdUD_klPXzK5GVBsRIdfeBj3CLN08L692q2RCD9vlND2R8d3zdHUbeYBFPZTL1fa7EMixVtYLP",
    firebaseSenderId : "185116808348"
};