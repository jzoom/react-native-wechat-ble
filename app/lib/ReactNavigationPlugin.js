import {NavigationActions} from 'react-navigation'


function getCurrentUrl(state){
	let routes = state.routes;
	return routes[routes.length -1].routeName;
}

export default class ReactNavigationPlugin{
	constructor(store){
		this.store = store;
	}


	push(url,param){
		this.store.dispatch(NavigationActions.navigate({routeName:url}));
	}

	goBack(url){
		this.store.dispatch(NavigationActions.back());
	}

	goHome(){
		this.store.dispatch(NavigationActions.reset({index:0,
			actions: [
		      NavigationActions.navigate({ routeName: 'Home'}),
		    ]}));
	}


	static backMap = {};
	
	//绑定back事件
	/**
	 * [bindBack description]
	 * @param  {[type]}   url      定义在这个url上面点击的监听
	 * @param  {Function} callback 一个funciton,这个funciton返回false,表示默认处理，返回 一个String,表示跳转到String指定的路由上面
	 * @return {[type]}            
	 */
	static bindBack(url,callback){
		ReactNavigationPlugin.backMap[url] = callback;
	}


	static on(state,nextState,action){
		//获取当前页面的名称
		if(action.type=='Navigation/BACK'){
			let url = getCurrentUrl(state);
			let fun = ReactNavigationPlugin.backMap[url]
			if(fun){
				return fun(state,nextState,action);
			}
		}
		console.log(action);


	}

}