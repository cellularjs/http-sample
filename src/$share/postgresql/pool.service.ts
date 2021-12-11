import { Injectable } from '@cellularjs/di';
import { PoolHolder } from './pool-holder.service'

@Injectable()
export class PoolService {
  public get pool() {
    return this.poolHolder.originalPool;
  }

  constructor(
    private poolHolder: PoolHolder,
  ) { }
}
