// @infra/database/errors/DbError.ts
export class DbError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'DbError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DbError);
    }
  }
}
