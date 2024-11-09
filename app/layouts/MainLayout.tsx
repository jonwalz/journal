import { type PropsWithChildren } from "react";
import Navigation from "../components/Navigation";

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background dark:bg-darkBackground">
      <Navigation />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
