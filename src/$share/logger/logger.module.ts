import { Module, ExtModuleMeta } from '@cellularjs/di';
import { transportEmitter } from '@cellularjs/net'

@Module({
  providers: [],
})
export class LoggerModule {
  static config(): ExtModuleMeta {
    this.addTransportLog();

    return {
      extModule: LoggerModule,
    }
  }

  private static addTransportLog() {
    transportEmitter.on('start', (ctx) => {
      const { id, to } = ctx.irq.header;
      ctx.startTime = process.hrtime();

      console.log(`${id} ${new Date().toISOString()} INFO - Start request to "${to}"`);
    });

    transportEmitter.on('success', (ctx) => {
      const { id, to } = ctx.irq.header;
      const hrend = process.hrtime(ctx.startTime);

      console.log(`${id} ${new Date().toISOString()} INFO - End request to "${to}" (${hrend[0]}s ${hrend[1] / 1e6}ms)`);
    });

    transportEmitter.on('fail', (ctx) => {
      const { originalError } = ctx;
      const { id, to } = ctx.irq.header;

      const errorInfo = originalError instanceof Error
        ? originalError.stack
        : JSON.stringify(originalError);

      console.log(`${id} ${new Date().toISOString()} ERROR - Failed to handle request to "${to}"\n${errorInfo}`);
    });
  }
}
