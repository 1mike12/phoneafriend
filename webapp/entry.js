require("!style-loader!css-loader!./styles/styles.css");
import WebRTC_Wrapper from "../shared/WebRTC_Wrapper";

const VIDEO_SIZE = {width: {exact: 320}, height: {exact: 240}};
let stream;

navigator.mediaDevices.getUserMedia({
    audio: false,
    video: VIDEO_SIZE
})
.then(s =>{
    stream = s;
    let params = {
        socketUrl : "http://localhost:9009",
        id : "1",
        roomUUID: "A",
        token: "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjExNDF9.FhKsOogaLFJBixiZWOZWnZDyfPXMANSG7dBA96CyhIM",
        localStream: stream,
        onRemoteStreamAdded: (stream) =>{
            let remoteVideo = document.getElementById("1" + "-other");
            remoteVideo.srcObject = stream;
        }
    }
    let socket1 = new WebRTC_Wrapper(params);
    let video1 = document.getElementById("1");
    video1.srcObject = stream;

    let button = document.getElementById("1-submit");
    button.onclick = () =>{
        socket1.send("hello from peer 1")
    };


    return new Promise(resolve => setTimeout(resolve, 150))
})
.then(() =>{
    let params = {
        socketUrl : "http://localhost:9009",
        id : "2",
        roomUUID: "A",
        token: "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjJ9.7pWxwmRmTcOnCzrLd2brSrRxKuQuWSnp_X9ewmwJxk4",
        localStream: stream,
        onRemoteStreamAdded: (stream) =>{
            let remoteVideo = document.getElementById("2" + "-other");
            remoteVideo.srcObject = stream;
        }
    }
    let socket2 = new WebRTC_Wrapper(params);

    let video2 = document.getElementById("2");
    video2.srcObject = stream;

    let button = document.getElementById("2-submit");
    button.onclick = () =>{
        socket2.send("hello from peer 2")
    };
})

