declare module '@ledgerhq/hw-transport-node-hid-noevents' {
  import type { DeviceModel } from '@ledgerhq/devices';
  import type { DescriptorEvent, Observer, Subscription } from '@ledgerhq/hw-transport';
  import Transport from '@ledgerhq/hw-transport';

  export default class TransportNodeHid extends Transport<string> {
    /**
     * List all available descriptors. For a better granularity, use `listen()`.
     *
     * @return {Promise<string[]>} All available descriptors.
     */
    static list(): Promise<string[]>;

    /**
     * Listen to all device events for a given Transport. The method takes an Observer of
     * DescriptorEvent and returns a Subscription (according to Observable paradigm
     * https://github.com/tc39/proposal-observable). Each `listen()` call will first emit all
     * potential devices already connected and then will emit events that can come over time, for
     * instance if you plug a USB device after `listen()` or a Bluetooth device becomes
     * discoverable.
     *
     * @param {Observer} observer The observer object.
     * @return A Subcription object on which you can `.unsubscribe()`, to stop listening to
     *   descriptors.
     */
    static listen(observer: Observer<DescriptorEvent<string>>): Subscription;

    /**
     * Attempt to create an instance of the Transport with the descriptor.
     *
     * @param {string} descriptor The descriptor to open the Transport with. If none provided, the
     *   first available device will be used.
     * @return {Promise<Transport<TransportNodeHid>} A Promise with the Transport instance.
     */
    static open(descriptor?: string): Promise<TransportNodeHid>;

    readonly device: string;
    readonly deviceModel?: DeviceModel;
    readonly channel: number;
    readonly packetSize: number;
    readonly disconnected: boolean;

    constructor(device: string);

    /**
     * Not used by this specific Transport.
     */
    setScramblekey(): void;
  }
}
