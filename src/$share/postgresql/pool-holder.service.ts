import { Injectable } from '@cellularjs/di'
import { Pool } from 'pg';
import { PoolConfig } from './key.const'

@Injectable()
export class PoolHolder {
  public readonly pgPool: Pool;

  constructor(poolConfig: PoolConfig) {
    this.pgPool = new Pool(poolConfig);
  }
};

