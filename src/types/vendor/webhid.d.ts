/**
 * Very minimal typings for the WebHID API.
 *
 * https://github.com/WICG/webhid/blob/master/EXPLAINER.md
 */

declare interface HIDDevice {
  vendorId: number;
  productId: number;
}

declare interface HIDDeviceRequestOptions {
  filters: HIDDeviceFilter[];
}

interface HIDDeviceFilter {
  vendorId?: number;
  productId?: number;
}

declare interface Navigator {
  hid: {
    getDevices(): Promise<HIDDevice[]>;
    requestDevice(options?: HIDDeviceRequestOptions): Promise<USBDevice>;
  };
}
