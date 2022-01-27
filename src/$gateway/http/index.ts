import * as express from 'express';
import { createNetWork } from '@cellularjs/net';
import { createNetWorkers, initNetWorker } from 'worker'
import { blogAppNetwork } from '$share/network/blog.conf';
import { articleRouter } from 'article/$gateway/article.http';
import { graphRouter } from 'graph/$gateway/graph.http';
import { isMainThread } from 'worker_threads'

!isMainThread && initNetWorker(async () => {
  await createNetWork(blogAppNetwork);
});

isMainThread && (async () => {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.disable('x-powered-by');

  app.use('/graphql', graphRouter);
  app.use('/api/article', articleRouter);

  await createNetWorkers(__filename, 6);
  await createNetWork(blogAppNetwork);

  app.listen(3001, () => console.log('HTTP Gateway: ready for http request (port: 3001)'));
})();