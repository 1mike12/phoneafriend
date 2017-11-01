import io from "socket.io-client";
import SocketActions from "./SocketActions";

const RTC_PEER_CONFIG = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};


export default class WebRTC_Wrapper {

    constructor(params){

        for (let key in params) {
            this[key] = params[key];
        }
        // this.id = id;
        // this.roomUUID = roomUUID;
        // this.localStream = localStream;
        // this.token = token;
        // this.onRemoteStreamAdded = onRemoteStreamAdded;

        this.userUUID_PC = new Map();
        console.log(this.socketUrl)
        let socket = io(this.socketUrl, {
            query: `token=${this.token}`
        });
        this.socket = socket;

        socket.on("connect", () =>{
            socket.emit(SocketActions.JOIN_ROOM, {uuid: this.roomUUID}, (userUUIDS) =>{
                if (userUUIDS.length > 0){
                    userUUIDS.forEach(userUUID => this.connect(userUUID))
                } else {
                    //wait for connections
                }
            });
        });

        socket.on(SocketActions.VIDEO_ANSWER, (res) =>{
            let {userUUID, description} = res;
            this.receiveAnswer(userUUID, description);
        });

        //answerer
        socket.on(SocketActions.VIDEO_OFFER, (res) =>{
            console.log("received video offer")
            let {userUUID, roomUUID, description} = res;
            this.answer(userUUID, description)
        });

        //shared
        socket.on(SocketActions.NEW_ICE_CANDIDATE, (res) =>{
            console.log("receive ice candidate")
            let {userUUID, candidate} = res;
            try {
                let rtcCandidate = new RTCIceCandidate(candidate);
                let pc = this.userUUID_PC.get(userUUID);
                pc.addIceCandidate(rtcCandidate);
            } catch (e) {
                console.log(e)
            }
        });

        socket.on(SocketActions.USER_JOINED_ROOM, () =>{

        });
    }

    getPeerConnection(userUUID){
        let pc = new RTCPeerConnection(RTC_PEER_CONFIG);
        this.userUUID_PC.set(userUUID, pc);

        pc.onaddstream = (e) =>{
            console.log('stream added')
            this.onRemoteStreamAdded(e.stream)
        };

        pc.oniceconnectionstatechange = (e) =>{
            if (e.target.iceConnectionState === 'connected'){
                console.log('connected')
            }
        };

        pc.onicecandidate = (e) =>{
            this.socket.emit(SocketActions.NEW_ICE_CANDIDATE, {
                candidate: e.candidate,
                roomUUID: this.roomUUID,
            })
        };

        //only answerer gets this event
        pc.ondatachannel = (e) =>{
            if (!pc.text){
                let text = e.channel;
                WebRTC_Wrapper.attachDataChannelFunctions(text);
                pc.text = text;
            }
        };
        return pc;
    }

    connect(userUUID){
        console.log("connect(). Send video offer to:", userUUID)

        let pc = this.getPeerConnection(userUUID)
        let text = pc.createDataChannel("text");
        pc.text = text;

        WebRTC_Wrapper.attachDataChannelFunctions(text);

        pc.addStream(this.localStream);
        return pc.createOffer()
        .then(description =>{
            pc.setLocalDescription(description);
            this.socket.emit(SocketActions.VIDEO_OFFER, {
                roomUUID: this.roomUUID,
                description
            })
        });
    }

    answer(userUUID, description){
        console.log("send answer to userUUID:", userUUID)

        let desc = new RTCSessionDescription(description);
        let pc = this.getPeerConnection(userUUID)
        this.userUUID_PC.set(userUUID, pc);

        pc.setRemoteDescription(desc);
        pc.addStream(this.localStream);

        return pc.createAnswer()
        .then(description =>{
            pc.setLocalDescription(description);
            this.socket.emit(SocketActions.VIDEO_ANSWER, {
                userUUID,
                roomUUID: this.roomUUID,
                description
            })
        })
        .catch(e =>{
            throw e;
        })
    }

    receiveAnswer(userUUID, desc){
        console.log("received answer", arguments)
        let description = new RTCSessionDescription(desc);
        let pc = this.userUUID_PC.get(userUUID);
        pc.setRemoteDescription(description)
    }

    send(message){
        for (let pc of this.userUUID_PC.values()) {
            pc.text.send(message)
        }
    }

    static attachDataChannelFunctions(dataChannel){
        dataChannel.onopen = (event) =>{
            console.log("dataChannel.OnOpen");
        };
        dataChannel.onmessage = (event) =>{
            console.log("dataChannel.OnMessage:", event.data);
        };
        dataChannel.onerror = (error) =>{
            console.log("dataChannel.OnError:", error);
        };
        dataChannel.onclose = (event) =>{
            console.log("dataChannel.OnClose", event);
        };
    }
}
