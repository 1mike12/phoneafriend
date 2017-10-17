import freeice from "freeice";
import Authentication from "./Authentication";
import Config from 'react-native-config'

class RTC_Service {
    constructor(){
        this.setupSocket()
    }

    static getStunServers(){
        return freeice()
    }
}

export default RTC_Service;