import { Module } from '@cellularjs/di';
import { LoggerModule } from '@share/logger';
import { TransporterModule } from '@share/transporter';

@Module({
  exports: [
    LoggerModule.config(),
    TransporterModule,
  ],
})
export class CommonModule { }