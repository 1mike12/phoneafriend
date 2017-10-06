import {MediaStreamTrack, getUserMedia} from "react-native-webrtc";
import Promise from "bluebird";

class StreamService {

    constructor(){
        this.sources = null;
    }

    getFrontStream(){
        let videoId = this.getFrontVideoIds()[0];
        return this.getStream(videoId)
    }

    getBackStream(){
        let videoId = this.getBackVideoIds()[0];
        return this.getStream(videoId)
    }

    getStream(videoId){
        let isFront = true;

        return this.loadStreams()
        .then(() => getUserMedia({
            audio: true,
            video: {
                mandatory: {
                    minWidth: 1280, // Provide your own width, height and frame rate here
                    minHeight: 720,
                    minFrameRate: 15
                },
                facingMode: (isFront ? "user" : "environment"),
                optional: (videoId ? [{sourceId: videoId}] : [])
            }
        }))
        .then(stream =>{
            let exampleStream = {
                "active": true,
                "_tracks": [
                    {
                        "_enabled": true,
                        "id": "3992baa2-d545-427f-b40f-1eef852bf5fc",
                        "kind": "audio",
                        "label": "audio",
                        "muted": false,
                        "readonly": true,
                        "remote": false,
                        "readyState": "live"
                    },
                    {
                        "_enabled": true,
                        "id": "55f758d5-75d7-4dcb-8e0a-68fdad59130a",
                        "kind": "video",
                        "label": "video",
                        "muted": false,
                        "readonly": true,
                        "remote": false,
                        "readyState": "live"
                    }
                ],
                "id": "0407ff74-fa8b-4c64-a534-ae79b7eb9167",
                "reactTag": "0407ff74-fa8b-4c64-a534-ae79b7eb9167"
            };
            return stream
        });
    }

    getFrontVideoIds(){
        return this.sources
        .filter(source => (source.kind === "video" && source.facing === "front") ? source.id : false)
        .map(source => source.id);
    }

    getBackVideoIds(){
        return this.sources
        .filter(source => (source.kind === "video" && source.facing === "back") ? source.id : false)
        .map(source => source.id);
    }

    getAudioIds(){
        return this.sources
        .filter(source => (source.kind === "audio") ? source.id : false)
        .map(source => source.id);
    }

    /**
     * only runs once
     */
    loadStreams(){
        if(this.sources) return Promise.resolve(this.sources);

        return MediaStreamTrack
        .getSources()
        .then(sourceInfos =>{
            this.sources = sourceInfos;
            let exampleSourceInfos = [{
                "kind": "video",
                "facing": "back",
                "id": "0",
                "label": "Camera 0, Facing back, Orientation 90"
            }, {
                "kind": "video",
                "facing": "front",
                "id": "1",
                "label": "Camera 1, Facing front, Orientation 90"
            }, {
                "kind": "audio", "facing": "", "id": "audio-1", "label": "Audio"
            }];
            return this.sources;
        })
    }
}

export default new StreamService();