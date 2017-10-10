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

export default class CreateItem extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `Create Item`
    });

    constructor(props){
        super(props);
        this.state ={
            screenWidth: Dimensions.get("window").width,
            itemName: "",
            displayName: "",
            standardRate: "0",
            units: '1',
            qty: '1',
            includes: [],
            includesObj: [],
            inc:0
        }
    }
    componentWillMount(){
        this.addMoreSubItems();
    }

    removeSubItem(key){
        var includes = this.state.includes;
        var objects = this.state.includesObj;

        for (var i=0; i < includes.length; i++){
            //console.log(objects[i].key,'===',key,'?  ',(key == objects[i].key));
            if (key == includes[i].itemId){ //int to string comparison, use ==
                console.log("removing element ", i);
                includes.splice(i, 1);
            }
        }
        this.setState({includes});
        for (var i=0; i < objects.length; i++){
            //console.log(objects[i].key,'===',key,'?  ',(key == objects[i].key));
            if (key == objects[i].key){ //int to string comparison, use ==
                console.log("removing element ", i);
                objects.splice(i, 1);
            }
        }
        this.setState({includesObj:objects});
    }

    handleSubItemJson(itemId, key, newVal){
        var includes = this.state.includes;
        //find itemId in current includes; replace if found, else create
        var json= {
            itemName:'',
            displayName:'',
            qty:'',
            itemId:itemId
        };
        var found = false;
        for (var i = 0; i < includes.length; i++){
            if (includes[i].itemId === itemId){
                json = {
                    itemName: includes[i].itemName,
                    displayName: includes[i].displayName,
                    qty: includes[i].qty,
                    itemId: includes[i].itemId
                }
                break;
            }
        }
        json[key] = newVal;
        includes.splice(i,1);
        includes.push(json);
        this.setState({ includes })
    }

    addMoreSubItems(){
        var l = this.state.includesObj;
        var id = this.state.inc;
        var that = this;
        var itemName, displayName, qty;
        var itemJson;
        l.push(
            <View key={id}
                  style={{ flexDirection:'row', borderColor:'black',borderWidth:1 }}>
                <View style={styles.deleteSubItem}>
                    <TouchableHighlight onPress={()=>{that.removeSubItem(id)}}>
                        <Text> - </Text>
                    </TouchableHighlight>
                </View>
                <View>
                    <View style={styles.inputRow}>
                        <Text>Item Name:</Text>
                        <TextInput
                            numberOfLines={1}
                            style={{width:this.state.screenWidth}}
                            onChangeText={(text) => {that.handleSubItemJson(id,'itemName',text)}}
                        />
                    </View>
                    <View style={styles.inputRow}>
                        <Text>Display as:</Text>
                        <TextInput
                            numberOfLines={1}
                            style={{width:this.state.screenWidth}}
                            onChangeText={(text) => {that.handleSubItemJson(id,'displayName',text)}}
                        />
                    </View>
                    <View style={styles.inputRow}>
                        <Text>Quantity:</Text>
                        <TextInput
                            numberOfLines={1}
                            style={{width:this.state.screenWidth}}
                            onChangeText={(text) => {that.handleSubItemJson(id,'qty',text)}}
                        />
                    </View>
                </View>
            </View>
        )


        itemJson = {
            itemName: itemName,
            displayName: displayName,
            qty: qty,
            itemId: id
        }

        this.setState({includesObj:l});
        this.setState({inc:this.state.inc+1});
    }


    submitAddItem(){
        var l = [];
        var includesObj = this.state.includesObj;
        var obj, objJson;
        var itemJson;
        //temporary check, in case of misclick don't add empty objects
        if (this.state.itemName.length === 0){
            console.log("no name given, don't add");
            this.props.navigation.goBack();
            return -1
        }
        for (var i = 0; i < includesObj.length; i++){
            obj = includesObj[i];
            //console.log(obj);
        }
        var jsonObj= {}
        jsonObj[this.state.itemName]=
            {
            itemName:this.state.itemName,
            displayName: this.state.displayName,
            standardRate: this.state.standardRate,
            units: this.state.units,
            qty: this.state.qty,
            includes: this.state.includes
        }
        try {
            var result = AsyncStorage.getItem('Items');
            if (result !== null){
                AsyncStorage.mergeItem('Items', JSON.stringify(jsonObj)).then(()=>{
                        this.props.navigation.goBack()
                    }
                );
            }
            else{
                AsyncStorage.setItem('Items', JSON.stringify(jsonObj)).then(()=>{
                    this.props.navigation.goBack()
                    }
                );
            }
        } catch (error) {
            // Error retrieving data
            console.log(error);
        }
        // AsyncStorage.getItem('Items', (err, test) => {
        //     console.log(test);
        // });
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
              <View style={styles.inputRow}>
                  <Text>Item Name:</Text>
                  <TextInput
                      numberOfLines={1}
                      style={{width:this.state.screenWidth}}
                      onChangeText={(itemName) => this.setState({itemName})}
                  />
              </View>
              <View style={styles.inputRow}>
                  <Text>Display on quote as:</Text>
                  <TextInput
                      numberOfLines={1}
                      style={{width:this.state.screenWidth}}
                      onChangeText={(displayName) => this.setState({displayName})}
                  />
              </View>
              <View style={styles.inputRow}>
                  <Text>Standard Rate:</Text>
                  <TextInput
                      numberOfLines={1}
                      style={{width:0.4*this.state.screenWidth}}
                      onChangeText={(standardRate) => this.setState({standardRate})}
                      value={this.state.standardRate}
                  />
                  <Text>Units:</Text>
                  <TextInput
                      numberOfLines={1}
                      style={{width:this.state.screenWidth}}
                      onChangeText={(units) => this.setState({units})}
                      value={this.state.units}
                  />
              </View>
              <View style={styles.inputRow}>
                  <Text>Quantity:</Text>
                  <TextInput
                      style={{width:this.state.screenWidth}}
                      onChangeText={(qty) => this.setState({qty})}
                      value={this.state.qty}
                  />
              </View>
              {this.state.includesObj}
              <View>
                  <TouchableHighlight onPress={()=>{this.addMoreSubItems()}}>
                      <Text>Add more</Text>
                  </TouchableHighlight>
              </View>
              <Button title="Submit" onPress={()=>this.submitAddItem()}
                      accessibilityLabel="Create a new project">
              </Button>
              <Button title="Cancel" onPress={()=>{this.props.navigation.goBack()}}
                      accessibilityLabel="Create a new project">
              </Button>
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

