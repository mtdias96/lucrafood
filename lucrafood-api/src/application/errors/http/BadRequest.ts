import { ErrorCode } from '../ErrorCode';
import { HttpError } from './HttpError';

export class BadRequest extends HttpError {
  public override statusCode = 400;
  public override code = ErrorCode.BAD_REQUEST;

  constructor(message = 'Bad Request') {
    super(message);
  }
}
