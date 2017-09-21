import {AsyncStorage} from "react-native";

class Authentication {
    constructor(){
        this.token = null;
    }

    loadToken(){
        return AsyncStorage.getItem("token")
        .then(token =>{
            if (token){
                this.token = token;
                return token;
            } else {
                return null;
            }
        })
    }

    commitToken(token){
        this.token = token;
        return AsyncStorage.setItem("token", token)
    }

    setToken(token){
        this.token = token;
    }

    getToken(){
        return this.token;
    }
}

export default new Authentication();