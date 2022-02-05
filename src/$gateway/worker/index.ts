import * as express from 'express';
import { createNetWork } from '@cellularjs/net';
import { createNetWorkers, initNetWorker } from '$share/worker'
import { workerSampleNetwork } from '$share/network/worker-sample.net';
import { workerRouter } from 'worker/$gateway/worker.http';
import { isMainThread, threadId } from 'worker_threads';

const workerHttpPort = process.env.WORKER_HTTP_PORT;

!isMainThread && initNetWorker(async () => {
  await createNetWork(workerSampleNetwork);
  console.log(`(Thread ID: ${threadId}) Ready`)
});

isMainThread && (async () => {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.disable('x-powered-by');

  app.use('/api/worker', workerRouter);

  await createNetWorkers(__filename, 30);
  await createNetWork(workerSampleNetwork);

  app.listen(workerHttpPort, () => console.log(`Worker sample: ready for http request (port: ${workerHttpPort})`));
})();