
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux'
import BleConnection from '../components/BleConnection'
import Write from '../components/Write'
import {chargeNotify,writeValue,gotoWrite,setWriteValue,readValue} from '../reducers/ble'


module.exports = {
	/**
	 * 首页
	 * @param  {[type]} state [description]
	 * @return {[type]}       [description]
	 */
	BleConnection:connect(state=>({
		
		services : state.ble.services,
		connStatus : state.ble.connStatus

	}),dispatch=>(
		bindActionCreators({
			chargeNotify,gotoWrite,readValue
  		},dispatch)
	))(BleConnection),


	Write:connect(state=>({
		
		services : state.ble.services,
		connStatus : state.ble.connStatus,
		value:state.ble.value

	}),dispatch=>(
		bindActionCreators({
			setWriteValue
  		},dispatch)
	))(Write),
 
};
