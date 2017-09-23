import {Navigation} from 'react-native-navigation';

import Home from './components/Home';
import Login from './components/Login';
import Request from './components/Request';
import MySkills from "./components/MySkills";
import DeleteSkillModal from "./components/DeleteSkillModal";
import SessionEdit from "./components/SessionEdit";

// register all screens of the app (including internal ones)
export function registerScreens(){
    [
        Home,
        Login,
        Request,
        SessionEdit,
        MySkills,
        DeleteSkillModal
    ]
    .forEach(register);
}

/**
 * whacky way that wix registers screens
 * @param screen
 */
function register(screen){
    Navigation.registerComponent(screen.getName(), () => screen)
}