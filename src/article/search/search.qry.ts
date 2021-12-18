import { Service, ServiceHandler, IRQ } from '@cellularjs/net';
import { PoolService } from '$share/postgresql';

const searchQl = `
SELECT *
FROM cms.tbl_article
WHERE
  title LIKE $1 OR
  content LIKE $1
`;

@Service({ scope: 'publish' })
export class SearchQry implements ServiceHandler {
  constructor(
    private poolService: PoolService,
    private irq: IRQ,
  ) { }

  async handle() {
    const { irq } = this;
    const { pool } = this.poolService;

    const rs = await pool.query({
      text: searchQl,
      values: [`%${irq.body.q || ''}%`]
    });

    return { rs: rs.rows };
  }
}
