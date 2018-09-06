package com.jzoom.rnble;

import android.bluetooth.BluetoothDevice;

/**
 * Created by jzoom on 2018/1/26.
 */

public interface BleListener {


    void onBleStatusCharge();

    void onDeviceConnected(BluetoothDevice device);

    void onDeviceDisconnected(BluetoothDevice device);

    /**
     * 找到设备
     * @param device
     * @param rssi
     */
    void onDeviceFound(BluetoothDevice device, int rssi);
}
