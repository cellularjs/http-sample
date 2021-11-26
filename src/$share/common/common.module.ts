import { Module } from '@cellularjs/di';
import { TransporterModule } from '@share/transporter';

@Module({
  exports: [TransporterModule],
})
export class CommonModule { }