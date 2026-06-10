import { Db } from "~/db/middleware";
import { categories } from "~/db/schema";
import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader(args: Route.LoaderArgs) {
  const db = args.context.get(Db);
  const [category] = await db
    .insert(categories)
    .values({
      name: "Exploration",
    })
    .returning()
    .catch((e) => [{ name: String(e) }]);
  return { category };
}

export function ServerComponent(props: Route.ServerComponentProps) {
  return (
    <main>
      <h1>Welcome to React Router</h1>
      <div>{props.loaderData.category.name}</div>
    </main>
  );
}
