import { IRQ } from '@cellularjs/net';
import { expressProxy, InputTransform, OutputTransform } from '@cellularjs/express-proxy';
import { v4 as uuidv4 } from 'uuid';
import { TRACE_ID_KEY } from '$share/const'
import { localTransporter } from '$share/transporter'

const inputTransform: InputTransform = (req, proxyTo) => {
  return new IRQ(
    { to: proxyTo, [TRACE_ID_KEY]: uuidv4() },
    { ...req.query, ...req.params, ...req.body },
  );
}

const outputTransform: OutputTransform = (expressCtx, cellularCtx) => {
  const { res } = expressCtx;
  const { irq, irs } = cellularCtx;

  res
    .status(irs.header?.status || 500)
    .header(TRACE_ID_KEY, irq.header.id)
    .json(irs.body);
}

export const proxyTo = expressProxy(
  { inputTransform, outputTransform },
  localTransporter,
);
