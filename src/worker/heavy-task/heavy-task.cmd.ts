import { Service, ServiceHandler } from '@cellularjs/net';

@Service({ scope: 'private' })
export class HeavyTaskCmd implements ServiceHandler {
  handle() {
    let a = 1;
    for (let i = 0; i < 100000000; i++) {
      a +=i;
    }
  }
}
