import { Service, ServiceHandler, IRQ } from '@cellularjs/net';
import { Transaction, Client } from '$share/postgresql';

@Transaction()
@Service({ scope: 'publish' })
export class Delete implements ServiceHandler {
  constructor(
    private client: Client,
    private irq: IRQ,
  ) { }

  async handle() {
    const { client } = this;
    const { id } = this.irq.body;

    await client.query({
      text: 'DELETE FROM cms.tbl_article WHERE id = $1',
      values: [id],
    });

    return 'deleted';
  }
}
