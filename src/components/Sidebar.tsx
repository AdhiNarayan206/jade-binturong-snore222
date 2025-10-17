import { NavLink, Link } from "react-router-dom";
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
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";

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
  const handleLinkGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin,
        // Request the 'repo' scope to allow reading commit history
        scopes: 'repo', 
      },
    });
    if (error) {
      showError(`Could not link GitHub account: ${error.message}`);
    }
  };

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
        <Button asChild variant="ghost" className="w-full justify-start text-sidebar-foreground">
          <Link to="/teams">
            <Plus className="mr-2 h-4 w-4" /> Invite people
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-sidebar-foreground" onClick={handleLinkGitHub}>
          <Github className="mr-2 h-4 w-4" /> Link GitHub
        </Button>
        <Button asChild variant="ghost" className="w-full justify-start text-sidebar-foreground">
          <a href="https://www.dyad.sh/" target="_blank" rel="noopener noreferrer">
            <HelpCircle className="mr-2 h-4 w-4" /> Help
          </a>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;