import * as express from 'express';
import { createNetWork } from '@cellularjs/net';
import { blogAppNetwork } from '$share/network/blog.conf';
import { articleRouter } from 'article/$gateway/article.http';
import { graphRouter } from 'graph/$gateway/graph.http';

(async () => {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.disable('x-powered-by');

  app.use('/api/article', articleRouter);
  app.use('/graphql', graphRouter);

  await createNetWork(blogAppNetwork);

  app.listen(3001, () => console.log('Ready for http request'));
})();