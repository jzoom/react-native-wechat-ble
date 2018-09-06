//
//  RCTBluetoothModule.m
//  JZoomBle
//
//  Created by 任雪亮 on 2017/11/25.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "RCTBluetoothModule.h"
#import <CoreBluetooth/CoreBluetooth.h>
#import "BluetoothAdapter.h"

#define CHECK(d) [RCTBluetoothModule retToCallback:d reject:reject];
/*
0  ok  正常
10000  not init  未初始化蓝牙适配器



10001  not available  当前蓝牙适配器不可用



10002  no device  没有找到指定设备
10003  connection fail  连接失败
10004  no service  没有找到指定服务
10005  no characteristic  没有找到指定特征值
10006  no connection  当前连接已断开
10007  property not support  当前特征值不支持此操作
10008  system error  其余所有系统上报的异常
10009  system not support  Android 系统特有，系统版本低于 4.3 不支持BLE
*/
#define NOT_INIT @"10000"
#define NOT_AVALIABLE @"10001"
#define NO_DEVICE @"10002"
#define CONNECTION_FAIL @"10003"
#define NO_SERVICE @"10004"
#define NO_CHARACTERISTIC @"10005"
#define NO_CONNECTION @"10006"
#define PROPERTY_NOT_SUPPOTT @"10007"
#define SYSTEM_ERROR @"10008"
#define SYSTEM_NOT_SUPPORT @"10009"

@interface RCTBluetoothModule()

@property (nonatomic,retain) BluetoothAdapter* adapter;

@end


@implementation RCTBluetoothModule


RCT_EXPORT_MODULE()

-(id)init{
  if(self=  [super init]){
    _adapter = [[BluetoothAdapter alloc]init];
    __weak RCTBluetoothModule* __self = self;
    _adapter.discoveryDeviceCallback = ^(NSDictionary * device) {
      [__self sendEventWithName:@"foundDevice" body:device];
    };
    
    _adapter.updateValueCallback = ^(CBPeripheral * device, CBCharacteristic * character, NSError * error) {
      if(!error){
        [__self sendEventWithName:@"valueUpdate" body:@{
          @"characteristicId":character.UUID.UUIDString,
          @"serviceId" : character.service.UUID.UUIDString,
          @"deviceId" : device.identifier.UUIDString,
          @"value" : [ RCTBluetoothModule toString:character.value ]
        }];
      }
      
    };
  }
  return self;
}

- (dispatch_queue_t)methodQueue
{
  // This module needs to be on the same queue as the UIManager to avoid
  // having to lock `_operations` and `_preOperations` since `uiManagerWillFlushUIBlocks`
  // will be called from that queue.
  return RCTGetUIManagerQueue();
}


- (NSArray<NSString *> *)supportedEvents
{
  //发现设备
  return @[@"foundDevice",@"valueUpdate"];
}

/**
 0  ok  正常
 10000  not init  未初始化蓝牙适配器
 
 
 
 10001  not available  当前蓝牙适配器不可用
 
 
 
 10002  no device  没有找到指定设备
 10003  connection fail  连接失败
 10004  no service  没有找到指定服务
 10005  no characteristic  没有找到指定特征值
 10006  no connection  当前连接已断开
 10007  property not support  当前特征值不支持此操作
 10008  system error  其余所有系统上报的异常
 10009  system not support  Android 系统特有，系统版本低于 4.3 不支持BLE
 */



RCT_EXPORT_METHOD( openBluetoothAdapter: (NSDictionary*)dic resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject  ){
  
  [_adapter open:^(NSInteger status) {
    
    if(status == CBCentralManagerStatePoweredOn){
      resolve(@{});
    }else{
      reject(NOT_AVALIABLE,@"蓝牙适配器不可用",nil);
    }
  }];
  
}

RCT_EXPORT_METHOD( closeBluetoothAdapter: (NSDictionary*)dic resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject  ){
  [_adapter close];
  resolve(@{});
}




RCT_EXPORT_METHOD(startBluetoothDevicesDiscovery: (NSDictionary*)dic resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject ){
  if(!_adapter.isInit){
    reject(@"10000",@"蓝牙未初始化",nil);
    return;
    
  }
  [_adapter startDevieDiscovery:[dic objectForKey:@"services"] allowDuplicatesKey: [[dic objectForKey:@"allowDuplicatesKey"]boolValue]   interval:[[dic objectForKey:@"interval"]integerValue]];
  resolve(@{});
}
//10000 未初始化
RCT_EXPORT_METHOD(stopBluetoothDevicesDiscovery: (NSDictionary*)dic resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject ){
  
  [_adapter stopDevieDiscovery];
  resolve(@{});
}

