import { ChevronsUpDown, Plus } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../components/ui/sidebar";
import { journalTypes } from "./data";
import { JournalTypeInfo } from "./types";
import { Journal } from "~/context/JournalContext";
import { Button } from "../ui/button";

interface JournalSelectorProps {
  activeTeam: JournalTypeInfo;
  setActiveTeam: (team: JournalTypeInfo) => void;
  onCreateNew: () => void;
  journals: Journal[];
}

export function JournalSelector({
  activeTeam,
  setActiveTeam,
  onCreateNew,
  journals,
}: JournalSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarMenuItem>
      {journals.length > 0 ? (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-text dark:text-darkText">
                  {activeTeam.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto text-text dark:text-darkText" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-background dark:bg-secondaryBlack"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            {journals.length > 0 && (
              <>
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
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                ))}
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => {
                onCreateNew();
                setIsOpen(false);
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
      ) : (
        <Button
          variant="noShadow"
          className="gap-2 p-2 w-full"
          onClick={() => {
            onCreateNew();
            setIsOpen(false);
          }}
        >
          <div className="flex size-6 items-center justify-center rounded-md border bg-background">
            <Plus className="size-4" />
          </div>
          <div className="font-medium text-muted-foreground">
            Create New Journal
          </div>
        </Button>
      )}
    </SidebarMenuItem>
  );
}
