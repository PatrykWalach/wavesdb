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
    variants: r.many.variants(),
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
}));
