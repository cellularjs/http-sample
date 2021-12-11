import { Service, ServiceHandler, IRQ } from '@cellularjs/net';
import { PoolService } from '$share/postgresql';

@Service({ scope: 'publish' })
export class Detail implements ServiceHandler {
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

    return { rs: rs.rows[0] };
  }
}
