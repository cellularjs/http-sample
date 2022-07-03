import * as express from 'express';
import { createNetWork } from '@cellularjs/net';
import { blogAppNetwork } from '$share/network/blog.net';
import { articleRouter } from 'article/$gateway/article.http';
import { graphRouter } from 'graph/$gateway/graph.http';
import { env } from '$share/env';

(async () => {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.disable('x-powered-by');

  app.use('/api/graphql', graphRouter);
  app.use('/api/article', articleRouter);

  await createNetWork(blogAppNetwork);

  const port = env().CRUD_HTTP_PORT;

  app.listen(port, () => console.log(`HTTP Gateway: ready for http request (port: ${port})`));
})();