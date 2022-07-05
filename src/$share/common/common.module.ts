import { Module } from '@cellularjs/di';
import { LoggerModule } from '$share/logger';
import { TransporterModule } from '$share/transporter';
import { PostgresqlModule } from '$share/postgresql';
import { EnvModule, Env, env } from '$share/env';

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
export class CommonModule { }