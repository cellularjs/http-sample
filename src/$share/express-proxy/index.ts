import { IRQ } from '@cellularjs/net';
import { expressProxy, InputTransform, OutputTransform } from '@cellularjs/express-proxy';
import { localTransporter } from '$share/transporter'
import { TRACE_ID_KEY } from '$share/const';
import * as short from 'short-uuid';
import { getLogger } from '$share/logger';

const translator = short();

const inputTransform: InputTransform = (req, proxyTo) => {
  const tracdeId = translator.new();
  const logger = getLogger();

  logger.info(`[${tracdeId}] HTTP - ${req.method} ${req.originalUrl}`);

  return new IRQ(
    { to: proxyTo, [TRACE_ID_KEY]: tracdeId },
    { ...req.query, ...req.params, ...req.body },
  );
}

const outputTransform: OutputTransform = (expressCtx, cellularCtx) => {
  const { res } = expressCtx;
  const { irq, irs } = cellularCtx;

  res
    .status(irs.header?.status || 500)
    .header(TRACE_ID_KEY, irq.header[TRACE_ID_KEY])
    .json(irs.body);
}

export const proxyTo = expressProxy(
  { inputTransform, outputTransform },
  localTransporter,
);
