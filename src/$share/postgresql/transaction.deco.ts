import { Injectable } from '@cellularjs/di';
import { ServiceHandler, addServiceProviders, addServiceProxies } from '@cellularjs/net';
import { Client } from './key.const';
import { Connector } from './connector.service';

@Injectable()
class TransactionProxy implements ServiceHandler {
  constructor(
    private client: Client,
    private handler: ServiceHandler,
  ) { }

  async handle() {
    const { client, handler } = this;

    try {
      await client.query('BEGIN');

      const irs = await handler.handle();

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

export const Transaction = () => service => {
  // Client object will be available in a single request.
  // You can inject and use it inside your service/repository.
  addServiceProviders(service, [
    {
      token: Client,
      useFunc: (connector: Connector) => connector.connect(),
      deps: [Connector],
      cycle: 'permanent',
    },
  ]);

  addServiceProxies(service, [TransactionProxy]);

  return service;
}