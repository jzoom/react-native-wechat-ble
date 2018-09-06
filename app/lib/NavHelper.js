/**
 * 本文件用于屏蔽
 * react-navigation或者微信小程序或者其他路由系统的区别
 * 
 */
export default class NavHelper{

	static plugin : any;

	/**
	 * 
	 * 使用哪个插件
	 * @param  {[type]} plugin [description]
	 * @return {[type]}        [description]
	 */
	static setPlugin(plugin){
		NavHelper.plugin = plugin;
	}

	/**
	 * 跳转哪个页面
	 * @param  {[type]} url   [description]
	 * @param  {[type]} param [description]
	 * @return {[type]}       [description]
	 */
	static push(url:String,param:Object){
		NavHelper.plugin.push(url,param);
	}

	/**
	 * [goBack description]
	 * @return {[type]} [description]
	 */
	static goBack(to:String){
		NavHelper.plugin.goBack(to);
	}

	/**
	 * 回到首页
	 * @return {[type]} [description]
	 */
	static goHome(){
		NavHelper.plugin.goHome();
	}



	




}




