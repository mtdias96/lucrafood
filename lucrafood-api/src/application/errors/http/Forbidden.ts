import { ErrorCode } from '../ErrorCode';
import { HttpError } from './HttpError';

export class Forbidden extends HttpError {
  public override statusCode = 403;
  public override code = ErrorCode.FORBIDDEN;

  constructor(message = 'Forbidden') {
    super(message);
  }
}

