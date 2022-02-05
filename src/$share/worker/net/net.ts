import { send, IRQ, IRS } from '@cellularjs/net';
import { MessageType, execTask } from '../internal';
import { Worker as NodeJSWorker } from 'worker_threads';
import { Pool, Worker, RecievedMessage } from '../internal';
import { ParentPort } from './parent-port';

export function initNetWorker(cb: () => void | Promise<void>) {
  ParentPort.onMessage(
    MessageType.TASK,
    async (msg: RecievedMessage<IRQ>) => {
      try {
        const irs = await send(msg.payload);

        ParentPort.postMessage({
          type: MessageType.DONE,
          payload: irs,
        });
      } catch (err) {
        ParentPort.postMessage({
          type: MessageType.ERROR,
          payload: err,
        });
      }
    },
  );

  ParentPort.init(cb);
}

export function sendViaWorker(irq: IRQ) {
  return execTask<IRS>({
    type: MessageType.TASK,
    payload: irq,
  });
}

const createNetWorker = (workerFile) =>
  new Promise((resolve, reject) => {
    try {
      const nodeJsWorker = new NodeJSWorker(workerFile);
      nodeJsWorker.once('message', (msg) => {
        if (msg.type !== MessageType.READY) {
          return;
        }

        const worker = new Worker(nodeJsWorker);
        Pool.addWorker(worker);
        resolve(undefined);
      });
    } catch (err) {
      reject(err);
    }
  });

export async function createNetWorkers(workerFile, n = 1) {
  const aaa = [];
  for (let i = 0; i < n; i++) {
    aaa.push(createNetWorker(workerFile));
  }

  return Promise.all(aaa);
}
