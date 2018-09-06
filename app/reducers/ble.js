import NavHelper from '../lib/NavHelper'
import Bluetooth from '../../ble/Bluetooth'

//连接状态
const CONN_STATUS = 'connStatus';
const UPDATE_SERVICES = 'updateServices';


const CONN_STATUS_LOADING = "LOADING";
const CONN_STATUS_CONNECTED = "CONNECTED";
const CONN_STATUS_DISCONNECTED = "DISCONNECTED";


function connectionStatus(status,device){
	return {type:CONN_STATUS,status:status,device:device};
}

export function setWriteValue(value){
	return {type:'setWriteValue',value:value};
}


function setWriteItem(c){
	return {type:"SET_WRITE",characteristic:c};
}


function foundDevice(devices){
	return  {type:FOUND_DEVICE,devices:devices} ;
}

function updateServices(services){
	return {type:UPDATE_SERVICES,services:services}
}

function contains(arr,deviceId){
	for(let i in arr){
		if(arr[i].deviceId == deviceId){
			return true;
		}
	}
	return false;
}

function getDevice(arr,deviceId){
	for(let i in arr){
		if(arr[i].deviceId == deviceId){
			return arr[i];
		}
	}
	return null;
}

const FOUND_DEVICE = "foundDevice";

export function openBle(){
	return async (dispatch,getState)=>{
		
		try{
			console.log('开启蓝牙设备');
			await Bluetooth.openBluetoothAdapter();
			console.log('蓝牙设备开启成功,开始搜索设备');
			

			Bluetooth.onBluetoothDeviceFound({
				success:({devices})=>{
					//console.log(devices);
					let state = getState();
					let hasFound = false;
					let devicesArray = state.ble.devices;
					for(let i in devices){
						let device = devices[i];
						if(!contains(devicesArray,device.deviceId)){
							devicesArray.push(device);
							hasFound = true;
						}
					}
					
					if(hasFound){
						dispatch(foundDevice(devicesArray.concat()) );
					}


				}
			});


			Bluetooth.onBLECharacteristicValueChange({
				success:(res)=>{
					console.log('value charged',res);
				}
			});

			await Bluetooth.startBluetoothDevicesDiscovery();



		}catch(e){
			console.log("发生错误",e);
		}
	};
}



function removeAndMakeNew(arr,index,replaceObject){
	return arr.slice(0,index).concat([replaceObject],arr.slice(index+1,arr.length));
}

function addProperty(arr,property){
	if(!arr || arr.length==0){
		return;
	}
	if(typeof property=='function'){
		for(let i=0; i < arr.length; ++i){
			Object.assign(arr[i],property(i,arr[i]));
		}
	}else{
		for(let i=0; i < arr.length; ++i){
			Object.assign(arr[i],property);
		}
	}
}

function findByProperty(arr,name,value){
for(var i=0; i < arr.length; ++i){
		if(arr[i][name]==value){
			return arr[i];
		}
	}
	return null;
}


/**
 * 开始创建连接
 * @return {[type]} [description]
 */
