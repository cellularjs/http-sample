import { Module, ExtModuleMeta, OnInit } from '@cellularjs/di';
import { transportListener } from '@cellularjs/net'
import { threadId } from 'worker_threads';

@Module({
  providers: [
    // ...
  ],
})
export class LoggerModule implements OnInit {
  static config(): ExtModuleMeta {
    return {
      extModule: LoggerModule,
      // ...
    }
  }

  onInit() {
    this.addTransportLog();
  }

  private addTransportLog() {
    transportListener.on('start', (ctx) => {
      const { id, to } = ctx.irq.header;
      ctx.startTime = process.hrtime();

      console.log(`(Thread ID: ${threadId}) ${id} ${new Date().toISOString()} INFO - Start request to "${to}"`);
    });

    transportListener.on('success', (ctx) => {
      const { id, to } = ctx.irq.header;
      const hrend = process.hrtime(ctx.startTime);

      console.log(`(Thread ID: ${threadId}) ${id} ${new Date().toISOString()} INFO - End request to "${to}" (${hrend[0]}s ${hrend[1] / 1e6}ms)`);
    });

    transportListener.on('fail', (ctx) => {
      const { originalError } = ctx;
      const { id, to } = ctx.irq.header;

      const errorInfo = originalError instanceof Error
        ? originalError.stack
        : JSON.stringify(originalError);

      console.log(`(Thread ID: ${threadId}) ${id} ${new Date().toISOString()} ERROR - Failed to handle request to "${to}"\n${errorInfo}`);
    });
  }
}
