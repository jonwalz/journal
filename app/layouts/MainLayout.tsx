import { type PropsWithChildren } from "react";
import { AppSidebar } from "../components/Sidebar";

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="bg-background dark:bg-secondaryBlack w-full">
      <AppSidebar>
        <main>{children}</main>
      </AppSidebar>
      {/* <main className="container mx-auto px-4 py-8">{children}</main> */}
    </div>
  );
}
