import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager, Device, State, Subscription } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { BlePort, Peripheral, SERVICE_UUID, CHAR_UUID, Connection } from './core';
export const liveSupported = true;
export class NativePort implements BlePort {
  private manager: BleManager | null = null;
  private device: Device | null = null;
  private subscription: Subscription | null = null;
  private response = true;
  private closed = false;
  private scanning = false;
  private getManager() {
    if (this.closed) throw new Error('Session closed');
    if (!this.manager) {
      try { this.manager = new BleManager(); }
      catch { throw new Error('Install the BLUEPRINT APK or a development build on a physical phone. Expo Go does not support this BLE module.'); }
    }
    return this.manager;
  }
  private async permission() {
    if (Platform.OS !== 'android') return;
    const permissions = Number(Platform.Version) >= 31
      ? [PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN, PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT]
      : [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
    const result = await PermissionsAndroid.requestMultiple(permissions);
    if (!permissions.every(p => result[p] === PermissionsAndroid.RESULTS.GRANTED))
      throw new Error('Allow Bluetooth / Nearby devices in app settings. Android 11 and earlier also require Location permission and Location services.');
  }
  async scan(found: (d: Peripheral) => void, failed: (e: Error) => void) {
    this.scanning = true;
    await this.permission();
    if (!this.scanning || this.closed) return;
    const manager = this.getManager();
    let state = await manager.state();
    if (state === State.Unknown) {
      await new Promise(resolve => setTimeout(resolve, 500));
      state = await manager.state();
    }
    if (state !== State.PoweredOn) throw new Error(state === State.Unsupported ? 'This phone does not support Bluetooth Low Energy.' : state === State.Unauthorized ? 'Bluetooth permission is missing. Allow it in app settings.' : 'Turn on Bluetooth and scan again.');
    if (!this.scanning || this.closed) return;
    // Scan all: some peripherals do not advertise their service UUID.
    await manager.startDeviceScan(null, { allowDuplicates: false }, (error, d) => {
      if (!this.scanning || this.closed) return;
      if (error) { failed(new Error(error.message)); return; }
      if (!d || d.isConnectable === false) return;
      found({ id: d.id, name: d.name || d.localName || 'Unnamed BLE device', rssi: d.rssi,
        target: d.serviceUUIDs?.some(u => u.toLowerCase() === SERVICE_UUID) });
    });
  }
  async stopScan() { this.scanning = false; if (this.manager) await this.manager.stopDeviceScan(); }
  async connect(id: string, lost: () => void): Promise<Connection> {
    const manager = this.getManager();
    try {
      let d = await manager.connectToDevice(id, { timeout: 15000 });
      d = await d.discoverAllServicesAndCharacteristics();
      const services = await d.services();
      if (!services.some(s => s.uuid.toLowerCase() === SERVICE_UUID)) throw new Error('This device does not have the required service UUID. Choose your instructor\'s device.');
      const chars = await d.characteristicsForService(SERVICE_UUID);
      const characteristic = chars.find(c => c.uuid.toLowerCase() === CHAR_UUID);
      if (!characteristic?.isReadable || !(characteristic.isWritableWithResponse || characteristic.isWritableWithoutResponse))
        throw new Error('The required readable and writable characteristic was not found.');
      if (Platform.OS === 'android') {
        try { d = await d.requestMTU(185); } catch { /* Keep negotiated default; write checks size. */ }
      }
      this.device = d;
      this.response = characteristic.isWritableWithResponse;
      this.subscription?.remove();
      this.subscription = manager.onDeviceDisconnected(id, () => { this.device = null; lost(); });
      return { id: d.id, name: d.name || d.localName || 'Classroom BLE device', rssi: d.rssi, mtu: d.mtu, canWriteResponse: this.response, target: true };
    } catch (e) { await manager.cancelDeviceConnection(id).catch(() => {}); throw e; }
  }
  async disconnect() {
    const id = this.device?.id;
    this.subscription?.remove(); this.subscription = null;
    if (id && this.manager) await this.manager.cancelDeviceConnection(id);
    this.device = null;
  }
  async read() {
    if (!this.device) throw new Error('Device disconnected. Please connect again.');
    const c = await this.device.readCharacteristicForService(SERVICE_UUID, CHAR_UUID);
    if (c.value === null) throw new Error('The device returned no characteristic value.');
    return Buffer.from(c.value, 'base64').toString('utf8');
  }
  async write(text: string) {
    if (!this.device) throw new Error('Device disconnected. Please connect again.');
    const bytes = Buffer.from(text, 'utf8');
    if (bytes.length > 512) throw new Error('The message exceeds 512 bytes. Please shorten it.');
    if (Platform.OS === 'android' && bytes.length > this.device.mtu - 3)
      throw new Error(`This message is ${bytes.length} bytes, but the negotiated payload limit is ${this.device.mtu - 3} bytes. Reconnect or ask the instructor to increase the MTU. The app will not split the message into separate writes.`);
    const value = bytes.toString('base64');
    if (this.response) await this.device.writeCharacteristicWithResponseForService(SERVICE_UUID, CHAR_UUID, value);
    else await this.device.writeCharacteristicWithoutResponseForService(SERVICE_UUID, CHAR_UUID, value);
  }
  destroy() {
    this.closed = true; this.scanning = false;
    this.subscription?.remove();
    const manager = this.manager, id = this.device?.id;
    if (manager) void (async () => {
      await manager.stopDeviceScan().catch(() => {});
      if (id) await manager.cancelDeviceConnection(id).catch(() => {});
      await manager.destroy().catch(() => {});
    })();
    this.manager = null; this.device = null;
  }
}
