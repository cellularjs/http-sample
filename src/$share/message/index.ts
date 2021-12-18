import { IRS } from '@cellularjs/net';

type ErrorCode = string;

interface ErrorData {
  src: string;
  err: ErrorCode;
  [ext: string]: any;
}

interface BadRequestBody {
  err?: ErrorCode,
  errs?: ErrorData[]
}

export class BadRequest extends IRS {
  constructor(body: BadRequestBody) {
    super(body, { status: 400 });
  }
}

export class ResourceNotFound extends IRS {
  constructor(msg: string = undefined) {
    super({ err: 'RESOURCE_NOT_FOUND', msg }, { status: 404 });
  }
}
