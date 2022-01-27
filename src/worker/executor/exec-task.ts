import { IRQ, IRS } from '@cellularjs/net';
import { Worker as NodeJSWorker } from 'worker_threads';
import {
  Worker,
  Pool,
  WorkerStatus,
  MessageType,
  PostMessage,
  RecievedMessage,
} from '../internal';

export async function execTask<T = any>(postMsg: PostMessage<IRQ>): Promise<T> {
  if (Pool.totalWorker() === 0) {
    throw new Error('Net Worker: there is no worker in pool.');
  }

  const worker = await Pool.waitForIdleWorker();

  return new Promise((resolve, reject) => {
    const nodeJsWorker = worker.getNodeJsWorker();
    nodeJsWorker.on('message', function (recievedMsg: RecievedMessage<IRS>) {
      const channel = channels(resolve, reject, nodeJsWorker, worker)[
        recievedMsg.type
      ];
      channel(recievedMsg);
    });

    nodeJsWorker.postMessage(postMsg);
  });
}

const channels = (
  resolve,
  reject,
  nodeJsWorker: NodeJSWorker,
  worker: Worker,
) => ({
  // [MessageType.HOOK]: (msg: RecievedMessage<IRS>) => {
  //   WorkerHook.runHook(msg.data.hook, msg.data.hookData);
  // },

  // [MessageType.TASK]: (msg: RecievedMessage<IRS>) => {
  //   WorkerHook.runTask('send_via_thread', msg);
  // },

  [MessageType.ERROR]: (msg: RecievedMessage<IRS>) => {
    // return error to client
    reject(msg.payload);

    // worker ready for new task
    worker.setStatus(WorkerStatus.IDLE);
  },

  [MessageType.DONE]: (msg: RecievedMessage<IRS>) => {
    // remove message listener immediately
    nodeJsWorker.removeAllListeners('message');

    // return data to client
    resolve(msg.payload);

    // worker ready for new task
    worker.setStatus(WorkerStatus.IDLE);
  },
});
