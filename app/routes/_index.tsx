import { type MetaFunction } from "@remix-run/node";
import Article from "../components/Article";

export const meta: MetaFunction = () => {
  return [
    { title: "My Remix App" },
    {
      name: "description",
      content: "A modern web application built with Remix",
    },
  ];
};

export default function Index() {
  return (
    <main>
      <Article />
    </main>
  );
}
