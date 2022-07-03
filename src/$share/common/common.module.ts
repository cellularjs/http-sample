import { Module, OnInit } from '@cellularjs/di';
import { LoggerModule } from '$share/logger';
import { TransporterModule } from '$share/transporter';
import { PostgresqlModule, PoolService } from '$share/postgresql';
import { threadId } from 'worker_threads'
import { EnvModule, Env, env } from '$share/env';
// import { exit } from 'process';

@Module({
  exports: [
    EnvModule.config({ token: Env }),
    LoggerModule.config(),
    TransporterModule,
    PostgresqlModule.config({
      host: env().DB_HOST,
      port: env().DB_PORT,
      database: env().DB_NAME,
      user: env().DB_USER,
      password: env().DB_PASSWORD,
    }),
  ],
})
export class CommonModule implements OnInit {
  constructor(
    private poolService: PoolService,
  ) { }

  async onInit() {
    try {
      await this.checkDbConnect();
    } catch (err) {
      console.log(`CommonModule: failed to connect to DB - ${(err as Error).message}`);
      // exit(1);
    }
  }

  private async checkDbConnect() {
    const client = await this.poolService.pool.connect();
    client.release();

    console.log(`CommonModule: connect to database successfully(Thread ID: ${threadId}).`)
  }
}