RCT_EXPORT_METHOD(createBLEConnection: (NSDictionary*)dic resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject ){
  
  __weak BluetoothAdapter* __adapter = _adapter;
  
  _adapter.connectDeviceCallback = ^(CBPeripheral * device,NSError* error) {
    if(error){
       reject(CONNECTION_FAIL,@"连接设备失败",error);
    }else{
      resolve(@{});
    }
    __adapter.connectDeviceCallback  = nil;
  };
  
  NSString* deviceId = dic[@"deviceId"];
  
  
  CHECK([_adapter createConnection:deviceId]);

  
}
RCT_EXPORT_METHOD(closeBLEConnection: (NSDictionary*)dic resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject ){
  
  if(!_adapter.isInit){
    reject(@"10000",@"蓝牙未初始化",nil);
    return;
    
  }
  NSString* deviceId = [dic objectForKey:@"deviceId"];
  if(!deviceId){
    reject(NO_DEVICE,@"deviceId为空",nil);
    return;
  }
  
  if(![_adapter closeConnection:deviceId]){
   //  reject(NO_DEVICE,@"找不到本设备",nil);
  }
  resolve(@{});

}


/**
获取在小程序蓝牙模块生效期间所有已发现的蓝牙设备，包括已经和本机处于连接状态的设备。
 
 
 success返回参数：
 
 参数  类型  说明
 devices  Array  uuid 对应的的已连接设备列表
 errMsg  String  成功：ok，错误：详细信息
 
 
 
 
 device 对象
 蓝牙设备信息
 
 
 name  String  蓝牙设备名称，某些设备可能没有
 deviceId  String  用于区分设备的 id
 RSSI  Number  当前蓝牙设备的信号强度
 advertisData  ArrayBuffer  当前蓝牙设备的广播数据段中的ManufacturerData数据段 （注意：vConsole 无法打印出 ArrayBuffer 类型数据）
 advertisServiceUUIDs  Array  当前蓝牙设备的广播数据段中的ServiceUUIDs数据段
 localName  String  当前蓝牙设备的广播数据段中的LocalName数据段

 @param NSDictionary <#NSDictionary description#>
 @return <#return value description#>
 */
RCT_EXPORT_METHOD(getBluetoothDevices: (NSDictionary*)dic resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject ){
  
  if(!_adapter.isInit){
    reject(@"10000",@"蓝牙未初始化",nil);
    return;
  }
  
  NSArray* devices  = [_adapter getDevices];
  
  //resolve(@[[self deviceToArray:devices]]);
  resolve(@[@{@"devices":[self deviceToArray:devices]}]);
  
}


-(NSArray*)deviceToArray:(NSArray*)devices{
  
  NSMutableArray* result = [[NSMutableArray alloc]init];
  for(CBPeripheral* device in devices){
    
    [result addObject:@{@"name":device.name,@"deviceId":device.identifier.UUIDString}];
    
  }
  return result;
}

/**
 根据 uuid 获取处于已连接状态的设备

 @param NSDictionary <#NSDictionary description#>
 @return <#return value description#>
 */
RCT_EXPORT_METHOD(getConnectedBluetoothDevices: (NSDictionary*)dic resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject ){
  
  if(!_adapter.isInit){
    reject(@"10000",@"蓝牙未初始化",nil);
    return;
  }
  
  NSArray* devices = [_adapter getConnectedDevices];
  
  resolve(@[@{@"devices":[self deviceToArray:devices]}]);
  
}




RCT_EXPORT_METHOD(getBLEDeviceServices: (NSDictionary*)dic resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject ){
  
  if(!_adapter.isInit){
    reject(@"10000",@"蓝牙未初始化",nil);
    return;
  }
  
  NSString* deviceId = [dic objectForKey:@"deviceId"];
  if(!deviceId){
    reject(@"10002",@"deviceId为空",nil);
    return;
  }
  
  
  __weak BluetoothAdapter* __adapter = _adapter;
  
  _adapter.discoveryServiceCallback = ^(CBPeripheral * device, NSError * error) {
    if(error){
      reject(SYSTEM_ERROR ,@"发现服务发生错误",error);
    }else{
      //发现了服务
      NSMutableArray* result = [[NSMutableArray alloc]initWithCapacity:device.services.count];
      for(CBService* service in device.services){
        [result addObject:@{
                            @"uuid": service.UUID.UUIDString,
                            @"isPrimary":[NSNumber numberWithBool: service.isPrimary]
                            }];
      }
      resolve(@{@"services":result});
    }
    __adapter.discoveryServiceCallback = nil;
  };
  
  CHECK([_adapter getServices:deviceId]);
  
}

