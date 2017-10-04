import {Navigation} from 'react-native-navigation';

import Home from './screens/Home';
import Login from './screens/Login';
import SessionScreen from './screens/SessionScreen';
import MySkills from "./screens/MySkills";
import DeleteSkillModal from "./screens/DeleteSkillModal";
import SessionEditScreen from "./screens/SessionEditScreen";
import HelpableSessionsScreen from "./screens/HelpableSessionsScreen";
import ActiveSessionScreen from "./screens/ActiveSessionScreen";
import AccountScreen from "./screens/AccountScreen";
import CallScreen from "./screens/CallScreen";
import CreateAccountScreen from "./screens/CreateAccountScreen";

// register all screens of the app (including internal ones)
export function registerScreens(){
    [
        Home,
        Login,
        SessionScreen,
        SessionEditScreen,
        MySkills,
        DeleteSkillModal,
        HelpableSessionsScreen,
        ActiveSessionScreen,
        AccountScreen,
        CallScreen,
        CreateAccountScreen
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