"use client";

import * as Ariakit from "@ariakit/react";
import { Fragment, use, type ReactNode } from "react";
import { useLocation, useNavigation } from "react-router";
import type { groups, trophies, variants } from "~/db/schema";
import EARNED from "../../2026-06-14_wuwatracker-achievements.json" with { type: "json" };
import { TrophyCheckbox, TrophyRadio, TrophyVariant } from "./trophy-variant";

interface Trophy extends Pick<typeof trophies.$inferSelect, "id"> {
  group: Pick<typeof groups.$inferSelect, "name">;
  variants: Pick<
    typeof variants.$inferSelect,
    "id" | "name" | "description" | "hidden" | "version" | "asterites" | "notes"
  >[];
  children: ReactNode;
}

function useFilterTrophies(trophies: Trophy[]) {
  const location = useLocation();
  const navigation = useNavigation();
  const { search } = navigation.location ?? location;
  const searchParams = new URLSearchParams(search);
  const group = searchParams.get("group");
  const version = searchParams.getAll("version");
  const q = searchParams.get("q");

  return trophies.filter(
    (trophy) =>
      (q || version.length
        ? trophy.variants.some(
            (variant) =>
              (q
                ? variant.name.toLocaleLowerCase().includes(q.toLocaleLowerCase()) ||
                  variant.description.toLocaleLowerCase().includes(q.toLocaleLowerCase()) ||
                  variant.notes?.toLocaleLowerCase().includes(q.toLocaleLowerCase())
                : false) ||
              (version.length ? variant.version && version.includes(variant.version) : false),
          )
        : true) && (group && group !== "All" ? trophy.group.name === group : true),
  );
}

export function TrophyList(props: { trophies: Promise<Trophy[]> }) {
  const trophies = useFilterTrophies(use(props.trophies));

  return (
    <div className="grid gap-2">
      {trophies.map((trophy) => {
        return <Fragment key={trophy.id}>{trophy.children}</Fragment>;
      })}
    </div>
  );
}
