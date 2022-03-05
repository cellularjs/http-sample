import { Router } from 'express';
import { proxyTo } from '$share/express-proxy';

export const articleRouter = Router();

articleRouter.get('/create', proxyTo('Article:CreateArticleCmd'));

articleRouter.get('/update', proxyTo('Article:UpdateArticleCmd'));

articleRouter.get('/delete', proxyTo('Article:DeleteArticleCmd'));

articleRouter.get('/search', proxyTo('Article:SearchQry'));

articleRouter.get('/detail', proxyTo('Article:DetailArticleQry'));
