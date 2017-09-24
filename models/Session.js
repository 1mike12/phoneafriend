import http from "../services/http";
import Skill from "./Skill";
import User from "./User";

const URI = "api/session";
export default class Session {

    constructor(obj){
        if (!obj){
            obj = {
                id: null,
                title: "",
                description: "",
                skills: []
            }
        }
        Object.assign(this, obj);

        if (obj.id) this.key = obj.id;

        if (obj.skills){
            this.skills = obj.skills.map(skillJson => new Skill(skillJson))
        } else {
            this.skills = [];
        }

        if (obj.pupil) this.pupil = new User(obj.pupil);
        if (obj.teacher) this.teacher = new User(obj.teacher);
    }

    delete(){
        return http.delete(URI, {id: this.id})
    }

    save(){
        return http.post(URI, this)
    }
}