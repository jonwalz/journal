import { type MetaFunction, json, LoaderFunctionArgs } from "@remix-run/node";
import Article from "../components/Article";
import { requireUserSession } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserSession(request);
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
