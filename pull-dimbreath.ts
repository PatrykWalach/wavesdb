import { promises } from "fs";
// import data from "./app/data.json" with { type: "json" };
import csvParser from "csv-parser";
import fs from "fs";
import * as schema from "./app/db/schema.ts";

async function readCsv<Row extends {}>(filePath: string) {
  return new Promise<Row[]>((resolve, reject) => {
    const rows: Row[] = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

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

// const names = new Set(Achievement.map((Achievement) => Achievement.Name));
// if (names.size !== Achievement.length) {
//   throw new Error("Achievement.Name not unique", {
//     cause: {
//       expected: Achievement.length,
//       actual: names.size,
//     },
//   });
// }

const AchievementWithText = new Map(
  Achievement.map((Achievement) => {
    return [
      MultiText[Achievement.Desc],
      {
        ...Achievement,
        Name: MultiText[Achievement.Name],
        Desc: MultiText[Achievement.Desc],
      },
    ];
  }),
);

const csv = await readCsv<{
  Description: string;
  Notes: string;
  Version: string;
}>("app/achievements.csv");

const AchievementWithNotesAndVersion = new Map(
  csv.map((row) => {
    try {
      if (!row["Version"]) {
        throw new Error(`No version`);
      }
      return [
        AchievementWithText.get(row.Description).Id,
        {
          notes: row["Notes"] || undefined,
          version: row["Version"],
          Achievement: AchievementWithText.get(row.Description),
        },
      ];
    } catch (e) {
      throw new Error(`Failed to parse CSV`, {
        cause: {
          e,
          row,
        },
      });
    }
  }),
);

for (const [, Achievement] of AchievementWithText) {
  if (!AchievementWithNotesAndVersion.has(Achievement.Id)) {
    AchievementWithNotesAndVersion.set(Achievement.Id, {
      Achievement,
      notes: undefined,
      version: undefined,
    });
  }
}

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
}).toSorted((a, b) => a.name?.localeCompare(b.name));

const trophies = AchievementWithNotesAndVersion.keys().map(
  (id): typeof schema.trophies.$inferInsert => {
    return {
      id: id,
      subcategoryId: id,
    };
  },
);

const variants = AchievementWithNotesAndVersion.values()
  .map(({ Achievement, notes, version }): typeof schema.variants.$inferInsert => ({
    id: Achievement.Id,
    name: Achievement.Name,
    description: Achievement.Desc,
    asterites: Achievement.asterites,
    hidden: Achievement.Hidden,
    trophyId: Achievement.Id,
    notes,
    version,
  }))
  .toArray()
  .toSorted((a, b) => a.name?.localeCompare(b.name));

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
