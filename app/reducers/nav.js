
/**
 * 路由相关操作
 */

import AppNavigator from '../navigators'
import ReactNavigationPlugin from '../lib/ReactNavigationPlugin'
import NavHelper from '../lib/NavHelper'



/**
 * navigation的路由
 * 
 */
export const ROOTER = AppNavigator.router;


/**
 * 这里可以尝试导出一些路由所需方法
 */

export function enterProfile(){
	return dipaatch=>{
		//这里封装了这么一层逻辑
		//比较简单，没有记忆负担，和跳转有关的逻辑全部放在NavHelper里面做
		//与传统的url跳转采用的方法一致
		NavHelper.push('Profile');
	}
}




const initialState = ROOTER.getStateForAction(ROOTER.getActionForPathAndParams('Home'));

/**
 * 这一层的路由系统是react-navigation提供的，
 * 假设不用这个路由，需要在这里进行修改,当然也可以提供一个实现了一样功能的文件替代。
 * 
 * @param  {[type]} state  [description]
 * @param  {[type]} action [description]
 * @return {[type]}        [description]
 */
const nav = (state = initialState, action) => {
  const nextState = ROOTER.getStateForAction(action, state);

  //判断一下是不是没有配置路由
  if(action.type == 'Navigation/NAVIGATE' && state === nextState ){
    console.error("没有配置路由",action);
  }
  
  return nextState || state;
};


export default nav;