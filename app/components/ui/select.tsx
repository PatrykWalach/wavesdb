import * as Ariakit from "@ariakit/react";

import { useSyncExternalStore, type ComponentProps } from "react";
import { cn } from "~/lib/utils";

function Select({ className, ...props }: ComponentProps<"select">) {
  return (
    <select
      {...props}
      className={cn(
        "[appearance:base-select] field-sizing-content flex w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",

        "picker:[appearance:base-select] picker:relative picker:z-50 picker:max-h-75 picker:min-w-36 picker:overflow-x-hidden picker:overflow-y-auto picker:rounded-lg picker:bg-popover picker:text-popover-foreground picker:shadow-md picker:ring-1 picker:ring-foreground/10 picker:duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 open:picker:animate-in open:picker:fade-in-0 open:picker:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        // position === "popper" &&
        //   "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className,
      )}
      data-slot="select"
    ></select>
  );
}

// moved React/JSX ambient declarations to `app/types/react-selectedcontent.d.ts`

function SelectGroup({ className, ...props }: ComponentProps<"optgroup">) {
  return (
    <optgroup data-slot="select-group" className={cn("scroll-my-1 p-1", className)} {...props} />
  );
}

import * as React from "react";
import { ClientOnly } from "../client-only";

declare global {
  interface HTMLSelectedContentElement extends HTMLElement {}
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      selectedcontent: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLSelectedContentElement>,
        HTMLSelectedContentElement
      >;
    }
  }
}

function SelectValue({ ...props }: ComponentProps<"selectedcontent">) {
  return (
    <ClientOnly>
      <selectedcontent data-slot="select-value" {...props} />
    </ClientOnly>
  );
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: ComponentProps<"button"> & {
  size?: "sm" | "default";
}) {
  return (
    <button
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        // "flex w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      {/* <Ariakit.SelectArrow>
        <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
      </Ariakit.SelectArrow> */}
    </button>
  );
}

function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  ...props
}: Ariakit.SelectPopoverProps) {
  return children;
  return (
    <Ariakit.SelectPopover
      sameWidth
      data-slot="select-content"
      data-align-trigger={position === "item-aligned"}
      className={cn(
        // "relative z-50 max-h-[min(var(--popover-available-height,300px),300px)] min-w-36 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        // position === "popper" &&
        //   "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className,
      )}
      position={position}
      align={align}
      {...props}
    >
      {children}
    </Ariakit.SelectPopover>
  );
}

function SelectLabel({ className, ...props }: ComponentProps<"legend">) {
  return (
    <legend
      data-slot="select-label"
      className={cn("px-1.5 py-1 text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

function SelectItem({ className, children, ...props }: ComponentProps<"option">) {
  return (
    <option
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-1.5 pl-1.5 text-sm outline-hidden select-none focus:bg-accent data-[active-item='true']:bg-accent hover:bg-accent focus:text-accent-foreground hover:text-accent-foreground  data-[active-item='true']:text-accent-foreground not-data-[variant=destructive]:hover:**:text-accent-foreground not-data-[variant=destructive]:data-[active-item='true']:**:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        "checkmark:order-1 checkmark:ml-auto",
        className,
      )}
      {...props}
    >
      {/* <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <Ariakit.SelectItemCheck>
          <CheckIcon className="pointer-events-none" />
        </Ariakit.SelectItemCheck>
      </span> */}
      {children}
    </option>
  );
}

function SelectSeparator({ className, ...props }: ComponentProps<"hr">) {
  return (
    <hr
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
