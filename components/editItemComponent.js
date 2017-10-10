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
import SubItemWrapper from './subItemWrapper';

export default class EditItemComponent extends Component {
    static navigationOptions = ({ navigation }) => ({

        title: `Edit Item`

    });

    constructor(props){
        super(props);
        var { params } = this.props.navigation.state;

        //console.log("params: ", this.props.navigation)

        console.log("parent includes is: ", params.itemJson)
        //var itemKey = Object.keys(JSON.parse(params.itemJson))[0]
        this.setIncludesObj = this.setIncludesObj.bind(this);
        this.state ={
            screenWidth: Dimensions.get("window").width,
            itemName: params.itemJson.itemName,
            originalName: params.itemJson.itemName, //for checking if original name gets changed
            displayName: params.itemJson.displayName,
            standardRate: params.itemJson.standardRate,
            units: params.itemJson.units,
            qty: params.itemJson.qty,
            includes: [],
            includesObj: [],
            inc:params.itemJson.includes.length
        }
        this.goBack = this.goBack.bind(this);
        this.handleSubItemJson = this.handleSubItemJson.bind(this);
        this.removeSubItem = this.removeSubItem.bind(this);
    }
    componentDidMount(){
        //console.log("mounted");
        const { params } = this.props.navigation.state;
        //var itemKey = Object.keys((params.itemJson))
        //console.log("params: ", JSON.stringify((params.itemJson)))
        var includesCopy = JSON.parse(JSON.stringify(params.itemJson.includes))
        this.setState({ includes: includesCopy})
        this.setIncludesObj(includesCopy)

    }

