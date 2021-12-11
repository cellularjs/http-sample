import { Injectable } from '@cellularjs/di'
import { Pool } from 'pg';
import { PoolConfig } from './key.const'

@Injectable()
export class PoolHolder {
  public readonly originalPool: Pool;

  constructor(poolConfig: PoolConfig) {
    this.originalPool = new Pool(poolConfig);
  }
};

