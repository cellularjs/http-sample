import { Service, ServiceHandler, IRQ } from '@cellularjs/net';
import { Transporter } from '@share/transporter'

@Service({
  scope: 'publish',
})
export class Me implements ServiceHandler {
  constructor(
    private transporter: Transporter,
  ) { }

  async handle() {
    const irq = new IRQ({ to: 'Auth:Dummy' });
    const irs = await this.transporter.send(irq);

    return {
      name: 'Great Elephant',
      avatar: '🐘',
      data: irs.body,
    };
  }
}
