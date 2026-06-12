"use client";
import * as Ariakit from "@ariakit/react";
import { ArrowUpRightIcon } from "lucide-react";
import { createContext, use, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { Form, useSubmit } from "react-router";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from "~/components/ui/item";
import type { subcategories, trophies, variants } from "~/db/schema";
import { Tag } from "./tag";

const Context = createContext<{
  props: TrophyVariantProps;
  setFocusVisible: (focusVisible: boolean) => void;
  setChecked: (checked: boolean) => void;
}>();

export interface TrophyVariantProps {
  defaultChecked?: boolean;
  variant: Pick<
    typeof variants.$inferSelect,
    "name" | "description" | "hidden" | "version" | "asterites"
  >;
  trophy: Pick<typeof trophies.$inferSelect, "id">;
  subcategory: Pick<typeof subcategories.$inferSelect, "name">;
  children?: ReactNode;
}

export function TrophyVariant(props: TrophyVariantProps) {
  const [checked, setChecked] = useState(props.defaultChecked ?? false);
  const [focusVisible, setFocusVisible] = useState(false);

  return (
    <Item
      render={<label></label>}
      variant={"outline"}
      data-checked={checked}
      data-focus-visible={focusVisible || undefined}
    >
      <ItemContent>
        <ItemTitle>{props.variant.name}</ItemTitle>
        <ItemDescription>{props.variant.description}</ItemDescription>
      </ItemContent>
      <Context
        value={{
          setFocusVisible,
          setChecked,
          props,
          checked,
        }}
      >
        {props.children}
      </Context>
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

export function TrophyRadio() {
  const { setFocusVisible, setChecked, props } = use(Context);

  return (
    <>
      <ItemActions>
        <Ariakit.CompositeItem
          render={
            <Ariakit.Radio
              ref={props.ref}
              value={props.variant.id}
              clickOnEnter
              onFocusVisible={() => setFocusVisible(true)}
              onBlur={() => setFocusVisible(false)}
              onChange={(event) => {
                setChecked(event.target.checked);
                props.onChange?.(event);
              }}
            />
          }
        />
      </ItemActions>
    </>
  );
}

export function TrophyCheckbox() {
  const { setFocusVisible, setChecked, props } = use(Context);

  return (
    <>
      <ItemActions>
        <Ariakit.CompositeItem
          render={
            <Ariakit.Checkbox
              ref={props.ref}
              clickOnEnter
              onFocusVisible={() => setFocusVisible(true)}
              onBlur={() => setFocusVisible(false)}
              onChange={(event) => {
                setChecked(event.target.checked);
                props.onChange?.(event);
              }}
            />
          }
        />
      </ItemActions>
    </>
  );
}
export function FormSubmitOnChange(props: ComponentProps<typeof Form>) {
  const submit = useSubmit();
  const replace = useRef(false);

  return (
    <Form
      {...props}
      onChange={(e) => {
        submit(e.currentTarget, { replace: replace.current });
        replace.current = true;
      }}
    ></Form>
  );
}
