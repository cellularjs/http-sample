import { Module, OnInit } from '@cellularjs/di';
import { LoggerModule } from '$share/logger';
import { TransporterModule } from '$share/transporter';
import { PostgresqlModule, PoolService } from '$share/postgresql';
import { threadId } from 'worker_threads'

@Module({
  exports: [
    LoggerModule.config(),
    TransporterModule,
    PostgresqlModule.config({
      host: 'localhost',
      port: 5432,
      database: 'cellularjs_blog',
      user: 'postgres',
      password: '123456',
    }),
  ],
})
export class CommonModule implements OnInit {
  constructor(
    private poolService: PoolService,
  ) { }

  async onInit() {
    await this.checkDbConnect();
  }

  private async checkDbConnect() {
    const client = await this.poolService.pool.connect();
    client.release();

    console.log(`CommonModule: connect to database successfully(Thread ID: ${threadId}).`)
  }
}