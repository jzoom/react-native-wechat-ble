package com.jzoom.rnble;

import android.annotation.TargetApi;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothProfile;
import android.os.Build;

/**
 * Created by jzoom on 2018/1/26.
 */

@TargetApi(Build.VERSION_CODES.JELLY_BEAN_MR2)
public class DeviceAdapter extends BluetoothGattCallback {
    private final BluetoothDevice device;

    private boolean connected;
    private BluetoothGatt gatt;

    private volatile DeviceListener listener;

    public DeviceAdapter(BluetoothDevice device,DeviceListener listener){
        this.device = device;
        this.listener = listener;
    }


    public String getDeviceId(){
        return this.device.getAddress();
    }

    public DeviceListener getListener(){
        synchronized (this){
            return listener;
        }
    }

    @Override
    public void onConnectionStateChange(BluetoothGatt gatt, final int status, final int newState) {
        super.onConnectionStateChange(gatt, status, newState);
        if (status != BluetoothGatt.GATT_SUCCESS) { // 连接失败判断
            //连接失败
            connected = false;
            DeviceListener listener = getListener();
            if(listener != null){
                listener.onConnectFailed(gatt);
            }
            return;
        }
        if (newState == BluetoothProfile.STATE_CONNECTED) { // 连接成功判断
            //mBluetoothGatt.discoverServices(); // 发现服务
            //成功之后加入到缓存
            connected = true;
            DeviceListener listener = getListener();
            if(listener != null){
                listener.onConnected(gatt);
            }
            return;
        }
        if (newState == BluetoothProfile.STATE_DISCONNECTED) {  // 连接断开判断
            try{
                if( this.gatt != null){
                    this.gatt.close();
                }
            }catch (Throwable t){

            }
            connected = false;
            DeviceListener listener = getListener();
            if(listener != null){
                listener.onDisconnected(gatt);
            }
            return;
        }
    }

    @Override
    public void onServicesDiscovered(BluetoothGatt gatt, final int status) {
        super.onServicesDiscovered(gatt, status);
        DeviceListener listener = getListener();
        if(listener!=null){
            listener.onServicesDiscovered(gatt,status == BluetoothGatt.GATT_SUCCESS);
        }
    }

    @Override
    public void onDescriptorWrite(BluetoothGatt gatt, BluetoothGattDescriptor descriptor, final int status) {
        super.onDescriptorWrite(gatt, descriptor, status);
        if (status != BluetoothGatt.GATT_SUCCESS) {  // 写Descriptor失败
            return;
        }
        //不是失败的情况就是成功

    }

    @Override
    public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {
        super.onCharacteristicChanged(gatt, characteristic);
        //BLE设备主动向手机发送的数据时收到的数据回调


       // listener.onValueCharged(device);
    }

    @Override
    public void onCharacteristicWrite(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
        super.onCharacteristicWrite(gatt, characteristic, status);
        if (status != BluetoothGatt.GATT_SUCCESS) {  // 写数据失败
            return;
        }

    }

    @Override
    public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
        super.onCharacteristicRead(gatt, characteristic, status);
    }

    @Override
    public void onDescriptorRead(BluetoothGatt gatt, BluetoothGattDescriptor descriptor, int status) {
        super.onDescriptorRead(gatt, descriptor, status);
    }

    @Override
    public void onMtuChanged(BluetoothGatt gatt, int mtu, int status) {
        super.onMtuChanged(gatt, mtu, status);
    }

    @Override
    public void onReadRemoteRssi(BluetoothGatt gatt, int rssi, int status) {
        super.onReadRemoteRssi(gatt, rssi, status);
    }

    @Override
    public void onReliableWriteCompleted(BluetoothGatt gatt, int status) {
        super.onReliableWriteCompleted(gatt, status);
    }

    /**
     * 强制断开和设备的连接
     */
    public void disconnect() {
        if(this.gatt != null){
            this.gatt.disconnect();
            this.gatt = null;
        }

        synchronized (this){
            this.listener = null;
        }


    }

    public BluetoothGatt getGatt() {
        return gatt;
    }

    public void setGatt(BluetoothGatt gatt) {
        this.gatt = gatt;
    }

    public BluetoothDevice getDevice() {
        return device;
    }

    public boolean isConnected() {
        return connected;
    }
}
