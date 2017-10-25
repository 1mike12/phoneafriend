import React from 'react';

export default class _MinimalScreen extends React.Component {

    constructor(props){
        super(props);
        this.props.navigator.toggleTabs({
            to: 'hidden', // required, 'hidden' = hide tab bar, 'shown' = show tab bar
            animated: false // does the toggle have transition animation or does it happen immediately (optional)
        });
        this.props.navigator.toggleNavBar({
            to: 'hidden', // required, 'hidden' = hide navigation bar, 'shown' = show navigation bar
            animated: false // does the toggle have transition animation or does it happen immediately (optional). By default animated: true
        });
    }
}