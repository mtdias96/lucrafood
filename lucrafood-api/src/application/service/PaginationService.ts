import { InvalidPaginationError } from '@application/errors/http/InvalidPaginationError';

export class PaginationService {
  private static readonly defaults = {
    defaultPage: 1,
    defaultLimit: 20,
    maxLimit: 50,
  };

  static validate(
    input: { page?: number; limit?: number },
    options?: Partial<typeof PaginationService.defaults>,
  ): PaginationService.Result {
    const config = { ...PaginationService.defaults, ...options };

    const page = input.page ?? config.defaultPage;
    const limit = input.limit ?? config.defaultLimit;

    if (!Number.isInteger(page) || page < 1) {
      throw new InvalidPaginationError('page must be a positive integer');
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > config.maxLimit) {
      throw new InvalidPaginationError(`limit must be between 1 and ${config.maxLimit}`);
    }

    return { page, limit, offset: (page - 1) * limit };
  }
}

export namespace PaginationService {
  export type Result = {
    page: number;
    limit: number;
    offset: number;
  };
}
