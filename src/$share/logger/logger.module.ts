import { Module, OnInit } from '@cellularjs/di';
import { winstonLogger } from './winston-logger';
import { Logger } from './logger.class';

let logger: Logger;

export function getLogger() {
  return logger;
}

@Module({
  providers: [
    { token: Logger, useClass: Logger, cycle: 'permanent' },
    { token: 'winston', useValue: winstonLogger },
  ],
  exports: [Logger],
})
export class LoggerModule implements OnInit {
  constructor(
    private logger: Logger,
  ) { }

  onInit() {
    logger = this.logger;
    this.logger.info('LoggerModule - initialized');
  }
}
