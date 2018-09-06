
/**
 *
 * 这个文件定义所有的路由
 * 应该是非常纯粹的导入所有connect增强组件或者未经增强的Component
 * 不应该包含逻辑
 * 
 */


import {Home} from './modules/home'
import {Profile} from './modules/profile'
import {BleConnection,Write} from './modules/ble'


/**
 * 导出路由
 */
module.exports = {
  Home: {
    screen : Home,
  },
  Profile: {
    screen : Profile,
  },
  BleConnection : {
  	screen : BleConnection
  },
  Write : {
  	screen : Write
  }
  
};
