import { Module, OnInit } from '@cellularjs/di';
import { transportListener } from '@cellularjs/net';
import { Logger, LoggerModule } from '$share/logger';
import { Transporter } from './transporter.service';
import { TRACE_ID_KEY } from '$share/const';

@Module({
  imports: [LoggerModule],
  exports: [Transporter],
})
export class TransporterModule implements OnInit {
  constructor(
    private logger: Logger,
  ) { }

  onInit() {
    this.addTransportLog();
    this.logger.info('TransporterModule - initialized');
  }

  private addTransportLog() {
    const { logger } = this;

    transportListener.on('start', (ctx) => {
      const { to } = ctx.irq.header;
      const traceId = ctx.irq.header[TRACE_ID_KEY];
      ctx.startTime = process.hrtime();

      logger.info(`[${traceId}] ${to} - start`);
    });

    transportListener.on('success', (ctx) => {
      const { to } = ctx.irq.header;
      const traceId = ctx.irq.header[TRACE_ID_KEY];
      const hrend = process.hrtime(ctx.startTime);

      logger.info(`[${traceId}] ${to} - end (${hrend[0]}s ${hrend[1] / 1e6}ms)`);
    });

    transportListener.on('fail', (ctx) => {
      const { originalError } = ctx;
      const { to } = ctx.irq.header;
      const traceId = ctx.irq.header[TRACE_ID_KEY];

      const errorInfo = originalError instanceof Error
        ? originalError.stack
        : JSON.stringify(originalError);

      logger.error(`[${traceId}] ${to} - failed \n${errorInfo}`);
    });
  }
}