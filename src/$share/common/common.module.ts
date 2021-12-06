import { Module } from '@cellularjs/di';
import { LoggerModule } from '@share/logger';
import { TransporterModule } from '@share/transporter';
import { PostgresqlModule } from '@share/postgresql';

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
export class CommonModule { }