export function createConnection(deviceId){

	return async (dispatch,getState)=>{
		NavHelper.push("BleConnection");
		dispatch(updateServices([]));
		try{
			let devices  =  getState().ble.devices;
			let device =getDevice(devices,deviceId);

			dispatch(connectionStatus(CONN_STATUS_LOADING,device));

			await Bluetooth.createBLEConnection({deviceId});

			let {services} = await Bluetooth.getBLEDeviceServices({deviceId});

			let newDevice = Object.assign( {},device, {services} );
			//设置到array
			let index = devices.indexOf(device);

			var newDevices = removeAndMakeNew(devices,index,device);//devices.slice(0,index).concat([device],devices.slice(index+1,devices.length));

			dispatch(foundDevice(newDevices));

			//转化数据
			let section = [];
			for(var i in services){
				section.push({
					data : [],
					key : services[i].uuid
				});
			}

			dispatch(updateServices(section));

			for(let i=0; i < services.length; ++i){
				let {characteristics} = await Bluetooth.getBLEDeviceCharacteristics({deviceId:deviceId,serviceId:services[i].uuid});

				characteristics = handleCharacteristics(characteristics,deviceId,services[i].uuid);

				console.log(characteristics);
				//增加一个字段
				addProperty(characteristics, (index,data)=>{
					return {key: index + "_"+data.uuid + "_"+services[i].uuid };
				}  );

				//section应该跟着修改
				let service = section[i];
				service = Object.assign({},service, {data:characteristics} );

				section = removeAndMakeNew(section,i, service );

				dispatch(updateServices(section));

			}
			

		//	console.log(services);
		}catch(e){
			console.log(e.code,e.message,e);
		}
		


		

	};

}

/**
修改特征的notify
*/
export function chargeNotify(characteristic,value){

	return async (dispatch,getState)=>{
		let {deviceId,serviceId,characteristicId} = characteristic;
		//更新状态
		//首先更新这个
		let state = getState();
		let services = state.ble.services;
		let service = findByProperty(services,'key',serviceId);

		if(!service){
			return;
		}

		let c = findByProperty(service.data,'uuid',characteristicId);
		let data = removeAndMakeNew(service.data,service.data.indexOf(c), Object.assign({},c,{isNotify:value}) );
		//修改service

		let section = removeAndMakeNew(services,services.indexOf(service), Object.assign({},service,{data}) );

		dispatch(updateServices(section));

		try{
			await Bluetooth.notifyBLECharacteristicValueChange( {...{deviceId,serviceId,characteristicId} ,...{state:value}});
			console.log('修改notify成功')
		}catch(e){
			console.warn(e);
		}
		
	}
}

export function writeValue(){
	return async (dispatch,getState)=>{
		//写入当前值
		let state = getState();
		let value = state.ble.value;
		let write = state.ble.write;

		console.log(write,value);

		value = value.replace(/\b/g,"");

		await Bluetooth.writeBLECharacteristicValue({
			deviceId : write.deviceId,
			serviceId : write.serviceId,
			characteristicId: write.characteristicId,
			value:value
		});

		console.log('写入成功');

	}
}

export function readValue(item){
	return async dispatch=>{
		await Bluetooth.readBLECharacteristicValue({
			deviceId : item.deviceId,
			serviceId : item.serviceId,
			characteristicId: item.characteristicId,
		});
		console.log('读取成功')
	}
}




export function gotoWrite(item){
	return dispatch=>{
		dispatch(setWriteItem(item));
		NavHelper.push("Write");
	}
	
}




function handleCharacteristics(cs,deviceId,serviceId){
	//对于一个特征，如果能notify，则notify

	for(let i=0; i < cs.length; ++i){
		let c = cs[i];
		c.serviceId = serviceId;
		c.deviceId = deviceId;
		c.characteristicId = c.uuid;
	}

	return cs;
}

/**
 * 初始状态
 * @type {Object}
 */
const initialState = {

	/**
	设备列表
	*/
	devices : [],

	//
	current : null,
	
	connStatus: null,

	services : null,

	write:null,//当前写入设备

	value : null,//当前写入值

};


const ble = (state = initialState, action) => {
  	
	switch(action.type){
		case FOUND_DEVICE:
		//console.log('foundDevice',action);
			return Object.assign( {} ,state, {devices:action.devices} );
		case CONN_STATUS:
			return Object.assign( {} ,state, {current:action.device , connStatus: action.status } );
		case UPDATE_SERVICES:
			return Object.assign({},state, {services:action.services} );
		case "SET_WRITE":
			return Object.assign({},state, {write:action.characteristic} );
		case 'setWriteValue':
			return Object.assign({},state,{value:action.value});
	}
  return state;
};

export default ble;


