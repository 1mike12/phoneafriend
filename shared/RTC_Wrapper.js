import io from "socket.io-client";

export default class RTC_Wrapper {

    constructor(socketUrl, token){
        let socket = io(socketUrl, {
            query: `token=${token}`
        })
        this.socket = socket;
    }

    sendMessage(){

    }

    shutoffCamera(){

    }

    onConnectedToServer(cb){

    }

    getStreamUrls(){

    }

    onNewStream(cb){

    }


}