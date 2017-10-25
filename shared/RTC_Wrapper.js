import io from "socket.io-client";
import SocketActions from "./SocketActions";

const RTC_PEER_CONFIG = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
export default class RTC_Wrapper {

    /**
     *
     * @param socketUrl
     * @param token
     * @param roomUUID
     * @param getUserMedia
     */
    constructor(socketUrl, token, roomUUID, getUserMedia){

        this.userUUID_PC = new Map();
        this.getUserMedia = getUserMedia;
        this.roomUUID = roomUUID;

        let socket = io(socketUrl, {
            query: `token=${token}`
        });
        this.socket = socket;

        //caller
        socket.on("connected", () =>{
            socket.emit(SocketActions.JOIN_ROOM, roomUUID, (userUUIDs) =>{
                if(userUUIDs.length > 0) {
                    userUUIDs.forEach(userUUID => this.connect(userUUID))
                } else {
                    //wait for connections
                }
            })
        });
        socket.on(SocketActions.VIDEO_ANSWER, (res) =>{
            let {userUUID, description} = res;
            this.receiveAnswer(userUUID, description);
        });


        //answerer
        socket.on(SocketActions.VIDEO_OFFER, (res) =>{
            let {userUUID, description} = res;
            this.answer(userUUID, description)
        });

        //shared
        socket.on(SocketActions.NEW_ICE_CANDIDATE, (res) =>{
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


    answer(userUUID, description){
        let desc = new RTCSessionDescription(description);
        let pc = new RTCPeerConnection(RTC_PEER_CONFIG);
        pc.setRemoteDescription(desc);
        this.userUUID_PC.set(userUUID, pc);

        return this.addVideo()
        .then(() => pc.createAnswer())
        .then(description =>{
            pc.setLocalDescription(description);
            this.socket.emit(SocketActions.VIDEO_ANSWER, {userUUID, description})
        })
        .catch(e =>{
            throw e;
        })
    }

    receiveAnswer(userUUID, desc){
        let description = new RTCSessionDescription(desc);
        let pc = this.userUUID_PC.get(userUUID);
        pc.setRemoteDescription(description)
    }

    connect(userUUID){
        let pc = new RTCPeerConnection(RTC_PEER_CONFIG);
        this.userUUID_PC.set(userUUID, pc);
        pc.createDataChannel("text");

        pc.onaddstream = (e) =>{

        };

        pc.onicecandidate = (e) =>{
            this.socket.emit(SocketActions.NEW_ICE_CANDIDATE, {candidate: e.candidate, userUUID})
        };

        //for subsequent connections
        pc.ondatachannel = () =>{

        };

        this.getUserMedia()
        .then(stream =>{
            pc.addStream(stream);
            return pc.createOffer()
        })
        .then(description =>{
            pc.setLocalDescription(description);
            this.socket.emit(SocketActions.VIDEO_OFFER, {uuid: this.roomUUID, description})
        });

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