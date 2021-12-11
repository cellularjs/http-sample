import * as express from 'express';
import { createNetWork } from '@cellularjs/net';
import { blogAppNetwork } from '$share/network/blog.conf';
import { articleRouter } from '@cell/article/gateway/http'

(async () => {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use('/api/article', articleRouter)
  app.disable('x-powered-by');

  await createNetWork(blogAppNetwork);

  app.listen(3001, () => console.log('Ready for http request'));
})();