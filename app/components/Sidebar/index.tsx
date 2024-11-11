"use client";
import * as React from "react";
import { useLocation } from "@remix-run/react";
import {
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  ChevronsUpDown,
  CreditCard,
  Heart,
  LogOut,
  Plus,
  Settings2,
  Sparkles,
  SquareTerminal,
  Target,
  LucideIcon,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Separator } from "../../components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { sidebarOptions, JournalType } from "./constants";

export const iframeHeight = "800px";

export const description = "A sidebar that collapses to icons.";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
};

interface JournalTypeInfo {
  id: JournalType;
  name: string;
  icon: LucideIcon;
  description: string;
}

const journalTypes: JournalTypeInfo[] = [
  {
    id: "therapeutic",
    name: "Therapeutic Journal",
    icon: Heart,
    description:
      "A safe space for emotional processing and self-reflection with AI-guided support.",
  },
  {
    id: "growth",
    name: "Growth Coach Journal",
    icon: Target,
    description:
      "Focus on personal development with goal tracking and actionable insights.",
  },
  {
    id: "memory",
    name: "Memory Journal",
    icon: BookOpen,
    description:
      "Capture and reflect on life moments with AI-enhanced organization and insights.",
  },
];

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [activeTeam, setActiveTeam] = useState<JournalTypeInfo>(
    journalTypes[0]
  );
  const [isJournalSelectorOpen, setIsJournalSelectorOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateNewJournal = (typeId: JournalType) => {
    // Here you would handle the creation of a new journal
    console.log(`Creating new journal of type: ${typeId}`);
    setIsCreateModalOpen(false);
    // Add new journal to list and select it
  };

  return (
    <>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={() =>
                      setIsJournalSelectorOpen(!isJournalSelectorOpen)
                    }
                  >
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {activeTeam.name}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-background dark:bg-secondaryBlack"
                    align="start"
                    side="bottom"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="text-xs text-muted-foreground text-black dark:text-white">
                      Journals
                    </DropdownMenuLabel>
                    {journalTypes.map((journal, index) => (
                      <DropdownMenuItem
                        key={journal.name}
                        onClick={() => setActiveTeam(journal)}
                        className="gap-2 p-2 mb-2 cursor-pointer"
                      >
                        {journal.name}
                        <DropdownMenuShortcut>
                          ⌘{index + 1}
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="gap-2 p-2"
                      onClick={() => {
                        setIsCreateModalOpen(true);
                        setIsJournalSelectorOpen(false);
                      }}
                    >
                      <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                        <Plus className="size-4" />
                      </div>
                      <div className="font-medium text-muted-foreground">
                        Create New Journal
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent className="scrollbar">
            <SidebarGroup className="p-0">
              <SidebarMenu>
                {sidebarOptions[activeTeam.id].map((item) => (
                  <React.Fragment key={item.section}>
                    <SidebarGroupLabel className="rounded-none duration-200 shrink-0 items-center text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 p-4 block border-b-4 border-bottom dark:border-darkNavBorder text-xl font-heading h-auto">
                      {item.section}
                    </SidebarGroupLabel>
                    {item.items?.map((subItem) => (
                      <SidebarMenuItem key={subItem.name}>
                        <SidebarMenuSubButton asChild>
                          <a
                            className={`rounded-none h-auto block border-b-4 border-border dark:border-darkNavBorder p-4 pl-7 font-base text-text/90 dark:text-darkText/90 hover:bg-main50 dark:hover:text-text ${
                              location.pathname === subItem.href
                                ? "bg-main50 dark:bg-main dark:text-black"
                                : ""
                            }`}
                            href={subItem.href}
                          >
                            {React.createElement(subItem.icon, { size: 24 })}
                            <span className="text-lg">{subItem.name}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuItem>
                    ))}
                  </React.Fragment>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={data.user.avatar}
                          alt={data.user.name}
                        />
                        <AvatarFallback className="rounded-lg">
                          CN
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {data.user.name}
                        </span>
                        <span className="truncate text-xs">
                          {data.user.email}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side="bottom"
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage
                            src={data.user.avatar}
                            alt={data.user.name}
                          />
                          <AvatarFallback className="rounded-lg">
                            CN
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {data.user.name}
                          </span>
                          <span className="truncate text-xs">
                            {data.user.email}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Sparkles />
                        Upgrade to Pro
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <BadgeCheck />
                        Account
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CreditCard />
                        Billing
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Bell />
                        Notifications
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="bg-white dark:bg-secondaryBlack">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
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
