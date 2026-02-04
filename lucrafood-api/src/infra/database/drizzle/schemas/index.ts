export * from './accounts';
export * from './ingredients';
export * from './stores';

import * as accounts from './accounts';
import * as ingredients from './ingredients';
import * as relations from './relations';
import * as stores from './stores';

export const schema = {
  ...accounts,
  ...ingredients,
  ...stores,
  ...relations,
};

export type Schema = typeof schema;
