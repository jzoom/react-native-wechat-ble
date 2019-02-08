
import {
  NativeModules,
  NativeEventEmitter
} from 'react-native';



/**
命名规范:

变量：

rn事件：_evtXxx
注册的回调函数: _cbXxx


函数:




*/



const BluetoothModule = NativeModules.BluetoothModule;


const BluetoothEvent = new NativeEventEmitter(BluetoothModule);


class Bluetooth{


	openBluetoothAdapter(params:{}){
		return BluetoothModule.openBluetoothAdapter(params || {});
	}

	closeBluetoothAdapter(params){
		this._clear();
		return BluetoothModule.closeBluetoothAdapter(params || {});
	}

	
	onBluetoothDeviceFound(callback:Function){
		if(this._evtFoundDevice){
			this._evtFoundDevice.remove();
		}
		
		this._cbFoundDevice = callback;
		this._evtFoundDevice = BluetoothEvent.addListener('foundDevice',this._onFoundDevice);
	}



	startBluetoothDevicesDiscovery(params:{}){
		params = params || {};
		this.newFoundDevices = {};
		if(params.interval!==undefined && params.interval > 0){
			this.foundTimer = setInterval(this._foundDeviceInterval,params.interval * 1000);
		}
		return BluetoothModule.startBluetoothDevicesDiscovery(params);
	}

	stopBluetoothDevicesDiscovery(params:{}){
		return BluetoothModule.stopBluetoothDevicesDiscovery(params || {});
	}

	createBLEConnection(params:{deviceId:string}){
		return BluetoothModule.createBLEConnection(params || {});
	}

	closeBLEConnection(params){
		return BluetoothModule.closeBLEConnection(params || {});
	}

	getBluetoothDevices(){
		return BluetoothModule.getBluetoothDevices({});
	}

	getConnectedBluetoothDevices(){
		return BluetoothModule.getConnectedBluetoothDevices({});
	}

	getBLEDeviceServices(params:{deviceId:string}){
		return BluetoothModule.getBLEDeviceServices(params);
	}

	getBLEDeviceCharacteristics(params){
		return BluetoothModule.getBLEDeviceCharacteristics(params);
	}

	writeBLECharacteristicValue(params){
		return BluetoothModule.writeBLECharacteristicValue(params);
	}

	/**
	 * 读取特征值
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	readBLECharacteristicValue(params){
		return BluetoothModule.readBLECharacteristicValue(params);
	}

	/**
	 * 注册蓝牙状态改变事件
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	onBLEConnectionStateChange(params){
		
	}


	notifyBLECharacteristicValueChange(params){
		return BluetoothModule.notifyBLECharacteristicValueChange(params);
	}

	
	onBLECharacteristicValueChange(callback){
		if(this._evtValueUpdate){
			this._evtValueUpdate.remove();
		}
		
		this._cbValueUpdate = callback;
		this._evtFoundDevice = BluetoothEvent.addListener('valueUpdate',this._onValueUpdate);
	}

	/**
	 * 监听到有值
	 * @param  {[type]} result [description]
	 * @return {[type]}        [description]
	 */
	_onValueUpdate=(result)=>{
		this._cbValueUpdate && this._cbValueUpdate(result);
	}


	_foundDeviceInterval=()=>{
		let devices = [];
		//通知一下
		for(let i in self.newFoundDevices){
			devices.push(self.newFoundDevices[i]);
		}

		self.newFoundDevices = [];
		this._cbFoundDevice && this._cbFoundDevice({devices});
	}

	_onFoundDevice=(device)=>{
		//callback.success && callback.success(device);
		if(!this.foundTimer){
			//发现一个送一个
			this._cbFoundDevice && this._cbFoundDevice({devices:[device]})
		}else{
			//缓存一段时间
			this.newFoundDevices[device.deviceId] = device;

		}
	}


	_clear(){
		if(this._evtValueUpdate){
			this._evtValueUpdate.remove();
			this._evtValueUpdate = undefined;
		}
		this._cbValueUpdate = undefined;
		this._cbFoundDevice = undefined;
		if(this._evtFoundDevice){
			this._evtFoundDevice.remove();
			this._evtFoundDevice = undefined;
		}
		if(this.foundTimer){
			clearInterval(this.foundTimer);
			this.foundTimer = undefined;
		}
	}



}


const instance = new Bluetooth();
export default instance;

