import { int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

const sharedFields = {
  id: int().primaryKey({ autoIncrement: true }),
};

// 4 main categories: Exploration/Journey/Battles/Voice
export const categories = sqliteTable("categories", {
  ...sharedFields,
  name: text({
    enum: ["Exploration", "Journey", "Battles", "Voice"],
  })
    .notNull()
    .unique(),
});

// e.g. Exploration: Huanglong, Footprints in Huanglong I, Footprints in Huanglong II
export const subcategories = sqliteTable("subcategories", {
  ...sharedFields,
  name: text().notNull().unique(),
  categoryId: int()
    //  TODO: temporary nullable, sort into categories
    //  .notNull()
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
  name: text().notNull(),
  description: text().notNull(),
  hidden: int({ mode: "boolean" }).notNull(),
  asterites: int().notNull(),
  trophyId: int()
    .notNull()
    .references(() => trophies.id),
  notes: text(),
  obteinable: int({ mode: "boolean" }).default(true),
  // game version: v1.0, v1.1, v1.2, etc.
  version: text({
    enum: [
      "v1.0",
      "v1.1",
      "v1.2",
      "v1.3",
      "v1.4",
      "v2.0",
      "v2.1",
      "v2.2",
      "v2.3",
      "v2.4",
      "v2.5",
      "v2.6",
      "v2.7",
      "v2.8",
      "v3.0",
      "v3.1",
      "v3.2",
      "v3.3",
      "v3.4",
    ],
  }),
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
