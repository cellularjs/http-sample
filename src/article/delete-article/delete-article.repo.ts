import { Injectable } from '@cellularjs/di';
import { Client } from '$share/postgresql';

const deleteArticleSql = 'DELETE FROM cms.tbl_article WHERE id = $1';

interface DeleteArticleParams {
  id: string;
}

@Injectable()
export class DeleteArticleRepo {
  constructor(
    private client: Client,
  ) { }

  async exec(params: DeleteArticleParams) {
    const { client } = this;

    await client.query({
      text: deleteArticleSql,
      values: [params.id],
    });
  }
}
