import Config from 'react-native-config';

export default {
    domain: __DEV__ ? Config.HOST : "http://something.com",
    name: "phoneafriend"
};