    removeSubItem(key){
        var includes = this.state.includes;
        var objects = this.state.includesObj;
        console.log("key given: ", key)
        //console.log("includes is: ", includes);
        for (var i=0; i < includes.length; i++){
            //console.log(objects[i].key,'===',key,'?  ',(key == objects[i].key));
            if (key == includes[i].itemId){ //int to string comparison, use ==
                //console.log("removing element ", i);
                includes.splice(i, 1);
            }
        }
        this.setState({includes}, ()=>{
            //console.log("includes is now: ", this.state.includes);
        });

        for (var i=0; i < objects.length; i++){
            //console.log(objects[i].key,'===',key,'?  ',(key == objects[i].key));
            if (key == objects[i].key){ //int to string comparison, use ==
                //console.log("removing element ", i);
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

    setIncludesObj(includesList){
        //console.log("includesList: ", includesList)
        var objList = [];
        var that = this;
        var itemName, displayName, qty;
        var itemJson;
        for (var i = 0; i < includesList.length; i++ ){
            //console.log("create obj for ", includesList[i]);
            itemJson = includesList[i];
            objList.push(
                <SubItemWrapper key = {itemJson.itemId } itemId={itemJson.itemId} removeSubItem = {that.removeSubItem}
                                handleSubItemJson={that.handleSubItemJson}
                                itemName = {itemJson.itemName}
                                displayName = {itemJson.displayName}
                                qty={itemJson.qty}
                    screenWidth={that.state.screenWidth}/>
            )
        }

        this.setState({includesObj:objList})
    }
    addMoreSubItems(){
        var l = this.state.includesObj;
        var id = this.state.inc;
        var that = this;
        var itemName, displayName, qty;
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

        this.setState({includesObj:l});
        this.setState({inc:this.state.inc+1});
    }

    submitAddItem(){
        var l = [];
        var includesObj = this.state.includesObj;
        var jsonObj= {}
        var obj, objJson;
        var itemJson;
        //update included items
        // for (var i = 0; i < includesObj.length; i++){
        //     obj = includesObj[i];
        //     console.log("Add to includes: ", obj);
        // }
        jsonObj=
            {
                itemName:this.state.itemName,
                displayName: this.state.displayName,
                standardRate: this.state.standardRate,
                units: this.state.units,
                qty: this.state.qty,
                includes: this.state.includes
            }
        try {
            AsyncStorage.getItem('CurrentProjectItems').then((result) =>{
                if (result) {
                    console.log("current project: ", result)
                    var resultJson = JSON.parse(result)
                    var currentItemsList = Object.keys(resultJson);
                    for (var i = 0; i < currentItemsList.length; i++) {
                        console.log("Checking entry in projects: ", resultJson[currentItemsList[i]].itemName)
                        console.log("original name: ", this.state.originalName)
                        if (resultJson[currentItemsList[i]].itemName == this.state.originalName){
                            console.log("Remove entry from results: ", currentItemsList[i])
                            //set the new object in result and replace it
                            delete resultJson[this.state.originalName]
                            resultJson[this.state.itemName] = jsonObj;
                            AsyncStorage.setItem('CurrentProjectItems', JSON.stringify(resultJson),() => {
                                AsyncStorage.getItem('CurrentProjectItems').then((result2) =>{
                                    console.log("curr proj is now: ", result2)
                                }).then(()=>{this.goBack()})
                            });
                        }
                    }
                }
                else{
                    AsyncStorage.setItem('CurrentProjectItems', JSON.stringify(jsonObj),() => {
                        this.goBack()});
                }
            })
        } catch (error) {
            // Error retrieving data
            console.log(error);
        }
        //AsyncStorage.getItem('CurrentProjectItems', (err, test) => {
        //console.log("Current Project is now: ",test);
        //});
    }

    removeItemFromProject(){
        var l = [];
        var includesObj = this.state.includesObj;
        var jsonObj= {}
        try {
            AsyncStorage.getItem('CurrentProjectItems').then((result) =>{
                if (result) {
                    console.log("current project: ", result)
                    var resultJson = JSON.parse(result)
                    var currentItemsList = Object.keys(resultJson);
                    for (var i = 0; i < currentItemsList.length; i++) {
                        //TODO: remove entry first
                        console.log("Checking entry in projects: ", resultJson[currentItemsList[i]].itemName)
                        console.log("original name: ", this.state.originalName)
                        if (resultJson[currentItemsList[i]].itemName == this.state.originalName){
                            console.log("Remove entry from results: ", currentItemsList[i])
                            //set the new object in result and replace it
                            delete resultJson[this.state.originalName];
                            AsyncStorage.setItem('CurrentProjectItems', JSON.stringify(resultJson),() => {
                                AsyncStorage.getItem('CurrentProjectItems').then((result2) =>{
                                    console.log("curr proj is now: ", result2)
                                }).then(()=>{this.goBack()})
                            });
                        }
                    }
                }
                else{
                    AsyncStorage.setItem('CurrentProjectItems', JSON.stringify(jsonObj),() => {
                        this.goBack()});
                }
            })
        } catch (error) {
            // Error retrieving data
            console.log(error);
        }
        //AsyncStorage.getItem('CurrentProjectItems', (err, test) => {
        //console.log("Current Project is now: ",test);
        //});
    }

    goBack(){
        let updateParent = this.props.navigation.state.params.update;
        if(typeof updateParent === 'function'){
            updateParent();
            //console.log('updating')
        }
        this.props.navigation.goBack();
    }

    render() {
        //console.log("create rendered")
        //console.log("states set as: ", this.state)
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
                      defaultValue={this.state.itemName}
                  />
              </View>
              <View style={styles.inputRow}>
                  <Text>Display on quote as:</Text>
                  <TextInput
                      numberOfLines={1}
                      style={{width:this.state.screenWidth}}
                      onChangeText={(displayName) => this.setState({displayName})}
                      defaultValue={this.state.displayName}
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
              <Button title="Save" onPress={()=>{this.submitAddItem()}}
                      accessibilityLabel="Create a new project">
              </Button>
              <Button title="Remove From Project" onPress={()=>{this.removeItemFromProject()}}
                      accessibilityLabel="Create a new project">
              </Button>
              <Button title="Cancel" onPress={()=>{this.goBack()}}
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

