import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  GitMerge,
  FileText,
  Users,
  Plus,
  Github,
  HelpCircle,
  Search,
  PencilRuler,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserNav } from "./UserNav";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const mainLinks = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "Tasks", icon: ListTodo },
];

const workspaceLinks = [
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/teams", label: "Teams", icon: Users },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/contributions", label: "Contributions", icon: GitMerge },
];

const Sidebar = () => {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-sidebar border-r border-sidebar-border shrink-0">
      <div className="p-2 border-b border-sidebar-border">
        <UserNav />
      </div>
      <div className="p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <PencilRuler className="h-4 w-4" />
        </Button>
      </div>
      <nav className="flex-1 px-2 space-y-1">
        {mainLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              cn(
                buttonVariants({ variant: "ghost" }),
                "w-full justify-start text-sidebar-foreground hover:text-sidebar-accent-foreground",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
              )
            }
          >
            <link.icon className="mr-2 h-4 w-4" />
            {link.label}
          </NavLink>
        ))}

        <Collapsible defaultOpen>
          <CollapsibleTrigger className="w-full">
            <div className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start px-3 text-xs font-semibold text-sidebar-foreground uppercase tracking-wider")}>
              Workspace
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 pl-3">
            {workspaceLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    buttonVariants({ variant: "ghost" }),
                    "w-full justify-start text-sidebar-foreground hover:text-sidebar-accent-foreground",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )
                }
              >
                <link.icon className="mr-2 h-4 w-4" />
                {link.label}
              </NavLink>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </nav>
      <div className="p-2 mt-auto border-t border-sidebar-border space-y-1">
        <Button variant="ghost" className="w-full justify-start text-sidebar-foreground">
          <Plus className="mr-2 h-4 w-4" /> Invite people
        </Button>
        <Button variant="ghost" className="w-full justify-start text-sidebar-foreground">
          <Github className="mr-2 h-4 w-4" /> Link GitHub
        </Button>
        <Button variant="ghost" className="w-full justify-start text-sidebar-foreground">
          <HelpCircle className="mr-2 h-4 w-4" /> Help
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;