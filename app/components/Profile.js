
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text
} from 'react-native';



export default class Profile extends Component{
	
	
	static navigationOptions = {
		title : "个人中心",
	}


	render(){
		return (
			<View style={styles.container}>
      			<Text>个人中心</Text>
   			 </View>
		);
	}
}


const styles = StyleSheet.create({
  container:{flex:1},
  
});
