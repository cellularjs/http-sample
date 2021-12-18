import { Service, ServiceHandler } from '@cellularjs/net';
import { Transaction } from '$share/postgresql';
import { ChangeStatusArticleReq } from 'article/change-status/change-status.req';
import { ChangeStatusArticleRepo } from 'article/change-status/change-status.repo';

@Transaction()
@Service({ scope: 'publish' })
export class ChangeStatusCmd implements ServiceHandler {
  constructor(
    private changeStatusArticleReq: ChangeStatusArticleReq,
    private changeStatusArticleRepo: ChangeStatusArticleRepo,
  ) { }

  handle() {
    const { changeStatusArticleReq, changeStatusArticleRepo } = this;

    return changeStatusArticleRepo.exec(changeStatusArticleReq);
  }
}