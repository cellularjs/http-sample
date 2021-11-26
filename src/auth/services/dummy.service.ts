import { Service, ServiceHandler } from '@cellularjs/net';

@Service({
  scope: 'publish',
})
export class Dummy implements ServiceHandler {
  handle() {
    return {
      name: 'Great Elephant',
      avatar: '🐘',
    };
  }
}
