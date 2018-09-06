/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  NativeModules,
  Button,
  FlatList,
  TouchableOpacity,
  PixelRatio
} from 'react-native';

import Bluetooth from '../../ble/Bluetooth'

const BluetoothModule = NativeModules.BluetoothModule;


export default class Home extends Component<{}> {

	static navigationOptions = {
		title : "蓝牙助手"
	};


  constructor(props){
    super(props);
    
  }

  componentDidMount() {
    this.props.openBle();
  }



  _renderItem=({item})=>{
    //console.log(item);
    return (
      <TouchableOpacity onPress={()=>{this.props.createConnection( item.deviceId )}} style={{padding:10,backgroundColor:'#fff'}}>
        <Text>Name : {item.name}</Text>
        <Text>Uuid : {item.deviceId}</Text>
      </TouchableOpacity>
    );
  }

  _sep=()=>{
    return <View style={{height:1/PixelRatio.get(),backgroundColor:'#ccc'}}></View>
  }

  _keyExtractor = (item, index) => item.deviceId;

  render() {
    return (
      <View style={{flex:1,paddingTop:20}}>
          <FlatList
            style={styles.container}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            ItemSeparatorComponent={this._sep}
            data={this.props.devices}>
        </FlatList>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
});
