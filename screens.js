import { Navigation } from 'react-native-navigation';

import Home from './components/Home';
import Login from './components/Login';
import Request from './components/Request';

// register all screens of the app (including internal ones)
export function registerScreens() {
    Navigation.registerComponent('phoneafriend.Home', () => Home);
    Navigation.registerComponent('phoneafriend.Login', () => Login);
    Navigation.registerComponent('phoneafriend.Request', () => Request);
}