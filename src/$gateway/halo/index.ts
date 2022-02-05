import * as express from 'express';
import { createNetWork } from '@cellularjs/net';
import { blogAppNetwork } from '$share/network/blog.conf';
import { articleRouter } from 'article/$gateway/article.http';

const haloPort = process.env.HALO_PORT;

(async () => {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.disable('x-powered-by');

  app.use('/api/article', articleRouter);

  await createNetWork(blogAppNetwork);

  app.listen(haloPort, () => console.log(`Halo Gateway: ready for http request (port: ${haloPort})`));
})();