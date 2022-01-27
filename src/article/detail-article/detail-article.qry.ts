import { Service, ServiceHandler, IRQ } from '@cellularjs/net';
import { PoolService } from '$share/postgresql';
import { ResourceNotFound } from '$share/message';
import { Transporter } from '$share/transporter';

@Service({ scope: 'publish' })
export class DetailArticleQry implements ServiceHandler {
  constructor(
    private poolService: PoolService,
    private irq: IRQ,
    private transporter: Transporter,
  ) { }

  async handle() {
    const { sendViaWorker } = this.transporter;
    const { pool } = this.poolService;

    const rs = await pool.query({
      text: 'SELECT * FROM cms.tbl_article WHERE id = $1',
      values: [this.irq.body.id],
    });

    const dataItem = rs.rows[0];
    const heavyTask = new IRQ({ to: 'Article:HeavyTaskCmd'});

    await Promise.all([
      sendViaWorker(heavyTask),
      sendViaWorker(heavyTask),
      sendViaWorker(heavyTask),
      sendViaWorker(heavyTask),
      sendViaWorker(heavyTask),
      sendViaWorker(heavyTask),
      sendViaWorker(heavyTask),
      sendViaWorker(heavyTask),
      sendViaWorker(heavyTask),
      sendViaWorker(heavyTask),
      sendViaWorker(heavyTask),
      sendViaWorker(heavyTask),
      sendViaWorker(heavyTask),
      sendViaWorker(heavyTask),
      sendViaWorker(heavyTask),
      sendViaWorker(heavyTask),
      sendViaWorker(heavyTask),
      sendViaWorker(heavyTask),
      sendViaWorker(heavyTask),
      sendViaWorker(heavyTask),
      sendViaWorker(heavyTask),
      sendViaWorker(heavyTask),
      sendViaWorker(heavyTask),
      sendViaWorker(heavyTask),
      sendViaWorker(heavyTask),
      sendViaWorker(heavyTask),
      sendViaWorker(heavyTask),
      sendViaWorker(heavyTask),
    ]);

    if (!dataItem) {
      throw new ResourceNotFound();
    }

    return { rs: dataItem };
  }
}
