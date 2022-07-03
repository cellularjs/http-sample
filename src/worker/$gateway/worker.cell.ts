import { Cell } from '@cellularjs/net';
import { TransporterModule } from '$share/transporter';
import { LoggerModule } from '$share/logger';
import { EnvModule, Env } from '$share/env';

@Cell({
  imports: [
    EnvModule.config({ token: Env }),
    LoggerModule.config(),
    TransporterModule,
  ],
  listen: '../',
})
export class WorkerCell { }
