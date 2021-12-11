import { Service, ServiceHandler } from '@cellularjs/net';
import { PoolService } from '$share/postgresql';

@Service({ scope: 'publish' })
export class List implements ServiceHandler {
  constructor(
    private poolService: PoolService,
  ) { }

  async handle() {
    const { pool } = this.poolService;

    const rs = await pool.query({
      text: 'SELECT * FROM cms.tbl_article',
    });

    return { rs: rs.rows };
  }
}
