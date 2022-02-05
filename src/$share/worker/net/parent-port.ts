import { parentPort, threadId } from 'worker_threads';
import { IRQ } from '@cellularjs/net';
import { MessageType, PostMessage, RecievedMessage } from '../internal';

export class ParentPort {
  private static _map = new Map();

  /**
   * Send message from child thread to parent thread.
   */
  static postMessage = (msg: PostMessage) => parentPort.postMessage(msg);

  /**
   * Notice: type will be converted into string even it is a number.
   */
  static onMessage = (
    type: MessageType,
    cb: (msg: RecievedMessage<IRQ>) => void,
  ) => this._map.set(type, cb);

  static async init(cb?: () => void | Promise<void>) {
    parentPort.on('message', async (msg: RecievedMessage<any>) => {
      const cb = this._map.get(msg.type);

      cb(msg);
    });

    cb && (await cb());

    ParentPort.postMessage({
      payload: `ready ${threadId}`,
      type: MessageType.READY,
    });
  }
}
