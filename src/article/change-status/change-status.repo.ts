import { Injectable } from '@cellularjs/di';
import { Client } from '$share/postgresql';
import { ArticleStatus } from '$share/type';

const changeStatusArticleSql = `
UPDATE cms.tbl_article
SET status = $1
WHERE id = $2
`;

interface ChangeStatusArticleParams {
  id: string;
  status: ArticleStatus;
}

@Injectable()
export class ChangeStatusArticleRepo {
  constructor(
    private client: Client,
  ) { }

  async exec(params: ChangeStatusArticleParams) {
    const { client } = this;

    await client.query({
      text: changeStatusArticleSql,
      values: [params.status, params.id],
    });
  }
}