import http from "../services/http";

const URI = "api/skill";
export default class Skill{

    constructor(obj){
        Object.assign(this, obj);
    }

    delete(){
        return http.delete(URI, {uuid: this.uuid})
    }

    update(){
        return http.post(URI, this)
    }

    save(){
        return http.post(URI, this)
        .then(res=> this.constructor(res))
    }
}