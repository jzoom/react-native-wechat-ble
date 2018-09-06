
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  SectionList,
  PixelRatio,
  Switch
} from 'react-native';



class Button extends Component{

	render(){
		return (
			<TouchableOpacity onPress={this.props.onPress} style={this.props.style}>
				<Text style={{color:this.props.grey ? '#ccc' : '#4169E1' }}>{this.props.title}</Text>
			</TouchableOpacity>
		);
	}
}

const SIZE = 20;


class CountTag extends Component{
	render(){

		return (
			 <View
                style={{  alignItems:'center', justifyContent:'center', 
                	width:SIZE,height:SIZE,
                	marginRight:5,
                	backgroundColor:'#87CEEB',borderTopLeftRadius:SIZE/2,borderTopRightRadius:SIZE/2,borderBottomLeftRadius:SIZE/2,borderBottomRightRadius:SIZE/2}}>
              
				<Text 
					numberOfLines={1}
	                style={{color: "#fff",fontSize:11}}>{this.props.text}</Text>
	        </View>

		);
	}
}

export default class BleConnection extends Component{
	
	
	static navigationOptions = {
		title : "连接助手",
	}


	_getProperty(properties){
		let str = "";
		if(properties.read){
			str += "read|";
		}
		if(properties.write){
			str += "write|";
		}
		if(properties.notify){
			str += "notify|";
		}
		if(properties.indicate){
			str += "indicate|";
		}
		if(str.length > 0){
			str = str.substring(0,str.length-1);
		}
		return str;
	}


	  _renderItem=({item})=>{
	    //console.log(item);
	    let {uuid,properties} = item;
	    return (
	      <View style={{padding:10,backgroundColor:'#fff'}}>
	        <Text>{item.uuid}</Text>
	        <View style={{flexDirection:'row'}}>
	        	<View style={{flex:1,flexDirection:'row',height:40,alignItems:'center'}}>
	        		{(properties.read || properties.notify) && <CountTag text="3" /> } 
	        		{properties.read && <Button title="read" style={{padding:10,marginRight:10}} onPress={()=>{this.props.readValue(item)}} />}
			        {properties.write && <Button title="write" style={{padding:10,marginRight:10}} onPress={()=>{this.props.gotoWrite(item)}} />}
	        	</View>
        		{properties.notify && <Switch value={item.isNotify} onValueChange={(value)=>{this.props.chargeNotify(item,value)}} />}
	       		{properties.indicate && <Switch value={item.isNotify} onValueChange={(value)=>{this.props.chargeNotify(item,value)}} />}
	       		
	        </View>
	        
	        
	      </View>
	    );
	  }

	  _renderHeader=({section})=>{
	  	return (

	  		<View style={{padding:10,backgroundColor:'#efefef'}}><Text>{section.key}</Text></View>
	  	);
	  }


	  _sep=()=>{
	    return <View style={{height:1/PixelRatio.get(),backgroundColor:'#ccc'}}></View>
	  }

	  _keyExtractor = (item, index) => item.key;


	render(){
		return (
			<View style={styles.container}>
      			 {this.props.services && <SectionList
		            style={[styles.container ]}
		            renderItem={this._renderItem}
		            keyExtractor={this._keyExtractor}
		            renderSectionHeader={this._renderHeader}
		            ItemSeparatorComponent={this._sep}
		            sections={this.props.services} />}
   			</View>
		);
	}
}


const styles = StyleSheet.create({
  container:{flex:1},
  
});
