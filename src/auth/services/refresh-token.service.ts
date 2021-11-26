import { Service, ServiceHandler } from '@cellularjs/net';

@Service({
  scope: 'publish',
})
export class RefreshToken implements ServiceHandler {
  async handle() {
    return {
      rf_token: '******XXXX******'
    };
  }
}
