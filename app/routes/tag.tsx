import type { ComponentProps } from "react";
import { Badge } from "~/components/ui/badge";

export function Tag(props: ComponentProps<typeof Badge>) {
  return <Badge {...props} render={<span></span>} variant={"outline"}></Badge>;
}
