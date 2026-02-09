import { ErrorCode } from '../ErrorCode';
import { HttpError } from './HttpError';

export class NotFound extends HttpError {
  public override statusCode = 404;
  public override code = ErrorCode.NOT_FOUND;

  constructor(message = 'Not Found') {
    super(message);
  }
}

