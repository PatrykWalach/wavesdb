import * as Ariakit from "@ariakit/react";
import { and, countDistinct, eq, isNotNull } from "drizzle-orm";
import { SearchIcon } from "lucide-react";
import { use } from "react";
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
import { Db } from "~/db/middleware";
import { earnedTrophies, subcategories, trophies, variants } from "~/db/schema";

import type { Route } from "./+types/home";
import { FormSubmitOnChange, TrophyCheckbox, TrophyRadio, TrophyVariant } from "./trophy-variant";
export function meta(_: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}
export async function loader(args: Route.LoaderArgs) {
  const db = args.context.get(Db);

  const { searchParams } = new URL(args.request.url);
  const q = searchParams.get("q") ?? undefined;

  const userId = 1;

  return {
    q,
    subcategories: db
      .select({
        name: subcategories.name,
        earned: countDistinct(earnedTrophies.trophyId),
        total: countDistinct(trophies.id),
      })
      .from(subcategories)
      .leftJoin(trophies, eq(trophies.subcategoryId, subcategories.id))
      .leftJoin(
        earnedTrophies,
        and(eq(earnedTrophies.trophyId, trophies.id), eq(earnedTrophies.userId, userId)),
      )
      .groupBy(subcategories.id, subcategories.name),
    versions: db
      .selectDistinct({
        version: variants.version,
      })
      .from(variants)
      .where(isNotNull(variants.version)),
    trophies: db.query.trophies.findMany({
      where: {
        variants: {
          name: { like: q ? `%${q}%` : undefined },
        },
      },
      with: {
        variants: true,
        subcategory: true,
      },
    }),
  };
}

export async function ServerComponent(props: Route.ServerComponentProps) {
  const trophies = await props.loaderData.trophies;

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
            <div className="grid gap-2">
              {trophies.map((trophy) => {
                if (trophy.variants.length === 0) {
                  return null;
                }
                if (trophy.variants.length === 1) {
                  return (
                    <TrophyVariant
                      subcategory={trophy.subcategory}
                      variant={trophy.variants[0]}
                      trophy={trophy}
                      key={trophy.id}
                    >
                      <TrophyCheckbox />
                    </TrophyVariant>
                  );
                }

                return (
                  <Ariakit.CompositeGroup key={trophy.id}>
                    <Ariakit.RadioProvider>
                      <fieldset className="p-2 rounded border">
                        <legend>Variant</legend>

                        <div className="grid gap-2">
                          {trophy.variants.map((variant) => (
                            <TrophyVariant
                              trophy={trophy}
                              key={variant.id}
                              variant={variant}
                              subcategory={trophy.subcategory}
                            >
                              <TrophyRadio />
                            </TrophyVariant>
                          ))}
                        </div>
                      </fieldset>
                    </Ariakit.RadioProvider>
                  </Ariakit.CompositeGroup>
                );
              })}
            </div>
          </main>
        </Ariakit.Composite>
      </Ariakit.HeadingLevel>
    </Ariakit.CompositeProvider>
  );
}

function SubcategoriesSelect(props) {
  return (
    <Field defaultValue={[]}>
      <FieldLabel>Series</FieldLabel>
      <Select>
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent sameWidth={false}>
          <SelectGroup>
            <SubcategoriesSelectItem
              name="All"
              earned={props.all.earned}
              total={props.all.total}
            ></SubcategoriesSelectItem>
            {props.subcategories.map(({ name, earned, total }) => {
              return (
                <SubcategoriesSelectItem
                  key={name}
                  name={name}
                  earned={earned}
                  total={total}
                ></SubcategoriesSelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}

function SubcategoriesSelectItem({ name, earned, total }) {
  return (
    <SelectItem value={name} className="justify-between">
      {name}
      <Badge>
        {earned}/{total} | {parseInt((earned / total) * 100)}%
      </Badge>
    </SelectItem>
  );
}

function Filters(props) {
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
      <SubcategoriesSelect subcategories={subcategories} all={all}></SubcategoriesSelect>
      {props.versions.length ? <VersionsSelect versions={versions}></VersionsSelect> : null}

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

function VersionsSelect(props) {
  return (
    <Field defaultValue={[]}>
      <FieldLabel>Version</FieldLabel>
      <Select>
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {props.versions.map(({ version }) => {
              return (
                <SelectItem value={version} key={version}>
                  {version}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
