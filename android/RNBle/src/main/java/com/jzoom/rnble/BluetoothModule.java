package com.jzoom.rnble;

/*
 * *
 *  * Copyright (c) $year-present, JZoom, Inc.
 *  * All rights reserved.
 *  *
 *  * This source code is licensed under the Apache-2.0 license found in the
 *  * LICENSE page
 *  * http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  *
 *
 *
 */

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.List;

import static com.jzoom.rnble.BluetoothAdapterResult.BluetoothAdapterResultDeviceNotFound;
import static com.jzoom.rnble.BluetoothAdapterResult.BluetoothAdapterResultNotInit;

/**
 * Created by renxueliang on 2017/12/9.
 */

public class BluetoothModule extends ReactContextBaseJavaModule {

    public static final String NOT_INIT = "10000";
    public static final String NOT_AVALIABLE ="10001";
    public static final String NO_DEVICE ="10002";
    public static final String CONNECTION_FAIL ="10003";
    public static final String NO_SERVICE ="10004";
    public static final String NO_CHARACTERISTIC ="10005";
    public static final String NO_CONNECTION ="10006";
    public static final String PROPERTY_NOT_SUPPOTT ="10007";
    public static final String SYSTEM_ERROR ="10008";
    public static final String SYSTEM_NOT_SUPPORT ="10009";

    private BleAdapter adapter;

    public BluetoothModule(ReactApplicationContext reactContext) {
        super(reactContext);
        adapter = new BleAdapter(reactContext.getApplicationContext());
    }

    @Override
    public String getName() {
        return "BluetoothModule";
    }


    @ReactMethod
    public void openBluetoothAdapter(ReadableMap data, Promise promise){
        if(adapter.open()){
            promise.resolve(Arguments.createMap());
        }else{
            promise.reject(NOT_AVALIABLE,"蓝牙适配器不可用");
        }
    }

    @ReactMethod
    public void startBluetoothDevicesDiscovery(ReadableMap data, Promise promise){
        BluetoothAdapterResult ret = adapter.startScan();
        if( BluetoothAdapterResult.BluetoothAdapterResultOk == adapter.startScan()){
            promise.resolve(Arguments.createMap());
        }else{
            retToCallback(ret,promise);
        }
    }


    @ReactMethod
    public void stopBluetoothDevicesDiscovery(ReadableMap data, Promise promise){
        adapter.stopScan();
        promise.resolve(Arguments.createMap());
    }


    @ReactMethod
    public void createBLEConnection(ReadableMap data, Promise promise){
        String deviceId = data.getString("deviceId");
        adapter.connectDevice(deviceId);
    }

    private void retToCallback(BluetoothAdapterResult ret,Promise promise){
        switch (ret){
            case BluetoothAdapterResultNotInit:
                promise.reject(NOT_INIT,"未初始化");
                break;
            case BluetoothAdapterResultDeviceNotFound:
                promise.reject(NO_DEVICE,"未找到对应的设备");
                break;
            case BluetoothAdapterResultDeviceNotConnected:
                promise.reject(NO_CONNECTION,"设备未连接");
                break;
            case BluetoothAdapterResultServiceNotFound:
                promise.reject(NO_SERVICE,"未找到对应的服务");
                break;
            case BluetoothAdapterResultCharacteristicsNotFound:
                promise.reject(NO_CHARACTERISTIC,"未找到对应的特征");
                break;
            case BluetoothAdapterResultCharacteristicsPropertyNotSupport:
                promise.reject(PROPERTY_NOT_SUPPOTT,"不支持的特征属性");
                break;
        }

    }

    @ReactMethod
    public void closeBluetoothAdapter(ReadableMap data, Promise promise){
        adapter.close();
        promise.resolve(Arguments.createMap());
    }




}
