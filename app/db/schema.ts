import { int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

const sharedFields = {
  id: int().primaryKey({ autoIncrement: true }),
};

// 4 main categories: Exploration/Journey/Battles/Voice
export const categories = sqliteTable("categories", {
  ...sharedFields,
  name: text().notNull().unique(),
});

// e.g. Exploration: Huanglong, Footprints in Huanglong I, Footprints in Huanglong II
export const subcategories = sqliteTable("subcategories", {
  ...sharedFields,
  name: text().notNull().unique(),
  categoryId: int()
    .notNull()
    .references(() => categories.id),
});

// exclusive trophies e.g. Do A or B
export const trophies = sqliteTable("trophies", {
  ...sharedFields,
  subcategoryId: int()
    .notNull()
    .references(() => subcategories.id),
});

export const variants = sqliteTable("variants", {
  ...sharedFields,
  name: text().notNull().unique(),
  description: text().notNull(),
  trophyId: int()
    .notNull()
    .references(() => trophies.id),
  // game version: v1.0, v1.1, v1.2, etc.
  version: int().notNull(),
});

export const users = sqliteTable("users", {
  ...sharedFields,
});

export const earnedTrophies = sqliteTable(
  "earned_trophies",
  {
    trophyId: int()
      .notNull()
      .references(() => trophies.id),
    variantId: int()
      .notNull()
      .references(() => variants.id),
    userId: int()
      .notNull()
      .references(() => users.id),
  },
  (table) => [unique().on(table.trophyId, table.userId)],
);
