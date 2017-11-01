import io from "socket.io-client";

require("!style-loader!css-loader!./styles/styles.css");
import RTC_Wrapper from "../shared/RTC_Wrapper";

const UUID = 1;

const VIDEO_SIZE = {width: {exact: 320}, height: {exact: 240}};

class Socket {
    constructor(id, token){
        this.id = id;
        this.token = token;

        let socket = io("http://localhost:9009", {
            query: `token=${this.token}`
        });
        this.socket = socket;

        let pc = new RTCPeerConnection({"iceServers": [{"url": "stun:stun.l.google.com:19302"}]});
        this.pc = pc;

        const onOpen = (event) =>{
            console.log("dataChannel.OnOpen");
        };

        const onMessage = (event) =>{
            console.log("dataChannel.OnMessage:", event.data);
        };

        const onError = (error) =>{
            console.log("dataChannel.OnError:", error);
        };

        const onClose = (event) =>{
            console.log("dataChannel.OnClose", event);
        };


        let sendChannel = pc.createDataChannel('text', {});
        sendChannel.onopen = onOpen;
        sendChannel.onmessage = onMessage;
        sendChannel.onerror = onError;
        sendChannel.onclose = onClose;


        pc.ondatachannel = (event) =>{
            console.log("on data channel")
            let receiveChannel = event.channel;
            receiveChannel.onopen = onOpen;
            receiveChannel.onmessage = onMessage;
            receiveChannel.onerror = onError;
            receiveChannel.onclose = onClose;

            let button = document.getElementById(this.id + "-submit");
            button.onclick = () =>{
                sendChannel.send("hello from " + this.id)
            };
        };

        pc.onicecandidate = (e) =>{
            socket.emit('NEW_ICE_CANDIDATE', {candidate: e.candidate, uuid: UUID})
        };

        pc.onaddstream = (e) =>{
            let remoteVideo = document.getElementById(this.id + "-other");
            remoteVideo.srcObject = e.stream;
        };

        pc.oniceconnectionstatechange = (e) =>{
            if (e.target.iceConnectionState === 'connected'){

            }
        };

        socket.on("connect", () =>{
            socket.emit("joinRoom", {uuid: UUID});

            socket.on("userJoinedRoom", (othersInRoom) =>{
                this.caller = true;
                if (othersInRoom.length > 0){
                    this.addVideo()
                    .then(() => this.createOffer());
                }
            })
        });

        socket.on('VIDEO_OFFER', (res) =>{
            let {userId, description} = res;
            this.createAnswer(description)

        });

        socket.on("VIDEO_ANSWER", (res) =>{
            this.receiveAnswer(res.description);
        });

        socket.on("NEW_ICE_CANDIDATE", (res) =>{
            let {candidate} = res;
            try {
                let rtcCandidate = new RTCIceCandidate(candidate);
                this.pc.addIceCandidate(rtcCandidate);
            } catch (e) {
                console.log(e)
            }

        });
    }

    createAnswer(description){
        let desc = new RTCSessionDescription(description);
        this.pc.setRemoteDescription(desc);

        return this.addVideo()
        .then(() => this.pc.createAnswer())
        .then(localDescription =>{
            this.pc.setLocalDescription(localDescription);
            this.socket.emit("VIDEO_ANSWER", {uuid: UUID, description: localDescription})
        })
        .catch(e =>{
            throw e;
        })
    }

    receiveAnswer(desc){
        let description = new RTCSessionDescription(desc);
        this.pc.setRemoteDescription(description)
    }

    createOffer(){
        return this.pc.createOffer()
        .then(description =>{
            this.pc.setLocalDescription(description);
            this.socket.emit("VIDEO_OFFER", {uuid: UUID, description})
        })
    }

    addVideo(){
        return navigator.mediaDevices.getUserMedia({
            audio: true,
            video: VIDEO_SIZE
        })
        .then(stream =>{
            this.pc.addStream(stream);
            let video = document.getElementById(this.id);
            video.srcObject = stream;
        })
    }

}

//    let socket1 = new Socket("1", "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjExNDF9.FhKsOogaLFJBixiZWOZWnZDyfPXMANSG7dBA96CyhIM");
let socket2 = new Socket('2', "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjJ9.7pWxwmRmTcOnCzrLd2brSrRxKuQuWSnp_X9ewmwJxk4")