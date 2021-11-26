import { Service, ServiceHandler } from '@cellularjs/net';

@Service({
  scope: 'publish',
})
export class Yolo implements ServiceHandler {
  async handle() {
    return {
      yolo: 'yolo 123'
    };
  }
}
