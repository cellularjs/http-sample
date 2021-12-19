import { Transporter } from './transporter.service';

export { TransporterModule } from './transporter.module';
export { Transporter } from './transporter.service';
export const localTransporter = new Transporter();