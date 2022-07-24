import { Injectable, Inject } from "@cellularjs/di";
import { Logger as WinstonLogger } from 'winston'

@Injectable()
export class Logger {
  constructor(
    @Inject('winston')
    private winstonLogger: WinstonLogger,
  ) { }

  info(message: string) {
    this.winstonLogger.info(message);
  };

  warn(message: string) {
    this.winstonLogger.warn(message);
  };

  error(message: string) {
    this.winstonLogger.error(message);
  };
}
