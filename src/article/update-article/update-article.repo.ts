import { Injectable } from '@cellularjs/di';
import { Client } from '$share/postgresql';
import { ArticleStatus } from '$share/type';

const updateArticleSql = `
UPDATE cms.tbl_article
SET title = $1, content = $2
WHERE id = $3
`;

interface UpdateArticleParams {
  id: string;
  title: string;
  content: string;
}

@Injectable()
export class UpdateArticleRepo {
  constructor(
    private client: Client,
  ) { }

  async exec(params: UpdateArticleParams) {
    const { client } = this;
    const { title, content, id } = params;

    await client.query({
      text: updateArticleSql,
      values: [title, content, id],
    });
  }
}

// ========================================================================= //

const getArticleSql = 'SELECT id FROM cms.tbl_article WHERE id = $1';

interface GetArticleParams {
  id: string;
}

interface GetArticleData {
  id: string;
  status: ArticleStatus;
}

@Injectable()
export class GetArticleRepo {
  constructor(
    private client: Client,
  ) { }

  async exec(params: GetArticleParams): Promise<GetArticleData> {
    const { client } = this;
    const { id } = params;

    const rs = await client.query({
      text: getArticleSql,
      values: [id],
    });

    return rs.rows[0];
  }
}