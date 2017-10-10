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
    TextInput,
    Dimensions,
    AsyncStorage
} from 'react-native';

export default class GenerateQuoteScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `Generate Quote`
    });

    constructor(props){
        super(props);
        this.state ={
            screenWidth: Dimensions.get("window").width,
            text: "",
            price: 0
        }
    }

    componentDidMount(){
        var text ="";
        var totalPrice = 0;
        try {
            AsyncStorage.getItem('CurrentProjectItems').then((result) =>{
                if (result) {
                    console.log("current project: ", result)
                    var resultJson = JSON.parse(result)
                    var currentItemsList = Object.keys(resultJson);
                    var entry = {};
                    for (var i = 0; i < currentItemsList.length; i++) {
                        entry = resultJson[currentItemsList[i]]
                        //console.log("Entry ", i,": ", JSON.stringify(entry));
                        text += entry.displayName +"\n";
                        //iterate through subitems
                        for (var j = 0; j < entry.includes.length; j++){
                            text += "\t-" + entry.includes[j].displayName
                            if (parseInt(entry.includes[j].qty) > 1){
                                text += "\t["+entry.includes[j].qty+"]"
                            }
                            text+= "\n"
                        }
                        text+= "\n"
                        totalPrice += parseInt(entry.standardRate)*
                            parseInt(entry.units)*
                            parseInt(entry.qty)

                    }
                    text+= "\nPrice: $"+totalPrice.toString();
                    //console.log("Quote: \n" + text)
                    this.setState({text})
                }
            })
        } catch (error) {
            // Error retrieving data
            console.log(error);
        }
    }
    goBack(){

        this.props.navigation.goBack();
    }
  render() {
    return (
      <View style={styles.home}>
          <View style={styles.inputRow}>
              <TextInput
                  multiline={true}
                  numberOfLines={40}
                  style={{width:0.9*this.state.screenWidth}}
                  onChangeText={(text) => this.setState({text})}
                  value={this.state.text}
              />
          </View>

          <Button title="Return" onPress={()=>this.goBack()}
                accessibilityLabel="Create a new project">
          </Button>

      </View>
    );
  }
}

const styles = StyleSheet.create({
    home: {
        paddingTop: 50,
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    inputRow:{
        flexDirection: 'row',
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft:20
    },

});

