import axios from 'axios'
import config from "../configReact";
import Authentication from "./Authentication";

class http {
    constructor(){

        let baseURL = "http://phoneafriend.ngrok.io/";
        let savedToken = Authentication.getToken();

        this.axios = axios.create({
            headers: {'Token': savedToken ? savedToken : null},
            baseURL: baseURL
        });
        //
        // this.axios.interceptors.request.use(request => {
        //     console.log('Request:', request)
        //     return request
        // })
    }

    setToken(token){
        this.axios.defaults.headers = {'Token': token}
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