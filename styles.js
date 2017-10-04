import {StyleSheet} from "react-native";

export default {
    h1: {
        fontSize: 24,
        fontWeight: "bold"
    },
    h2: {
        fontSize: 18
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 2,
        shadowColor: '#000',
        shadowRadius: 5,
        shadowOffset: {
            height: 2,
            width: 2,
        },
        padding: 16,
        marginBottom: 8,
        elevation: 2,
    },
    listItem: {
        fontSize: 16,
        height: 48,
        textAlignVertical: "center"
    },
    primary: "#3F51B5",
    profilePic: {
        borderRadius: 900,
        height: 40,
        width: 40
    },
    profilePicLarge: {
        borderRadius: 900,
        height: 100,
        width: 100
    },
    autoCompleteContainer: {
        left: 0,
        position: 'absolute',
        right: 0,
        top: 175,
        zIndex: 1
    },
    itemText: {
        fontSize: 15,
        margin: 2
    },
}