import * as express from 'express';
import { createNetWork } from '@cellularjs/net';
import { yoAppNetwork } from '$share/network/yo.conf';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.disable('x-powered-by');



(async () => {
  await createNetWork(yoAppNetwork);

  app.listen(3000, () => console.log('Ready for http request🚀🚀🚀'));
})();