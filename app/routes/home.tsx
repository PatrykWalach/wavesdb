import * as Ariakit from "@ariakit/react";
import { and, countDistinct, eq, isNotNull } from "drizzle-orm";
import { SearchIcon } from "lucide-react";
import { Suspense, use } from "react";
import { Badge } from "~/components/ui/badge";
import { Field, FieldLabel } from "~/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "~/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { DB } from "~/db/middleware";
import { earnedTrophies, groups, trophies, variants } from "~/db/schema";
import { SESSION } from "~/lib/auth";
import EARNED from "../../2026-06-14_wuwatracker-achievements.json" with { type: "json" };
import type { Route } from "./+types/home";
import { FormSubmitOnChange } from "./submit-on-change";
export function meta(_: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}
export async function loader(args: Route.LoaderArgs) {
  interface Trophy extends Pick<typeof trophies.$inferSelect, "id"> {
    group: Pick<typeof groups.$inferSelect, "name">;
    variants: Pick<
      typeof variants.$inferSelect,
      "id" | "name" | "description" | "hidden" | "version" | "asterites" | "notes"
    >[];
  }
  function renderTrophy(trophy: Trophy) {
    {
      if (!isNonEmptyArray(trophy.variants)) {
        return null;
      }

      if (trophy.variants.length === 1) {
        return EARNED.includes(trophy.variants[0].id) ? null : (
          <TrophyVariant subcategory={trophy.group} variant={trophy.variants[0]} trophy={trophy}>
            <TrophyCheckbox checked={EARNED.includes(trophy.variants[0].id)} />
          </TrophyVariant>
        );
      }

      return (
        <Ariakit.CompositeGroup>
          <Ariakit.RadioProvider>
            <fieldset className="p-2 rounded border">
              <legend>Variant</legend>

              <div className="grid gap-2">
                {trophy.variants.map((variant) =>
                  EARNED.includes(variant.id) ? null : (
                    <TrophyVariant
                      trophy={trophy}
                      key={variant.id}
                      variant={variant}
                      subcategory={trophy.group}
                    >
                      <TrophyRadio checked={EARNED.includes(variant.id)} value={variant.id} />
                    </TrophyVariant>
                  ),
                )}
              </div>
            </fieldset>
          </Ariakit.RadioProvider>
        </Ariakit.CompositeGroup>
      );
    }
  }
  async function getSubcategories(args: Route.LoaderArgs) {
    const db = args.context.get(DB);
    await seed(db);
    const session = await args.context.get(SESSION);
    const userId = session?.user.id;

    return db
      .select({
        name: groups.name,
        earned: countDistinct(earnedTrophies.trophyId),
        total: countDistinct(trophies.id),
      })
      .from(groups)
      .leftJoin(trophies, eq(trophies.subcategoryId, groups.id))
      .leftJoin(
        earnedTrophies,
        and(eq(earnedTrophies.trophyId, trophies.id), eq(earnedTrophies.userId, userId ?? -1)),
      )
      .groupBy(groups.id, groups.name);
  }

  const db = args.context.get(DB);

  return {
    subcategories: getSubcategories(args),
    versions: db
      .selectDistinct({
        version: variants.version,
      })
      .from(variants)
      .where(isNotNull(variants.version)),
    trophies: db.query.trophies
      .findMany({
        with: {
          variants: true,
          group: true,
        },
      })
      .then((trophies) =>
        trophies.map((trophy) => {
          return {
            ...trophy,
            children: renderTrophy(trophy),
          };
        }),
      ),
  };
}

export function shouldRevalidate(args: ShouldRevalidateFunctionArgs) {
  if (args.formMethod === "GET") {
    return false;
  }
  return args.defaultShouldRevalidate;
}

