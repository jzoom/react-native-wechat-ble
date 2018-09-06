import {StackNavigator} from 'react-navigation'
import React from 'react'
import {Button} from 'react-native'
import Routes from './routes'

import R from './r'
/**
 * 定义跳转
 * @type {Object}
 */
export default StackNavigator(Routes,{
  navigationOptions: ({navigation})=>({
  	...R.header,
  	//其他属性
  	headerLeft:<Button title="back" onPress={()=>{ navigation.goBack() }} />
  }),
});