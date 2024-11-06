import { type MetaFunction } from "@remix-run/node";
import Navigation from "~/components/Navigation";

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
    <main className="min-h-screen bg-background dark:bg-darkBackground">
      <Navigation />
    </main>
  );
}
