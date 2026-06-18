"use client";
import * as Ariakit from "@ariakit/react";
import { ArrowUpRightIcon } from "lucide-react";
import { type ReactNode } from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from "~/components/ui/item";
import type { groups, trophies, variants } from "~/db/schema";
import { Tag } from "./tag";

export interface TrophyVariantProps {
  defaultChecked?: boolean;
  variant: Pick<
    typeof variants.$inferSelect,
    "name" | "description" | "hidden" | "version" | "asterites" | "notes"
  >;
  trophy: Pick<typeof trophies.$inferSelect, "id">;
  subcategory: Pick<typeof groups.$inferSelect, "name">;
  children?: ReactNode;
}

export function TrophyVariant(props: TrophyVariantProps) {
  return (
    <Item render={<label></label>} variant={"outline"}>
      <ItemContent>
        <ItemTitle>{props.variant.name}</ItemTitle>
        <ItemDescription>
          <p>{props.variant.description}</p>
          {props.variant.notes ? <p># {props.variant.notes}</p> : null}
        </ItemDescription>
      </ItemContent>
      {props.children}
      <ItemFooter className="justify-start">
        {props.variant.hidden ? <Tag>Hidden</Tag> : null}
        {props.variant.asterites ? (
          <Tag>
            <img
              src="https://wuwatracker.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fastrite.8ad06fb6.webp&w=48&q=75"
              alt=""
              data-icon="inline-start"
              className="max-h-full w-auto"
            />
            {props.variant.asterites}
          </Tag>
        ) : null}
        {props.variant.version ? <Tag>{props.variant.version}</Tag> : null}
        <Tag>{props.subcategory.name}</Tag>
        <Tag
          render={
            <a
              href={`https://www.youtube.com/results?search_query=HOW+TO+GET+%E2%80%9C${props.variant.name.replaceAll(/\s+/g, "+")}%E2%80%9D+TROPHY+-+Wuthering+Waves`}
              rel="noreferrer"
              target="_blank"
            ></a>
          }
        >
          YT
          <ArrowUpRightIcon data-icon="inline-end"></ArrowUpRightIcon>
        </Tag>
      </ItemFooter>
    </Item>
  );
}

export function TrophyRadio(props: Ariakit.RadioProps) {
  return (
    <>
      <ItemActions>
        <Ariakit.CompositeItem render={<Ariakit.Radio clickOnEnter {...props} />} />
      </ItemActions>
    </>
  );
}

export function TrophyCheckbox(props: Ariakit.CheckboxProps) {
  return (
    <>
      <ItemActions>
        <Ariakit.CompositeItem render={<Ariakit.Checkbox clickOnEnter {...props} />} />
      </ItemActions>
    </>
  );
}
