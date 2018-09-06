
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Button,
  TextInput
} from 'react-native';

import {writeValue} from '../reducers/ble'


export default class Write extends Component{
	
	
	static navigationOptions = ({navigation})=>{
		console.log(navigation);
		return {
		
		title : "写入",
		headerRight : <Button title="Done" onPress={()=>{navigation.dispatch(writeValue())}} />
	}}


	render(){
		return (
			<View style={styles.container}>
      			<TextInput 
      			value={this.props.value} 
      			onChangeText={this.props.setWriteValue}
      			 multiline={true} numberOfLines={10} 
      			 style={{backgroundColor:'#fff',height:'50%'}} />
   			 </View>
		);
	}
}


const styles = StyleSheet.create({
  container:{flex:1},
  
});
