import { Cell } from '@cellularjs/net';
import { TransporterModule } from '$share/transporter';
import { EnvModule, Env } from '$share/env';

@Cell({
  imports: [
    EnvModule.config({ token: Env }),
    TransporterModule,
  ],
  listen: '../',
})
export class WorkerCell { }
