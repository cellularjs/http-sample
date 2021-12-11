import { Service, ServiceHandler, IRQ } from '@cellularjs/net';
import { Transaction, Client } from '$share/postgresql';

@Transaction()
@Service({ scope: 'publish' })
export class Update implements ServiceHandler {
  constructor(
    private client: Client,
    private irq: IRQ,
  ) { }

  async handle() {
    const { client } = this;
    const { id, title, content } = this.irq.body;

    await client.query({
      text: 'UPDATE cms.tbl_article SET title = $1, content = $2 WHERE id = $3',
      values: [title, content, id],
    });

    return 'updated';
  }
}
