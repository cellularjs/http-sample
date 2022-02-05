import { Service, ServiceHandler, IRQ } from '@cellularjs/net';
import { PoolService } from '$share/postgresql';
import { ResourceNotFound } from '$share/message'

@Service({ scope: 'publish' })
export class DetailArticleQry implements ServiceHandler {
  constructor(
    private poolService: PoolService,
    private irq: IRQ,
  ) { }

  async handle() {
    const { pool } = this.poolService;

    const rs = await pool.query({
      text: 'SELECT * FROM cms.tbl_article WHERE id = $1',
      values: [this.irq.body.id],
    });

    const dataItem = rs.rows[0];

    if (!dataItem) {
      throw new ResourceNotFound();
    }

    return { rs: dataItem };
  }
}
