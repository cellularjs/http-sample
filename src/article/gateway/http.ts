import { expressProxy } from '$share/express-proxy';

const articleProxy = expressProxy();

articleProxy.get('/create', 'Article:Create');

articleProxy.get('/update', 'Article:Update');

articleProxy.get('/delete', 'Article:Delete');

articleProxy.get('/list', 'Article:List');

articleProxy.get('/detail', 'Article:Detail');

export const articleRouter = articleProxy.router;