+(void)retToCallback:(BluetoothAdapterResult)ret reject:(RCTPromiseRejectBlock)reject{
  
  if(ret == BluetoothAdapterResultOk){
    return ;
  }
  if(ret==BluetoothAdapterResultNotInit){
    reject(NOT_INIT,@"未初始化",nil);
    return;
  }
  if(ret==BluetoothAdapterResultDeviceNotFound){
    reject(NO_DEVICE,@"未发现设备",nil);
    return;
  }
  
  if(ret==BluetoothAdapterResultServiceNotFound){
    reject(NO_SERVICE,@"未发现服务",nil);
    return;
  }
  
  if(ret==BluetoothAdapterResultCharacteristicsNotFound){
    reject(NO_CHARACTERISTIC,@"未发现特征",nil);
    return;
  }
  
  if(ret==BluetoothAdapterResultDeviceNotConnected){
    reject(NO_CONNECTION,@"设备未连接",nil);
    return;
  }
  if(ret==BluetoothAdapterResultCharacteristicsPropertyNotSupport){
    reject(PROPERTY_NOT_SUPPOTT,@"非可通知的特征",nil);
    return;
  }
  
  
  
}


RCT_EXPORT_METHOD(getBLEDeviceCharacteristics: (NSDictionary*)dic resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject ){
  
  if(!_adapter.isInit){
    reject(@"10000",@"蓝牙未初始化",nil);
    return;
    
  }
  
  NSString* deiviceId = [dic objectForKey:@"deviceId"];
  NSString* serviceId = [dic objectForKey:@"serviceId"];
  
  _adapter.discoveryCharacteristicsCallback = ^(CBPeripheral * device, CBService * service, NSError *error) {
    if(error){
      reject(SYSTEM_ERROR ,@"发现特征发生错误",error);
    }else{
      //发现了服务
      NSMutableArray* result = [[NSMutableArray alloc]initWithCapacity:service.characteristics.count];
      for(CBCharacteristic* characteristic in service.characteristics){
        [result addObject:@{
                            @"uuid":characteristic.UUID.UUIDString,
                            @"properties":@{
                                @"read" :[NSNumber numberWithBool:( characteristic.properties & CBCharacteristicPropertyRead)],
                                @"write" :[NSNumber numberWithBool: (characteristic.properties & CBCharacteristicPropertyWrite) || (characteristic.properties & CBCharacteristicPropertyWriteWithoutResponse)   ],
                                @"notify":[NSNumber numberWithBool:( characteristic.properties & CBCharacteristicPropertyNotify)],
                                @"indicate":[NSNumber numberWithBool:( characteristic.properties & CBCharacteristicPropertyIndicate)],
                                
                                }
                            }];
      }
      
      resolve(@{@"characteristics": result  });
    }
      
  };
  
  CHECK([_adapter getCharacteristics:deiviceId serviceId:serviceId]);
}


RCT_EXPORT_METHOD(readBLECharacteristicValue: (NSDictionary*)dic resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject ){
  
  if(!_adapter.isInit){
    reject(@"10000",@"蓝牙未初始化",nil);
    return;
    
  }
  
  NSString* deviceId = dic[@"deviceId"];
  NSString* serviceId = dic[@"serviceId"];
  NSString* characteristicId = dic[@"characteristicId"];
 // NSString* value = dic[@"value"];    //二进制
  
 // value = [value stringByReplacingOccurrencesOfString:@" " withString:@""];
  
  __weak BluetoothAdapter* __adapter = _adapter;
  _adapter.readValueCallback = ^(CBPeripheral * device, CBCharacteristic * c, NSError * error) {
    if(error){
      reject(SYSTEM_ERROR,@"读取发生错误",error);
    }else{
      resolve(@{});
    }
    
    __adapter.readValueCallback = nil;
    
  };

  CHECK([_adapter readValue:deviceId serviceId:serviceId characteristicId:characteristicId]);

}

/**
 deviceId  String  是  蓝牙设备 id，参考 device 对象
 serviceId  String  是  蓝牙特征值对应服务的 uuid
 characteristicId  String  是  蓝牙特征值的 uuid
 value  ArrayBuffer  是  蓝牙设备特征值对应的二进制值
 */
