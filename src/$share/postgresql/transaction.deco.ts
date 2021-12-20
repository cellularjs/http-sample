import { Injectable } from '@cellularjs/di';
import { ServiceHandler, addServiceProviders, addServiceProxies, NextHandler } from '@cellularjs/net';
import { Client } from './key.const';
import { PoolService } from './pool.service';

@Injectable()
class TransactionProxy implements ServiceHandler {
  constructor(
    private client: Client,
    private nextHandler: NextHandler,
  ) { }

  async handle() {
    const { client, nextHandler } = this;

    try {
      await client.query('BEGIN');

      const irs = await nextHandler.handle();

      await client.query('COMMIT');

      return irs;
    } catch (error) {
      await client.query('ROLLBACK');

      throw error;
    } finally {
      client.release();
    }
  }
}

/**
 * TODO: support something like isolation level, ...
 */
export const Transaction = () => service => {
  // Client object will be available in a single request.
  // You can inject and use it inside your service/repository.
  addServiceProviders(service, [
    {
      token: Client,
      useFunc: (poolService: PoolService) => poolService.pool.connect(),
      deps: [PoolService],
      cycle: 'permanent',
    },
  ]);

  addServiceProxies(service, [TransactionProxy]);

  return service;
}
