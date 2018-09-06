
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux'
import Profile from '../components/Profile'


module.exports = {
	/**
	 * 个人中心
	 * @param  {[type]} state [description]
	 * @return {[type]}       [description]
	 */
	Profile:connect(state=>({
		
	}),dispatch=>(
		bindActionCreators({
			
  		},dispatch)
	))(Profile),
};
