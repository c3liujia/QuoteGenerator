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
    TextInput,
    View,
    Dimensions,
    TouchableHighlight,
    AsyncStorage
} from 'react-native';

export default class ButtonWrapper extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `Create Item`
    });

    constructor(props) {
        super(props);

        this.buttonPressed = this.buttonPressed.bind(this);
    }


    buttonPressed(obj){
        this.props.onPress(obj);
    }

    render() {
        //console.log("create rendered")
        return (
          <View
              onLayout={(e) =>{
                        this.setState({screenWidth:e.nativeEvent.layout.width});
                        }
              }
          >
              <Button key={this.props.title} title={this.props.title}
                      onPress={()=>this.buttonPressed(this.props.jsonObj)}
                      accessibilityLabel="Add itemName to project"></Button>
          </View>
        );
    }
};

