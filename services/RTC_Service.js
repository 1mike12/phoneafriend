import freeice from "freeice";

class RTC_Service {
    constructor(){

    }

    static getStunServers(){
        return freeice()
    }
}

export default RTC_Service;