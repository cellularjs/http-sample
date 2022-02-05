import { expressJsonProxy } from '$share/express-proxy';

const workerProxy = expressJsonProxy();

workerProxy.get('/test', 'Worker:TestQry');

export const workerRouter = workerProxy.router;
