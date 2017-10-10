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
  View,
    TouchableOpacity
} from 'react-native';

import { StackNavigator } from 'react-navigation';

import ItemsScreen from './itemsScreen';
import GenerateQuote from './generateQuote';

class CreateProjectComponent extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `Current Project`,
        headerBackTitle:  'Profile',
        // headerLeft: <TouchableOpacity onPress={() => navigation.goBack()}>
        //     <Text>Back</Text>
        // </TouchableOpacity>
    });

    constructor(props){
        super(props);
        this.state ={
            items:[],
            itemsObj: []
        }
    }

  render() {
      const { navigate } = this.props.navigation;
    return (
      <View style={styles.home}>
          {this.state.itemsObj}
        <Button title="Current Items" onPress={()=>navigate('CurrentItems')}
                accessibilityLabel="Create a new project">
        </Button>
        <Button title="Generate Quote" onPress={()=>navigate('GenerateQuote')}
                accessibilityLabel="Quit the app">
        </Button>
      </View>
    );
  }
}
export default CreateProject = StackNavigator({
        Current: {screen: CreateProjectComponent},
        CurrentItems: {screen: ItemsScreen},
        GenerateQuote: {screen: GenerateQuote}
    },
    { headerMode: 'none' }
);

const styles = StyleSheet.create({
    home: {
        paddingTop: 50,
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }

});

