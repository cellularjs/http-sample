import * as express from 'express';
import { createNetWork } from '@cellularjs/net';
import { createPool, initNetWorker } from '@cellularjs/worker'
import { workerSampleNetwork } from '$share/network/worker-sample.net';
import { workerRouter } from 'worker/$gateway/worker.http';
import { isMainThread } from 'worker_threads';
import { env } from '$share/env';

!isMainThread && initNetWorker(workerSampleNetwork);

isMainThread && (async () => {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.disable('x-powered-by');

  app.use('/api/worker', workerRouter);

  // For simplicity, in this example, we use current file as worker script.
  await createPool({
    script: __filename,
    minThread: 30,
  });

  await createNetWork(workerSampleNetwork);

  const port = env().WORKER_HTTP_PORT;

  app.listen(port, () => console.log(`Worker sample: ready for http request (port: ${port})`));
})();