RCT_EXPORT_METHOD(writeBLECharacteristicValue: (NSDictionary*)dic resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject ){
  
  if(!_adapter.isInit){
    reject(@"10000",@"蓝牙未初始化",nil);
    return;
  }
  
  NSString* deviceId = dic[@"deviceId"];
  NSString* serviceId = dic[@"serviceId"];
  NSString* characteristicId = dic[@"characteristicId"];
  NSString* value = dic[@"value"];    //二进制
  
  value = [value stringByReplacingOccurrencesOfString:@" " withString:@""];
  
  __weak BluetoothAdapter* __adapter = _adapter;
  _adapter.writeValueCallback = ^(CBPeripheral * device, CBCharacteristic * c, NSError * error) {
    if(error){
      reject(SYSTEM_ERROR,@"写入发生错误",error);
    }else{
      resolve(@{});
    }
    
    __adapter.writeValueCallback = nil;
    
  };
  
  CHECK([_adapter writeValue:deviceId serviceId:serviceId characteristicId:characteristicId value: [ RCTBluetoothModule toHex:value] ]);
}

/**
 deviceId  String  是  蓝牙设备 id，参考 device 对象
 serviceId  String  是  蓝牙特征值对应服务的 uuid
 characteristicId  String  是  蓝牙特征值的 uuid
 state  Boolean  是  true: 启用 notify; false: 停用 notify
 */
RCT_EXPORT_METHOD(notifyBLECharacteristicValueChange: (NSDictionary*)dic resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject ){
  
  if(!_adapter.isInit){
    reject(@"10000",@"蓝牙未初始化",nil);
    return;
  }
  
  
  NSString* deviceId = dic[@"deviceId"];
  NSString* serviceId = dic[@"serviceId"];
  NSString* characteristicId = dic[@"characteristicId"];
  BOOL state = [dic[@"state"]boolValue];
  
  __weak BluetoothAdapter* __adapter = _adapter;
  
  _adapter.notifyChageCallback = ^(CBPeripheral * device, CBCharacteristic * characteristic, NSError * error) {
    if(error){
      reject(SYSTEM_ERROR,@"",error);
    }else{
      resolve(@{});
    }
    __adapter.notifyChageCallback = nil;
  };
  CHECK([_adapter setNotify:deviceId serviceId:serviceId characteristicId:characteristicId state:state]);
}

RCT_EXPORT_METHOD(onBLEConnectionStateChange: (NSDictionary*)dic resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject ){
  
  if(!_adapter.isInit){
    reject(@"10000",@"蓝牙未初始化",nil);
    return;
  }
  
}



RCT_EXPORT_METHOD(onBLECharacteristicValueChange: (NSDictionary*)dic resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject ){
  
  if(!_adapter.isInit){
    reject(@"10000",@"蓝牙未初始化",nil);
    return;
    
  }
  
}
+(NSData*)toHex:(NSString*)hexString{
  
  NSMutableData* data = [[NSMutableData alloc]initWithCapacity:hexString.length/2];
  [RCTBluetoothModule toHex:hexString hex:data];
  return data;
}

+(int)toDigit:(int)codePoint{
  // Optimized for ASCII
  int result = -1;
  if ('0' <= codePoint && codePoint <= '9') {
    result = codePoint - '0';
  } else if ('a' <= codePoint && codePoint <= 'z') {
    result = 10 + (codePoint - 'a');
  } else if ('A' <= codePoint && codePoint <= 'Z') {
    result = 10 + (codePoint - 'A');
  }
  return result;
}
+(NSString*)toString:(NSData*)data{
  NSUInteger len = [data length];
  return [RCTBluetoothModule toString:data len:len];
}
+(NSString*)toString:(NSData*)data len:(NSInteger)len{
  char *chars = (char *)[data bytes];
  NSMutableString *hexString = [[NSMutableString alloc]init];
  for (NSUInteger i=0; i<len; i++) {
    [hexString appendString:[NSString stringWithFormat:@"%0.2hhx",chars[i]]];
  }
  return hexString;
}
+(void)toHex:(NSString*)data hex:(NSMutableData*)dest{
  
  int len = (int)data.length;
  if( (len & 0x0 )!= 0){
    @throw [[NSError alloc]initWithDomain:@"不是偶数" code:0 userInfo:nil];
  }
  for( int i=0 , j = 0; j < len; ++i){
    
    int f = [RCTBluetoothModule toDigit:[data characterAtIndex:j]] << 4;
    ++j;
    f |=[RCTBluetoothModule toDigit:[data characterAtIndex:j]];
    ++j;
    
    Byte b = (Byte)(f & 0xff);
    
    [dest appendBytes:&b length:1];
    
  }
  
  
}
@end
