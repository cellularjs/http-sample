import * as express from 'express';
import { createNetWork } from '@cellularjs/net';
import { blogAppNetwork } from '$share/network/blog.net';
import { articleRouter } from 'article/$gateway/article.http';
import { graphRouter } from 'graph/$gateway/graph.http';
import { env } from '$share/env';
import { getLogger } from '$share/logger';

(async () => {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.disable('x-powered-by');

  app.use('/api/graphql', graphRouter);
  app.use('/api/article', articleRouter);

  await createNetWork(blogAppNetwork);

  const port = env().CRUD_HTTP_PORT;

  const logger = getLogger();
  app.listen(port, () => logger.info(`App - ready for HTTP request (port: ${port})`));
})();