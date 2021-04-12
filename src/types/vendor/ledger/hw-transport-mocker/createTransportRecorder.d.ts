declare module '@ledgerhq/hw-transport-mocker/createTransportRecorder' {
  import Transport from '@ledgerhq/hw-transport';
  import type { RecordStore } from '@ledgerhq/hw-transport-mocker/RecordStore';

  class TransportRecorder<Descriptor> extends Transport<Descriptor> {
    static recordStore: RecordStore;

    static isSupported: typeof Transport.isSupported;

    static list: typeof Transport.list;
  }

  type TransportConstructor<Descriptor, Args extends []> = new (
    ...args: Args
  ) => Transport<Descriptor>;

  type TransportRecorderConstructor<Descriptor> = typeof TransportRecorder &
    (new (...args: unknown[]) => TransportRecorder<Descriptor>);

  /**
   * Create a decorated transport, which records any APDU exchanges.
   *
   * @param {TransportConstructor<Descriptor>} DecoratedTransport The transport class to decorate.
   * @param {RecordStore} recordStore The RecordStore to record to.
   * @return {TransportRecorder<Descriptor>} The decorated transport.
   * @template Descriptor
   */
  export default function <Descriptor>(
    DecoratedTransport: TransportConstructor<Descriptor>,
    recordStore: RecordStore
  ): TransportRecorderConstructor<Descriptor>;
}
