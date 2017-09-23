import http from "../services/http";

const URI = "api/user";
export default class User{

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

    getFirstAndInitial(){
        return `${this.first_name} ${this.last_initial}.`
    }

    getFullName(){
        if (this.first_name && this.last_name) return `${this.first_name} ${this.last_name}`
        throw new Error("can't get full name, missing data")
    }
}