import { Injectable } from '@cellularjs/di'
import { PoolHolder } from './pool-holder.service'

@Injectable()
export class Connector {
  constructor(
    private poolHolder: PoolHolder,
  ) { }

  connect() {
    return this.poolHolder.originalPool.connect();
  }
};

