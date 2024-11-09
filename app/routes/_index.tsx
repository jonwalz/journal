import { type MetaFunction } from "@remix-run/node";
import Navigation from "../components/Navigation";
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
    <main className="min-h-screen">
      <Navigation />
      <Article />
    </main>
  );
}
