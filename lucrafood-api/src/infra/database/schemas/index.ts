export * from './accounts';

import * as accounts from './accounts';

export const schema = {
  ...accounts,
};

export type Schema = typeof schema;
