import { Service, ServiceHandler } from '@cellularjs/net';

@Service({
  scope: 'publish',
})
export class YalaYolo implements ServiceHandler {
  async handle() {
    return {
      ola: 'olo'
    };
  }
}
