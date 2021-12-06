import { Module, ExtModuleMeta } from '@cellularjs/di';
import { Connector } from './connector.service';
import { PoolConfig } from './key.const'
import { PoolHolder } from './pool-holder.service'

@Module({
  providers: [
    { token: PoolHolder, useClass: PoolHolder, cycle: 'permanent' },
  ],
  exports: [Connector],
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