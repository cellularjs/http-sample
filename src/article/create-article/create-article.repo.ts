import { Injectable } from '@cellularjs/di';
import { Client } from '$share/postgresql';

const createArticleSql = `
  INSERT INTO cms.tbl_article (title, content)
  VALUES ($1, $2)
  RETURNING id
`;

interface CreateArticleParams {
  title: string;
  content: string;
}

@Injectable()
export class CreateArticleRepo {
  constructor(
    private client: Client,
  ) { }

  async exec(params: CreateArticleParams): Promise<string> {
    const { client } = this;

    const rs = await client.query({
      text: createArticleSql,
      values: [params.title, params.content],
    });

    return rs.rows[0].id;
  }
}
