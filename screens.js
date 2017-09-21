import { Navigation } from 'react-native-navigation';

import Home from './components/Home';
import Login from './components/Login';
import Request from './components/Request';
import config from "./configReact";
import MySkills from "./components/MySkills";

// register all screens of the app (including internal ones)
export function registerScreens() {
    register(Home);
    register(Login);
    register(Request);
    register(MySkills);
}

/**
 * whacky way that wix registers screens
 * @param Screen
 */
function register(Screen){
    Navigation.registerComponent(`${config.name}.${Screen.getName()}`, ()=> Screen)
}