import { promises } from "fs";
import * as schema from "./app/db/schema.ts";

const versions = {
  // "v3.4": "",
  // "v3.3": "",
  // "v3.2": "",
  "v3.1": "9b28ab29b4dfe1c5394cc44e7907bf71cd9394a9",
  "v3.0": "f5c96fd8b2667184b5a9bf036a3458bdc5e30137",
  "v2.8": "2f78c770537fd2efca56264dab13a2d3ecc9721b",
  "v2.7": "30dbebb4be03a169f56b74ae774c9d0c1aca78d2",
  "v2.6": "8604965f16164d7e3a205f219c21f90c9c1731d0",
  "v2.5": "90f6ee4dc9fafc348e5335a10c24d8d6d9e657d3",
  "v2.4": "089c97d87e8d6a628aa85eb2ae0cb0a2e162255a",
  "v2.3": "d80cb2630563efa1c4ee2b3de01ea89c92370ae8",
  "v2.2": "6edaa2c36c1985158e7484d4fa9ec574224ebf81",
  "v2.1": "057763be0a4a2a8a3b729fd746a4d1bbee6cda1f",
  "v2.0": "ca905b336099ae3b67a3a0c903e08ac32fd5690f",
  "v1.4": "719ab7463a26bfa4de67c2b0cd50f6a2310a877d",
  "v1.3": "f78fac173c62061d3ab674a85eb19425cd4b3c42",
  "v1.2": "491ef96f6b28f13827464b51cf494ab08fe31d3d",
  "v1.1": "46e4cb8410aa9e18909b9afecb4821ee7dc1be37",
  "v1.0": "4bd1594354e73542371415addd81f2b80f278d3a",
};

const [Achievement, AchievementCategory, AchievementGroup, MultiText, AchievementsByVersion] =
  await Promise.all([
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
    Promise.all(
      Object.entries(versions).map(([version, hash]) =>
        fetch(
          "https://raw.githubusercontent.com/Dimbreath/WutheringData/" +
            hash +
            "/ConfigDB/Achievement.json",
        )
          .then(
            (response) =>
              response.json() as Promise<
                {
                  Id: number;
                }[]
              >,
          )
          .then(
            (Achievement) =>
              [version as (typeof schema.variants.$inferInsert)["version"], Achievement] as const,
          ),
      ),
    ),
  ]);

const VersionByAchievement = new Map<number, (typeof schema.variants.$inferInsert)["version"]>();

for (const [version, Achievements] of AchievementsByVersion) {
  for (const Achievement of Achievements) {
    VersionByAchievement.set(Achievement.Id, version);
  }
}

const descs = new Set(Achievement.map((Achievement) => Achievement.Desc));

if (descs.size !== Achievement.length) {
  throw new Error("Achievement.Description not unique");
}

const AchievementWithText = Achievement.flatMap((Achievement) => {
  const Name = MultiText[Achievement.Name];
  const Desc = MultiText[Achievement.Desc];
  return Name && Desc
    ? [
        {
          ...Achievement,
          Name,
          Desc,
        },
      ]
    : [];
});

const categories = AchievementCategory.flatMap((category) => {
  const name = MultiText[category.Name];
  return name
    ? ({
        name: name,
        id: category.Id,
      } satisfies typeof schema.categories.$inferInsert)
    : null;
});

const groups = AchievementGroup.map((group) => {
  return {
    id: group.Id,
    name: MultiText[group.Name],
    categoryId: group.Category,
  } satisfies typeof schema.groups.$inferInsert;
}).toSorted((a, b) => a.id - b.id);

const trophies = AchievementWithText.map((Achievement): typeof schema.trophies.$inferInsert => {
  return {
    id: Achievement.Id,
    subcategoryId: Achievement.GroupId,
  };
});

import VARIANTS from "./data/variants.json" with { type: "json" };

const VARIANTS_BY_ID = new Map(VARIANTS.map((VARIANT) => [VARIANT.id, VARIANT]));

const variants = AchievementWithText.values()
  .toArray()
  .map(
    (Achievement) =>
      ({
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
        notes: VARIANTS_BY_ID.get(Achievement.Id)?.notes,
        version: VersionByAchievement.get(Achievement.Id),
      }) satisfies typeof schema.variants.$inferInsert,
  )
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
