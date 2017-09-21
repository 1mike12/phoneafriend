import Config from 'react-native-config';
console.log(Config);
console.log(Config.HOST);

export default {
    domain: __DEV__ ? Config.HOST : "http://something.com",
    name: "phoneafriend"
};