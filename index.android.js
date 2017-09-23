import {Navigation} from 'react-native-navigation';
import {registerScreens} from './screens';
import config from "./configReact";
import Authentication from "./services/Authentication";
import http from "./services/http";
import Login from "./screens/Login";
import Home from "./screens/Home";
import MySkills from "./screens/MySkills";

registerScreens();

const icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==';
// start the app

Authentication.loadToken()
.then(token => {
    if (token) {
        http.setToken(token);
        launchApp();
    } else {
        //go to login screen;
        launchApp();
    }
});

function launchApp(){
    Navigation.startTabBasedApp({
        tabs: [
            {
                label: 'Login',
                screen: Login.getName(),
                icon: icon,
                selectedIcon: icon, // iOS only
                title: 'Login'
            },
            {
                label: 'Home',
                screen: Home.getName(), // this is a registered name for a screen
                icon: icon,
                selectedIcon: icon, // iOS only
                title: 'Home'
            },
            {
                label: 'Skills',
                screen: MySkills.getName(), // this is a registered name for a screen
                icon: icon,
                selectedIcon: icon, // iOS only
                title: 'Skills'
            },
        ],
        appStyle: {
            orientation: 'portrait', // Sets a specific orientation to the entire app. Default: 'auto'. Supported values: 'auto', 'landscape', 'portrait'
            bottomTabBadgeTextColor: 'red', // Optional, change badge text color. Android only
            bottomTabBadgeBackgroundColor: 'green', // Optional, change badge background color. Android only
            hideBackButtonTitle: false, // Hide back button title. Default is false. If `backButtonTitle` provided so it will take into account and the `backButtonTitle` value will show. iOS only
            tabBarButtonColor: '#ff7600', // optional, change the color of the tab icons and text (also unselected). On Android, add this to appStyle
            tabBarSelectedButtonColor: '#571cff', // optional, change the color of the selected tab icon and text (only selected). On Android, add this to appStyle
            tabBarBackgroundColor: '#FFF', // optional, change the background color of the tab bar,
            initialTabIndex: 1,
        },
        passProps: {}, // simple serializable object that will pass as props to all top screens (optional)
        animationType: 'slide-down' // optional, add transition animation to root change: 'none', 'slide-down', 'fade'
    });
}
