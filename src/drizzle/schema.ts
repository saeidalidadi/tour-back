import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { TourStatus } from '../enums';

export const tourStatus = Object.entries(TourStatus).map((it) => it[1]) as any;

export const tourStatusEnum = pgEnum('status', ['name', 'something']);

export const tours = pgTable('tours', {
  id: serial('id').primaryKey(),
  tourName: varchar('tour_name').notNull(),
  tourDescription: text('tour_description').notNull(),
  status: varchar('status', tourStatus),
  price: integer('price').notNull(),
  startDate: timestamp('start_date', { mode: 'date', precision: 3 }),
  finishDate: timestamp('finish_date', { mode: 'date', precision: 3 }),
  //   status: tourStatusEnum,
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(
    () => new Date(),
  ),
});

export const toursTags = pgTable(
  'tours_tags',
  {
    toursId: integer('toursId')
      .notNull()
      .references(() => tours.id),
    tagsId: integer('tagsId')
      .notNull()
      .references(() => tags.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.toursId, table.tagsId] }),
  }),
);

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
});
