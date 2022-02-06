import { Service, ServiceHandler } from '@cellularjs/net';

@Service({ scope: 'private' })
export class HeavyTaskCmd implements ServiceHandler {
  handle() {
    let a = 1;
    for (let i = 0; i < 1000000000; i++) {
      a +=i;
    }
  }
}
