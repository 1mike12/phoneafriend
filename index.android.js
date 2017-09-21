import { Navigation } from 'react-native-navigation';

import { registerScreens } from './screens';

registerScreens();

const icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==';
// start the app
Navigation.startTabBasedApp({
    tabs: [
        {
            label: 'Login',
            screen: 'phoneafriend.Login',
            icon: icon,
            selectedIcon: icon, // iOS only
            title: 'Login'
        },
        {
            label: 'Home',
            screen: 'phoneafriend.Home', // this is a registered name for a screen
            icon: icon,
            selectedIcon: icon, // iOS only
            title: 'Home'
        },
        {
            label: 'Home',
            screen: 'phoneafriend.Home', // this is a registered name for a screen
            icon: icon,
            selectedIcon: icon, // iOS only
            title: 'Home'
        },
    ]
});