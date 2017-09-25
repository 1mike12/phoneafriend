import axios from 'axios'
import config from "../configReact";
import Authentication from "./Authentication";

class http {
    constructor(){
        this.axios = axios.create({
            baseURL: config.domain,
            headers: {'Token': Authentication.getToken()}
        })
    }

    setToken(token){
        this.axios = axios.create({
            baseURL: config.domain,
            headers: {'Token': token}
        })
    }

    get(url, data){
        return this.axios.get(url, data)
    }

    post(url, data){
        return this.axios.post(url, data)
    }

    delete(url, data = {}){
        return this.axios.delete(url, {data})
    }

}

export default new http();