import { threadId } from 'worker_threads';
import { Module, ExtModuleMeta, OnInit } from '@cellularjs/di';
import { PoolConfig } from './key.const';
import { PoolHolder } from './pool-holder.service';
import { PoolService } from './pool.service';
import { LoggerModule, Logger } from '$share/logger';

@Module({})
export class PostgresqlModule {
  static config(poolConfig: PoolConfig): ExtModuleMeta {
    return {
      extModule: PostgresqlModule,
      exports: [getRealPostgresqlModule(poolConfig)],
    };
  }
}

function getRealPostgresqlModule(poolConfig: PoolConfig) {
  @Module({
    providers: [
      { token: PoolConfig, useValue: poolConfig },
      { token: PoolHolder, useClass: PoolHolder, cycle: 'permanent' },
    ],
    imports: [LoggerModule],
    exports: [PoolService],
  })
  class RealPostgresqlModule implements OnInit {
    constructor(
      private logger: Logger,
      private poolService: PoolService,
    ) { }

    async onInit() {
      try {
        await this.checkDbConnect();
      } catch (err) {
        this.logger.error(`PostgresqlModule - failed to connect to DB - ${(err as Error).message}`);
        throw err;
      }
    }

    private async checkDbConnect() {
      const client = await this.poolService.pool.connect();
      client.release();
  
      this.logger.info(`PostgresqlModule: connect to database successfully(Thread ID: ${threadId}).`)
    }
  }

  return RealPostgresqlModule;
}
