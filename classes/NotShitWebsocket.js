export default class NonShitWebSocket {
    constructor(domain, protocol){
        this.ws = new WebSocket(domain, protocol)
    }

    onOpen(callback){
        this.ws.addEventListener("open", callback)
    }

    onMessage(callback){
        this.ws.addEventListener('message', function(event){
            let data = event.data;
            if (!data) return "";

            try {
                callback(JSON.parse(data))
            }
            catch (e) {
                callback(data)
            }
        });
    }

    /**
     * @param {Object|String} message
     */
    send(message){
        if (typeof  message === "string"){
            this.ws.send(message)
        } else if (typeof message === "object"){
            this.ws.send(JSON.stringify(message))
        } else {
            throw new Error("can't send message not string or object")
        }

    }

    close(){
        this.ws.close();
    }
}