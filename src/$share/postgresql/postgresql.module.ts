import { Module, ExtModuleMeta } from '@cellularjs/di';
import { PoolConfig } from './key.const';
import { PoolHolder } from './pool-holder.service';
import { PoolService } from './pool.service';

@Module({
  providers: [
    { token: PoolHolder, useClass: PoolHolder, cycle: 'permanent' },
  ],
  exports: [PoolService],
})
export class PostgresqlModule {
  static config(poolConfig: PoolConfig): ExtModuleMeta {
    return {
      extModule: PostgresqlModule,
      providers: [
        { token: PoolConfig, useValue: poolConfig },
      ],
    };
  }
}