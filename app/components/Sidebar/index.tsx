"use client";
import * as React from "react";
import { useLocation } from "@remix-run/react";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuSubButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import { BreadcrumbNavigation } from "../Breadcrumb";
import { sidebarOptions, JournalType } from "./constants";
import { journalTypes } from "./data";
import { JournalSelector } from "./JournalSelector";
import { UserMenu } from "./UserMenu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export const iframeHeight = "800px";
export const description = "A sidebar that collapses to icons.";

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [activeTeam, setActiveTeam] = useState(journalTypes[0]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateNewJournal = (typeId: JournalType) => {
    console.log(`Creating new journal of type: ${typeId}`);
    setIsCreateModalOpen(false);
  };

  return (
    <>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <JournalSelector
                activeTeam={activeTeam}
                setActiveTeam={setActiveTeam}
                onCreateNew={() => setIsCreateModalOpen(true)}
              />
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent className="scrollbar">
            <SidebarGroup className="p-0 border-t-4 border-border dark:border-darkNavBorder">
              <SidebarMenu className="gap-0">
                {sidebarOptions.map((items) => (
                  <SidebarMenuItem key={items.name}>
                    <SidebarMenuSubButton asChild className="translate-x-0">
                      <a
                        className={`rounded-none h-auto block border-b-4 border-border dark:border-darkNavBorder p-4 pl-4 font-base text-text/90 dark:text-darkText/90 hover:bg-main50 dark:hover:text-text ${
                          location.pathname === items.href
                            ? "bg-main50 dark:bg-main dark:text-black"
                            : ""
                        }`}
                        href={items.href}
                      >
                        {React.createElement(items.icon, { size: 24 })}
                        <span className="text-lg">{items.name}</span>
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <UserMenu />
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="bg-white dark:bg-secondaryBlack border-l-4">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="mx-1" />
              <BreadcrumbNavigation journalTitle={activeTeam.name} />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 pt-0 dark:bg-darkBg">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
      {/* Create New Journal Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-secondaryBlack">
          <DialogHeader>
            <DialogTitle>Create New Journal</DialogTitle>
            <DialogDescription>
              Choose the type of journal you&apos;d like to create
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {journalTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleCreateNewJournal(type.id)}
                className="w-full p-4 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {React.createElement(type.icon, { className: "w-6 h-6" })}
                  <div className="text-left">
                    <h3 className="font-medium">{type.name}</h3>
                    <p className="text-sm text-slate-300">{type.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
