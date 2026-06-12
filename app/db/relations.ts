import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  categories: {
    subcategories: r.many.subcategories({
      from: [r.categories.id],
      to: [r.subcategories.categoryId],
    }),
  },

  subcategories: {
    category: r.one.categories({
      from: [r.subcategories.categoryId],
      to: [r.categories.id],
      optional: false,
    }),
    trophies: r.many.trophies({
      from: [r.subcategories.id],
      to: [r.trophies.subcategoryId],
    }),
  },

  trophies: {
    subcategory: r.one.subcategories({
      from: [r.trophies.subcategoryId],
      to: [r.subcategories.id],
      optional: false,
    }),
    variants: r.one.variants({
      from: [r.trophies.id],
      to: [r.variants.trophyId],
      optional: false,
    }),
  },

  variants: {
    trophy: r.one.trophies({
      from: [r.variants.trophyId],
      to: [r.trophies.id],
      optional: false,
    }),
  },

  users: {
    earnedTrophies: r.many.earnedTrophies(),
    sessions: r.many.sessions(),
    accounts: r.many.accounts(),
  },

  earnedTrophies: {
    trophy: r.one.trophies({
      from: [r.earnedTrophies.trophyId],
      to: [r.trophies.id],
      optional: false,
    }),
    variant: r.one.variants({
      from: [r.earnedTrophies.variantId],
      to: [r.variants.id],
      optional: false,
    }),
    user: r.one.users({
      from: [r.earnedTrophies.userId],
      to: [r.users.id],
      optional: false,
    }),
  },

  sessions: {
    user: r.one.users({
      from: r.sessions.userId,
      to: r.users.id,
    }),
  },

  accounts: {
    user: r.one.users({
      from: r.accounts.userId,
      to: r.users.id,
    }),
  },
}));
