import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { alertTypeEnum } from '../enums/AlertType';
import { accounts } from './accounts';

export const alerts = pgTable('alerts', {
  id: uuid('id').primaryKey().defaultRandom(),

  accountId: uuid('account_id')
    .notNull()
    .references(() => accounts.id, { onDelete: 'cascade' }),

  type: alertTypeEnum('type').notNull(),

  message: text('message').notNull(),

  metadata: text('metadata'),

  read: boolean('read').notNull().default(false),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
