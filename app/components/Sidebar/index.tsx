"use client";
import * as React from "react";
import { useLocation, Form } from "@remix-run/react";
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
import { sidebarOptions } from "./constants";
import { JournalSelector } from "./JournalSelector";
import { UserMenu } from "./UserMenu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { useJournal } from "~/context/JournalContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export const iframeHeight = "800px";
export const description = "A sidebar that collapses to icons.";

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const { journals } = useJournal();
  const location = useLocation();
  const [activeJournal, setActiveJournal] = useState(journals[0]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <JournalSelector
                activeJournal={activeJournal}
                setActiveJournal={setActiveJournal}
                onCreateNew={() => setIsCreateModalOpen(true)}
                journals={journals}
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
              <BreadcrumbNavigation journalTitle={activeJournal.title} />
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
              Enter a name for your new journal
            </DialogDescription>
          </DialogHeader>
          <Form
            method="post"
            action="/journals/new"
            onSubmit={(e) => {
              const form = e.currentTarget;
              const name = new FormData(form).get("name") as string;
              if (!name) {
                e.preventDefault();
              } else {
                setIsCreateModalOpen(false);
              }
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Journal Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-secondaryBlack dark:border-slate-700"
                placeholder="My Journal"
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="px-4 py-2  rounded-lg transition-colors"
              >
                Create Journal
              </Button>
            </div>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
