import http from "../services/http";
import Skill from "./Skill";

const URI = "api/session";
export default class Session{

    constructor(obj){
        Object.assign(this, obj);
        this.key = obj.id;

        if (obj.skills){
            this.skills = obj.skills.map(skillJson=> new Skill(skillJson))
        } else {
            this.skills = [];
        }
    }

    delete(){
        return http.delete(URI, {id: this.id})
    }

    update(){
        return http.post(URI, this)
    }

    save(){
        return http.post(URI, this)
        .then(res=> this.constructor(res))
    }
}