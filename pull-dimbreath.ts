import { promises } from "fs";
import * as schema from "./app/db/schema.ts";

const [Achievement, AchievementCategory, AchievementGroup, MultiText] = await Promise.all([
  fetch(
    "https://raw.githubusercontent.com/Dimbreath/WutheringData/refs/heads/master/ConfigDB/Achievement.json",
  ).then(
    (response) =>
      response.json() as Promise<
        {
          Id: number;
          GroupId: number;
          Level: number;
          Name: string;
          Desc: string;
          IconPath: string;
          OverrideDropId: number;
          Hidden: boolean;
          NextLink: number;
          ClientTrigger: boolean;
          ThirdPartyTrophyId: number;
          ExternalTrophyId: string;
          GpexternalTrophyId: string;
        }[]
      >,
  ),
  fetch(
    "https://raw.githubusercontent.com/Dimbreath/WutheringData/refs/heads/master/ConfigDB/AchievementCategory.json",
  ).then(
    (response) =>
      response.json() as Promise<
        {
          Id: number;
          Name: string;
          FunctionType: number;
          SpritePath: string;
          TexturePath: string;
        }[]
      >,
  ),
  fetch(
    "https://raw.githubusercontent.com/Dimbreath/WutheringData/refs/heads/master/ConfigDB/AchievementGroup.json",
  ).then(
    (response) =>
      response.json() as Promise<
        {
          Id: number;
          Category: number;
          Sort: number;
          Name: string;
          SmallIcon: string;
          Icon: string;
          BackgroundIcon: string;
          DropId: number;
          Enable: boolean;
        }[]
      >,
  ),
  fetch(
    "https://raw.githubusercontent.com/Dimbreath/WutheringData/refs/heads/master/TextMap/en/MultiText.json",
  ).then((response) => response.json() as Promise<Record<string, string>>),
]);

const descs = new Set(Achievement.map((Achievement) => Achievement.Desc));

if (descs.size !== Achievement.length) {
  throw new Error("Achievement.Description not unique");
}

const AchievementWithText = Achievement.map((Achievement) => {
  return {
    ...Achievement,
    Name: MultiText[Achievement.Name],
    Desc: MultiText[Achievement.Desc],
  };
});

const categories = AchievementCategory.map((category): typeof schema.categories.$inferInsert => {
  return {
    name: MultiText[category.Name],
    id: category.Id,
  };
});

const groups = AchievementGroup.map((group): typeof schema.groups.$inferInsert => {
  return {
    id: group.Id,
    name: MultiText[group.Name],
    categoryId: group.Category,
  };
}).toSorted((a, b) => a.id - b.id);

const trophies = AchievementWithText.map((Achievement): typeof schema.trophies.$inferInsert => {
  return {
    id: Achievement.Id,
    subcategoryId: Achievement.Id,
  };
});

import VARIANTS from "./data/variants.json" with { type: "json" };

const VARIANTS_BY_ID = new Map(VARIANTS.map((VARIANT) => [VARIANT.id, VARIANT]));

const variants = AchievementWithText.values()
  .toArray()
  .filter((Achievement) => Achievement.Name != null)
  .map((Achievement, i): typeof schema.variants.$inferInsert => ({
    id: Achievement.Id,
    name: Achievement.Name,
    description: Achievement.Desc,
    asterites:
      Achievement.Level === 1
        ? 5
        : Achievement.Level === 2
          ? 10
          : Achievement.Level === 3
            ? 20
            : undefined,
    hidden: Achievement.Hidden,
    trophyId: Achievement.Id,
    notes: VARIANTS_BY_ID.get(Achievement.Id).notes,
    version: VARIANTS_BY_ID.get(Achievement.Id).version,
  }))
  .toSorted((a, b) => a.id - b.id);

await Promise.all([
  promises.writeFile("data/categories.json", JSON.stringify(categories), {
    encoding: "utf-8",
  }),
  promises.writeFile("data/groups.json", JSON.stringify(groups), {
    encoding: "utf-8",
  }),
  promises.writeFile("data/trophies.json", JSON.stringify(trophies), {
    encoding: "utf-8",
  }),
  promises.writeFile("data/variants.json", JSON.stringify(variants), {
    encoding: "utf-8",
  }),
]);