export async function ServerComponent(props: Route.ServerComponentProps) {
  return (
    <Ariakit.CompositeProvider>
      <Ariakit.HeadingLevel>
        <Ariakit.Composite>
          <main className="p-2 grid gap-4">
            <Ariakit.Heading>Welcome to React Router</Ariakit.Heading>

            <FormSubmitOnChange className="grid grid-rows-subgrid row-span-2">
              <Filters
                subcategories={props.loaderData.subcategories}
                versions={props.loaderData.versions}
              ></Filters>

              <InputGroup>
                <InputGroupAddon>
                  <SearchIcon></SearchIcon>
                </InputGroupAddon>
                <InputGroupInput
                  name="q"
                  type="text"
                  defaultValue={props.loaderData.q}
                  placeholder="Search Achievements..."
                />
              </InputGroup>
            </FormSubmitOnChange>
            <Suspense fallback="Loading...">
              <TrophyList trophies={props.loaderData.trophies}></TrophyList>
            </Suspense>
          </main>
        </Ariakit.Composite>
      </Ariakit.HeadingLevel>
    </Ariakit.CompositeProvider>
  );
}

function GroupsSelect(props: {
  subcategories: GroupsSelectItemProps[];
  all: Pick<GroupsSelectItemProps, "earned" | "total">;
}) {
  return (
    <Field>
      <FieldLabel>Group</FieldLabel>
      <Select name="group">
        <SelectTrigger className="w-full max-w-48">
          <SelectValue fallback="Select a fruit" />
        </SelectTrigger>
        <SelectContent sameWidth={false}>
          <SelectGroup>
            <GroupsSelectItem
              name="All"
              earned={props.all.earned}
              total={props.all.total}
            ></GroupsSelectItem>
            {props.subcategories.map((subcategory) => {
              return subcategory.name ? (
                <GroupsSelectItem {...subcategory} key={subcategory.name}></GroupsSelectItem>
              ) : null;
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}

interface GroupsSelectItemProps {
  name: string;
  earned: number;
  total: number;
}

function GroupsSelectItem({ name, earned, total }: GroupsSelectItemProps) {
  return (
    <SelectItem value={name} className="justify-between">
      {name}
      <Badge>
        {earned}/{total} | {parseInt(String((earned / total) * 100))}%
      </Badge>
    </SelectItem>
  );
}

function Filters(props: {
  subcategories: Promise<
    {
      name: string;
      earned: number;
      total: number;
    }[]
  >;
  versions: Promise<
    {
      version: typeof schema.variants.$inferSelect.version;
    }[]
  >;
}) {
  const subcategories = use(props.subcategories);
  const versions = use(props.versions);

  const all = subcategories.reduce(
    (all, subcategory) => ({
      total: all.total + subcategory.total,
      earned: all.earned + subcategory.earned,
    }),
    {
      total: 0,
      earned: 0,
    },
  );

  return (
    <div className="grid">
      <GroupsSelect subcategories={subcategories} all={all}></GroupsSelect>
      {versions.length ? <VersionsSelect versions={versions}></VersionsSelect> : null}

      <div>
        {/* TODO: implement asterites counter */}
        {/* <p>
          Collected {all.earned}/{all.total} asterites
        </p> */}
        <p>
          Earned {all.earned}/{all.total} achievements
        </p>
      </div>
    </div>
  );
}

import type { ShouldRevalidateFunctionArgs } from "react-router";
import { seed } from "../../seed";
import type * as schema from "../db/schema";
import { TrophyList } from "./trophy-list";
import { TrophyCheckbox, TrophyRadio, TrophyVariant } from "./trophy-variant";

function VersionsSelect(props: {
  versions: {
    version: typeof schema.variants.$inferSelect.version;
  }[];
}) {
  return (
    <Field>
      <FieldLabel>Version</FieldLabel>
      <Select defaultValue={[]} multiple name="version">
        <SelectTrigger className="w-full max-w-48">
          <SelectValue fallback="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {props.versions.map(({ version }) => {
              return version ? (
                <SelectItem value={version} key={version}>
                  {version}
                </SelectItem>
              ) : null;
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}

function isNonEmptyArray<T>(value: readonly T[]): value is readonly [T, ...T[]] {
  return value.length !== 0;
}
