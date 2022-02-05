import { expressJsonProxy } from '$share/express-proxy';

const articleProxy = expressJsonProxy();

articleProxy.get('/create', 'Article:CreateArticleCmd');

articleProxy.get('/update', 'Article:UpdateArticleCmd');

articleProxy.get('/delete', 'Article:DeleteArticleCmd');

articleProxy.get('/search', 'Article:SearchQry');

articleProxy.get('/detail', 'Article:DetailArticleQry');

export const articleRouter = articleProxy.router;