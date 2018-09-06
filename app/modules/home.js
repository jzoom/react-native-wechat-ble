
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux'
import Home from '../components/Home'
import {enterProfile} from '../reducers/nav'
import {createConnection,openBle} from '../reducers/ble'


module.exports = {
	/**
	 * 首页
	 * @param  {[type]} state [description]
	 * @return {[type]}       [description]
	 */
	Home:connect(state=>({
		devices : state.ble.devices
	}),dispatch=>(
		bindActionCreators({
			enterProfile,createConnection,openBle
  		},dispatch)
	))(Home),
};
