import { Service, ServiceHandler, IRQ } from '@cellularjs/net';
import { Transaction } from '$share/postgresql';
import { DeleteArticleRepo } from 'article/delete-article/delete-article.repo';

@Transaction()
@Service({ scope: 'publish' })
export class DeleteArticleCmd implements ServiceHandler {
  constructor(
    private deleteArticleRepo: DeleteArticleRepo,
    private irq: IRQ,
  ) { }

  async handle() {
    const { deleteArticleRepo } = this;
    const { id } = this.irq.body;

    await deleteArticleRepo.exec({ id });
  }
}
