declare module '@ledgerhq/hw-transport-mocker/createTransportReplayer' {
  import type { Observer, Subscription } from '@ledgerhq/hw-transport';
import Transport from '@ledgerhq/hw-transport';
  import type { RecordStore } from '@ledgerhq/hw-transport-mocker/RecordStore';

  class TransportReplayer<Descriptor> extends Transport<Descriptor> {
    static isSupported(): Promise<true>;

    static list(): Promise<[null]>;

    static listen(observer: Observer<{ type: 'add'; descriptor: null }>): Subscription;

    static open(): Promise<TransportReplayer<Descriptor>>;
  }

  type TransportConstructor<Descriptor> = new (...args: unknown[]) => Transport<Descriptor>;

  type TransportReplayerConstructor<Descriptor> = typeof TransportReplayer &
    (new (...args: unknown[]) => TransportReplayer<Descriptor>);

  /**
   * Create a transport, which replays any APDU exchanges.
   *
   * @param {RecordStore} recordStore The RecordStore to replay from.
   * @return {TransportReplayer<Descriptor>} The decorated transport.
   * @template Descriptor
   */
  export default function <Descriptor>(
    recordStore: RecordStore
  ): TransportReplayerConstructor<Descriptor>;
}
