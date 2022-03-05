import { Router } from 'express';
import { proxyTo } from '$share/express-proxy';

export const workerRouter = Router();

workerRouter.get('/test', proxyTo('Worker:TestQry'));
