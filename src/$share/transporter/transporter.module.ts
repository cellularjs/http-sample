import { Module } from '@cellularjs/di';
import { Transporter } from './transporter.service';

@Module({
  exports: [Transporter],
})
export class TransporterModule { }