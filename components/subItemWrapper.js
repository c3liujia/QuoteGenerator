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

export default class EditItemComponent extends Component {

    constructor(props){
        super();

    }

    render() {
        console.log("props: ", this.props )
        return(
        <View key={this.props.itemId}
              style={{ flexDirection:'row', borderColor:'black',borderWidth:1 }}>
            <View style={styles.deleteSubItem}>
                <TouchableHighlight onPress={()=>{this.props.removeSubItem(this.props.itemId)}}>
                    <Text> - </Text>
                </TouchableHighlight>
            </View>
            <View>
                <View style={styles.inputRow}>
                    <Text>Item Name:</Text>
                    <TextInput
                        numberOfLines={1}
                        style={{width:this.props.screenWidth}}
                        onChangeText={(text) => {this.props.handleSubItemJson(this.props.itemId,'itemName',text)}}
                        defaultValue={this.props.itemName}
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text>Display as:</Text>
                    <TextInput
                        numberOfLines={1}
                        style={{width:this.props.screenWidth}}
                        onChangeText={(text) => {this.props.handleSubItemJson(this.props.itemId,'displayName',text)}}
                        defaultValue={this.props.displayName}
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text>Quantity:</Text>
                    <TextInput
                        numberOfLines={1}
                        style={{width:this.props.screenWidth}}
                        onChangeText={(text) => {this.props.handleSubItemJson(this.props.itemId,'qty',text)}}
                        defaultValue={this.props.qty}
                    />
                </View>
            </View>
        </View>
        );
    }
}
const styles = StyleSheet.create({
    inputRow:{
        flexDirection: 'row',
        borderColor: 'gray',
        borderWidth: 1
    },
    deleteSubItem:{
        alignItems: 'center',
        justifyContent: 'center'
    }
}
);

