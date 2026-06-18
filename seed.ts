import { categories, groups, trophies, variants } from "~/db/schema";

import type { Db } from "~/db/middleware";
import CATEGORIES from "./data/categories.json" with { type: "json" };
import GROUPS from "./data/groups.json" with { type: "json" };
import TROPHIES from "./data/trophies.json" with { type: "json" };
import VARIANTS from "./data/variants.json" with { type: "json" };

export async function seed(db: Db) {
  for (const CATEGORY of CATEGORIES) {
    await db.insert(categories).values(CATEGORY).onConflictDoUpdate({
      set: CATEGORY,
      target: categories.id,
    });
  }
  for (const GROUP of GROUPS) {
    await db.insert(groups).values(GROUP).onConflictDoUpdate({
      set: GROUP,
      target: groups.id,
    });
  }
  for (const TROPHY of TROPHIES) {
    await db.insert(trophies).values(TROPHY).onConflictDoUpdate({
      set: TROPHY,
      target: trophies.id,
    });
  }

  for (const VARIANT of VARIANTS) {
    await db.insert(variants).values(VARIANT).onConflictDoUpdate({
      set: VARIANT,
      target: variants.id,
    });
  }
}
