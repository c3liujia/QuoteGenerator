/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import ButtonWrapper from './ButtonWrapper';

import {
    Button,
    StyleSheet,
    Text,
    View,
    AsyncStorage
} from 'react-native';

export default class AddNewItemScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `Select an item`
    });

    constructor(props){
        super(props);
        this.state = {
            buttons : []
        }

        this.addItemToProject = this.addItemToProject.bind(this);
    }

    addItemToProject(itemJson){
        console.log("trying to add ", JSON.stringify(itemJson) )
        // var entryName = itemJson["itemName"]
        // var itemEntry = {}
        // itemEntry[entryName] = itemJson;
        //console.log("add "+ JSON.stringify(itemEntry) +" to currentProject in AsyncStorage then...");
        AsyncStorage.mergeItem('CurrentProjectItems', JSON.stringify(itemJson), () => {
            AsyncStorage.getItem('CurrentProjectItems').then((result) =>{
                if (result){
                    console.log("CurrentProjectItems is now:  ", result)
                }
            });
            //console.log('adding to currentproject ', JSON.stringify(itemEntry))
        }).then(() => {
            let updateParent = this.props.navigation.state.params.update;
            if(typeof updateParent === 'function'){
                updateParent();
                console.log('updating')
            }
            this.props.navigation.goBack();
            }
        );
    }

    componentWillMount(){
        var nameList = [];
        var nameListButtons = [];
        AsyncStorage.getItem('Items').then((result) =>{
            console.log("found ", result)
            if (result){
                nameList = Object.keys(JSON.parse(result));
                for (var i = 0; i < nameList.length; i++) {
                    var itemName=nameList[i];
                    //console.log(itemName === nameList[i])
                    var itemJson = {};
                    itemJson[itemName] = (JSON.parse(result)[itemName]);
                    console.log("creating buttonwrapper for ", JSON.stringify(itemJson))
                    nameListButtons.push(<ButtonWrapper key= {itemName} title={itemName} onPress = {this.addItemToProject}
                                                        jsonObj = {itemJson} />);

                }
            }
            this.setState({buttons:nameListButtons})
        })
    }

    render() {
    const { navigate } = this.props.navigation;
    return (
        <View>
            <Text>
                Select an item to add:
            </Text>
            {this.state.buttons}
        </View>
    );
  }
}

