/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { StackNavigator } from 'react-navigation';

import CreateProject from './createProject';
import CreateItemScreen from './createItem';

class HomeComponent extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `Back`,
        headerTitle: 'Home'
    });

    render() {
        const { navigate } = this.props.navigation;
        return (
          <View style={styles.home}>
            <Button title="Create Project" onPress={()=>navigate('CreateProject')}
                    accessibilityLabel="Create a new project">
            </Button>
              <Button title="Create Item" onPress={()=>navigate('CreateItem')}
                      accessibilityLabel="Load a previous project">
                </Button>
          </View>
        );
    }
}

let styles = StyleSheet.create({
    home: {
        paddingTop: 50,
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }

});



const StackNav = StackNavigator({
    Home: {screen: HomeComponent},
    CreateProject: { screen: CreateProject,
        navigationOptions: ({navigation}) => ({
        headerBackTitle: `s Profile'`,
        })
    },
    CreateItem: { screen: CreateItemScreen},
    }
);

export default class Home extends Component {
    render(){
        return(
            <StackNav onNavigationStateChange={null}/>
        )
    }
}
