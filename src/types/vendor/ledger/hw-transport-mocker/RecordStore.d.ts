declare module '@ledgerhq/hw-transport-mocker/RecordStore' {
  import type { Buffer } from 'buffer';

  export type Queue = Array<[string, string]>;

  export class RecordStore {
    /**
     * Create an instance of RecordStore from a string.
     *
     * @param {string} str The string to create the RecordStore from.
     * @return {RecordStore} An instance of RecordStore;
     */
    static fromString(str: string): RecordStore;

    queue: Queue;

    /**
     * Create a new instance of the RecordStore class.
     *
     * @param {Queue} queue An optional queue to use.
     */
    constructor(queue?: Queue);

    /**
     * Get whether the queue is empty.
     *
     * @return {boolean} TRUE if the queue is empty, FALSE otherwise
     */
    isEmpty(): boolean;

    /**
     * Record an APDU exchange to the queue.
     *
     * @param {Buffer} apdu The input data.
     * @param {Buffer} out The output data.
     */
    recordExchange(apdu: Buffer, out: Buffer): void;

    /**
     * Replay a previously recorded APDU exchange. Throws an error if the queue is empty or if the
     * recorded APDU is invalid.
     *
     * @param {Buffer} apdu The input to replay
     * @return {Buffer} A Buffer with the previously recorded output data.
     */
    replayExchange(apdu: Buffer): Buffer;

    /**
     * Ensure the queue is empty. Throws an error if the queue isn't empty.
     */
    ensureQueueEmpty(): void;

    /**
     * Get the current queue as string.
     *
     * @return {string} The queue as string.
     */
    toString(): string;
  }
}
