import io from "socket.io-client";
import SocketActions from "../shared/SocketActions";

const RTC_PEER_CONFIG = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};

export default class Socket {
    constructor(socketUrl, id, roomUUID, token, localStream){
        this.id = id;
        this.roomUUID = roomUUID;
        this.localStream = localStream;
        this.userUUID_PC = new Map();
        this.token = token;

        let socket = io(socketUrl, {
            query: `token=${token}`
        });
        this.socket = socket;

        socket.on("connect", () =>{
            console.log("connected")
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

    connect(userUUID){
        console.log("peer connect", userUUID)
        let pc = new RTCPeerConnection(RTC_PEER_CONFIG);
        this.userUUID_PC.set(userUUID, pc);
        pc.createDataChannel("text");

        pc.onaddstream = (e) =>{
            console.log('pc.onaddstream')
        };

        pc.onicecandidate = (e) =>{
            this.socket.emit(SocketActions.NEW_ICE_CANDIDATE, {
                candidate: e.candidate,
                roomUUID: this.roomUUID,
            })
        };

        //for subsequent connections
        pc.ondatachannel = () =>{
            console.log('on data channel')
        };

        pc.addStream(this.localStream);
        return pc.createOffer()
        .then(description =>{
            pc.setLocalDescription(description);
            console.log("send video offer")
            this.socket.emit(SocketActions.VIDEO_OFFER, {
                roomUUID: this.roomUUID,
                description
            })
        });

    }

    answer(userUUID, description){
        let desc = new RTCSessionDescription(description);
        let pc = new RTCPeerConnection(RTC_PEER_CONFIG);

        console.log("send answer", "userUUID:", userUUID, description)
        pc.setRemoteDescription(desc);
        this.userUUID_PC.set(userUUID, pc);

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
}
