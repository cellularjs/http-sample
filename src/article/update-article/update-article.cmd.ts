import { Service, ServiceHandler } from '@cellularjs/net';
import { Transaction } from '$share/postgresql';
import { ResourceNotFound } from '$share/message';
import { GetArticleRepo, UpdateArticleRepo } from 'article/update-article/update-article.repo';
import { UpdateArticleReq } from 'article/update-article/update-article.req';

@Transaction()
@Service({ scope: 'publish' })
export class UpdateArticleCmd implements ServiceHandler {
  constructor(
    private getArticleRepo: GetArticleRepo,
    private updateArticleRepo: UpdateArticleRepo,
    private updateArticleReq: UpdateArticleReq,
  ) { }

  async handle() {
    const { getArticleRepo, updateArticleRepo, updateArticleReq } = this;
    const existArticle = await getArticleRepo.exec({ id: updateArticleReq.id });

    if (!existArticle) {
      throw new ResourceNotFound();
    }

    await updateArticleRepo.exec(updateArticleReq);
  }
}
