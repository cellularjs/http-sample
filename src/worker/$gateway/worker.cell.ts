import { Cell } from '@cellularjs/net';
import { TransporterModule } from '$share/transporter';
import { LoggerModule } from '$share/logger';

@Cell({
  imports: [
    LoggerModule.config(),
    TransporterModule,
  ],
  listen: '../',
})
export class WorkerCell { }
