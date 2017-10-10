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
    AsyncStorage
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import AddNewItemScreen from './addNewItemScreen';
import EditItemComponent from './editItemComponent';
import ButtonWrapper from './ButtonWrapper';

class AddItemComponent extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `Current items`,
        headerBackTitle: `Current Project`
    });

    constructor(props){
        super(props);
        this.state ={
            buttons: []
        }
        this.updateButtons = this.updateButtons.bind(this);
    }
    componentWillMount(){
        this.updateButtons();
    }
    updateButtons(){
        var { navigate } = this.props.navigation
        var currentItemsList = [];
        var currentItemsButtons = [];
        AsyncStorage.getItem('CurrentProjectItems').then((result) =>{
            if (result) {
                currentItemsList = Object.keys(JSON.parse(result));
                for (var i = 0; i < currentItemsList.length; i++) {
                    var itemName=currentItemsList[i];
                    var itemJson = (JSON.parse(result)[itemName]);
                    currentItemsButtons.push(<ButtonWrapper key={currentItemsList[i]} title={currentItemsList[i]}
                                                     onPress={(item)=>{
                                                         navigate('SelectedItem', {itemJson:item,
                                                         update:this.updateButtons})
                                                     }} jsonObj={ itemJson }
                                                     accessibilityLabel="Edit Item"></ButtonWrapper>);
                }
                this.setState({buttons:currentItemsButtons})
            }
        });
    }
  render() {
        //console.log('button ',this.state.buttons.length)
        const { navigate } = this.props.navigation;

        return (
            <View>
                <Text>
                    Current Items in project:
                </Text>
                {this.state.buttons}
                <Button title="Add new item" onPress={()=>navigate('NewItem', {update:this.updateButtons})}
                    accessibilityLabel="Add a new item">
                </Button>
                <Button title="Clear Items" onPress={()=>{
                                        AsyncStorage.removeItem('CurrentProjectItems', (err, test) => {
                                         });
                                        this.setState({buttons:[]})
                 }}
                        accessibilityLabel="Create a new project">
                </Button>
            </View>
        );
  }
}

export default ItemsScreen = StackNavigator({
        Current: {screen: AddItemComponent},
        NewItem: {screen: AddNewItemScreen},
        SelectedItem: {screen: EditItemComponent}
    },
    { headerMode: 'none' }
);
