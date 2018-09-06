package com.jzoom.rnble;

import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattService;

import java.util.List;

/**
 * Created by jzoom on 2018/1/27.
 */

public interface DeviceListener {
    /**
     * 断开连接
     * @param device
     */
    void onDisconnected(BluetoothGatt device);


    /**
     * 启动了连接
     * @param device
     */
    void onConnected(BluetoothGatt device);

    /**
     * 连接失败
     * @param device
     */
    void onConnectFailed(BluetoothGatt device);

    /**
     *
     * @param gatt
     * @param success
     */
    void onServicesDiscovered(BluetoothGatt gatt,boolean success);
}
