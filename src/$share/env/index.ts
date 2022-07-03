import { env as cellularEnv } from '@cellularjs/env';

export { EnvModule } from '@cellularjs/env';

export interface Env {
  CRUD_HTTP_PORT: number;
  WORKER_HTTP_PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
}

export class Env { }

export function env() {
  return cellularEnv<Env>();
}
