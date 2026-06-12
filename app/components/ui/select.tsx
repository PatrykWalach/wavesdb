import * as Ariakit from "@ariakit/react";

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "~/lib/utils";

function Select({ ...props }: Ariakit.SelectProviderProps) {
  return (
    <div data-slot="select">
      <Ariakit.SelectProvider {...props} />
    </div>
  );
}

function SelectGroup({ className, ...props }: Ariakit.SelectGroupProps) {
  return (
    <Ariakit.SelectGroup
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  );
}

function SelectValue({ ...props }: Ariakit.SelectValueProps) {
  return <Ariakit.SelectValue data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: Ariakit.SelectProps & {
  size?: "sm" | "default";
}) {
  return (
    <Ariakit.Select
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <Ariakit.SelectArrow>
        <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
      </Ariakit.SelectArrow>
    </Ariakit.Select>
  );
}

function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  ...props
}: Ariakit.SelectPopoverProps) {
  return (
    <Ariakit.SelectPopover
      sameWidth
      data-slot="select-content"
      data-align-trigger={position === "item-aligned"}
      className={cn(
        "relative z-50 max-h-[min(var(--popover-available-height,300px),300px)] min-w-36 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
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

function SelectLabel({ className, ...props }: Ariakit.SelectLabelProps) {
  return (
    <Ariakit.SelectGroupLabel
      data-slot="select-label"
      className={cn("px-1.5 py-1 text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

function SelectItem({ className, children, ...props }: Ariakit.SelectItemProps) {
  return (
    <Ariakit.SelectItem
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent data-[active-item='true']:bg-accent hover:bg-accent focus:text-accent-foreground hover:text-accent-foreground  data-[active-item='true']:text-accent-foreground not-data-[variant=destructive]:hover:**:text-accent-foreground not-data-[variant=destructive]:data-[active-item='true']:**:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <Ariakit.SelectItemCheck>
          <CheckIcon className="pointer-events-none" />
        </Ariakit.SelectItemCheck>
      </span>
      {children}
    </Ariakit.SelectItem>
  );
}

function SelectSeparator({ className, ...props }: Ariakit.SelectSeparatorProps) {
  return (
    <Ariakit.SelectSeparator
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
