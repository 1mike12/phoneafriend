require("!style-loader!css-loader!./styles/styles.css");
import RTC_Wrapper from "../shared/RTC_Wrapper";
import Socket from "./Socket";

const VIDEO_SIZE = {width: {exact: 320}, height: {exact: 240}};
let stream;

navigator.mediaDevices.getUserMedia({
    audio: false,
    video: VIDEO_SIZE
})
.then(s =>{
    stream = s;
    let socket1 = new Socket("http://localhost:9009", '1', "A", "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjExNDF9.FhKsOogaLFJBixiZWOZWnZDyfPXMANSG7dBA96CyhIM", stream);
    let video1 = document.getElementById(socket1.id);
    video1.srcObject = stream;

    return new Promise(resolve=> setTimeout(resolve, 150))
})
.then(()=> {
    let socket2 = new Socket("http://localhost:9009", '2', "A", "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjJ9.7pWxwmRmTcOnCzrLd2brSrRxKuQuWSnp_X9ewmwJxk4", stream);
    let video2 = document.getElementById(socket2.id);
    video2.srcObject = stream;
})

