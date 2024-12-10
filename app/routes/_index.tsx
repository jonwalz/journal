import {
  type MetaFunction,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import Article from "../components/Article";
import { getSession } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request);
  const authToken = session.get("authToken");
  const sessionToken = session.get("sessionToken");

  if (!authToken || !sessionToken) {
    throw redirect("/login");
  }

  return json({});
}

export const meta: MetaFunction = () => {
  return [
    { title: "Journal Up" },
    {
      name: "Journal Up",
      content:
        "A safe space for emotional processing and self-reflection with AI-guided support.",
    },
  ];
};

export default function Index() {
  return <Article />;
}
