import { Service, ServiceHandler } from '@cellularjs/net';
import { Transaction, Client } from '$share/postgresql';

@Transaction()
@Service({ scope: 'publish' })
export class Create implements ServiceHandler {
  constructor(
    private client: Client,
  ) { }

  async handle() {
    const { client } = this;

    const rs = await client.query({
      text: 'INSERT INTO cms.tbl_article (title, content) VALUES ($1, $2) RETURNING id',
      values: ['hello', 'content here'],
    })

    return rs.rows[0].id;
  }
}