//定义公共的资源属性
//
//



const HEADER_MAIN_COLOR = "#fff";  //主色

const BODY_MAIN_COLOR = "#fff";  //主色




module.exports = {
	
	//容器
	container : {flex:1 ,backgroundColor : BODY_MAIN_COLOR },
	
	//背景颜色，通用
	bg : { backgroundColor : BODY_MAIN_COLOR },

	//头部
	header : {
		//headerTintColor: 'red',
	    headerStyle:{backgroundColor:HEADER_MAIN_COLOR},
	    headerBackTitle:null,
	    headerTitleStyle : {alignSelf:'center' },
	}

}

