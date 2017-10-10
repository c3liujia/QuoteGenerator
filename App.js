import React from 'react';
import {
    AppRegistry,
    Text,
    View,
    Button
} from 'react-native';

import Home from './components/home';

import { StackNavigator } from 'react-navigation';

export default QuoteApp = StackNavigator({
    HomePage: { screen: Home }
    },
    { headerMode: 'none' }

);

// if you are using create-react-native-app you don't need this line
AppRegistry.registerComponent('QuoteApp', () => QuoteApp);
