import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router"; // or "@remix-run/node"
import { auth } from "~/lib/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  return auth.handler(request);
}

export async function action({ request }: ActionFunctionArgs) {
  return auth.handler(request);
}
