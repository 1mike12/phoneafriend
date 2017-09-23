import http from "../services/http";

const URI = "api/skill";
export default class Skill{

    constructor(obj){
        Object.assign(this, obj);
        this.key = obj.id;
    }

    delete(){
        return http.delete(URI, {id: this.id})
    }

    update(){
        return http.post(URI, this)
    }

    save(){
        return http.post(URI, this)
    }
}