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
  await db
    .insert(categories)
    .values({
      name: "Exploration",
    })
    .onConflictDoNothing();

  return { categories: db.select().from(categories).all() };
}

export async function ServerComponent(props: Route.ServerComponentProps) {
  const [category] = await props.loaderData.categories;
  return (
    <main>
      <h1>Welcome to React Router</h1>
      <div>{category?.name ?? "Category not found"}</div>
    </main>
  );
}
