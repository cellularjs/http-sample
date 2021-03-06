import { Service, ServiceHandler, IRQ } from '@cellularjs/net';
import { Transporter } from '$share/transporter';

@Service({ scope: 'publish' })
export class TestQry implements ServiceHandler {
  constructor(
    private transporter: Transporter,
  ) { }

  async handle() {
    const { sendViaWorker } = this.transporter;
    const heavyTask = new IRQ({ to: 'Worker:HeavyTaskCmd'});

    await Promise.all([
      sendViaWorker(heavyTask), sendViaWorker(heavyTask), sendViaWorker(heavyTask),
      sendViaWorker(heavyTask), sendViaWorker(heavyTask), sendViaWorker(heavyTask),
      sendViaWorker(heavyTask), sendViaWorker(heavyTask), sendViaWorker(heavyTask),
      sendViaWorker(heavyTask), sendViaWorker(heavyTask), sendViaWorker(heavyTask),
      sendViaWorker(heavyTask), sendViaWorker(heavyTask), sendViaWorker(heavyTask),
      sendViaWorker(heavyTask), sendViaWorker(heavyTask), sendViaWorker(heavyTask),
      sendViaWorker(heavyTask), sendViaWorker(heavyTask), sendViaWorker(heavyTask),
      sendViaWorker(heavyTask), sendViaWorker(heavyTask), sendViaWorker(heavyTask),
      sendViaWorker(heavyTask), sendViaWorker(heavyTask), sendViaWorker(heavyTask),
      sendViaWorker(heavyTask), sendViaWorker(heavyTask), sendViaWorker(heavyTask),
    ]);

    return 'You can open `src\worker\test\test.qry.ts` and change `sendViaWorker` with `send` to see the different between two';
  }
}
