import { Service, ServiceHandler } from '@cellularjs/net';
import { Transaction } from '$share/postgresql';
import { CreateArticleReq } from 'article/create-article/create-article.req';
import { CreateArticleRepo } from 'article/create-article/create-article.repo';

@Transaction()
@Service({ scope: 'publish' })
export class CreateArticleCmd implements ServiceHandler {
  constructor(
    private createArticleReq: CreateArticleReq,
    private createArticleRepo: CreateArticleRepo,
  ) { }

  handle() {
    const { createArticleReq, createArticleRepo } = this;

    return createArticleRepo.exec(createArticleReq);
  }
}
