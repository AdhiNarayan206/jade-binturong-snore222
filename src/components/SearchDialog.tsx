import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  FileText,
  Users,
  GitMerge,
  User,
  Github,
  HelpCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTeamSelector } from "@/hooks/use-team-selector";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Custom icon wrapper component with animation
const AnimatedIcon = ({ Icon, rotation }: { Icon: any; rotation: number }) => {
  return (
    <Icon 
      className="mr-2 h-4 w-4 transition-transform duration-200 ease-out icon-animate" 
      style={{
        ['--rotation' as any]: `${rotation}deg`
      }}
    />
  );
};

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedTeamId } = useTeamSelector();

  // Query for projects
  const { data: projects } = useQuery({
    queryKey: ["projects", selectedTeamId, searchQuery],
    queryFn: async () => {
      if (!selectedTeamId) return [];
      
      let query = supabase
        .from("projects")
        .select("*")
        .eq("team_id", selectedTeamId)
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.limit(5);
      if (error) throw error;
      return data || [];
    },
    enabled: open && !!selectedTeamId,
  });

  // Query for tasks
  const { data: tasks } = useQuery({
    queryKey: ["tasks", selectedTeamId, searchQuery],
    queryFn: async () => {
      if (!selectedTeamId) return [];
      
      let query = supabase
        .from("tasks")
        .select("*")
        .eq("team_id", selectedTeamId)
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.limit(5);
      if (error) throw error;
      return data || [];
    },
    enabled: open && !!selectedTeamId,
  });

  // Query for documents
  const { data: documents } = useQuery({
    queryKey: ["documents", selectedTeamId, searchQuery],
    queryFn: async () => {
      if (!selectedTeamId) return [];
      
      let query = supabase
        .from("documents")
        .select("*")
        .eq("team_id", selectedTeamId)
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.limit(5);
      if (error) throw error;
      return data || [];
    },
    enabled: open && !!selectedTeamId,
  });

  // Query for teams
  const { data: teams } = useQuery({
    queryKey: ["teams", searchQuery],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      let query = supabase
        .from("teams")
        .select(`
          *,
          team_members!inner(user_id)
        `)
        .eq("team_members.user_id", user.id)
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      const { data, error } = await query.limit(5);
      if (error) throw error;
      return data || [];
    },
    enabled: open,
  });

  // Navigation items
  const navigationItems = [
    { label: "Dashboard", to: "/", icon: LayoutDashboard },
    { label: "Teams Overview", to: "/teams", icon: Users },
    { label: "Account", to: "/account", icon: User },
  ];

  const workspaceItems = selectedTeamId ? [
    { label: "Projects", to: `/teams/${selectedTeamId}/projects`, icon: FolderKanban },
    { label: "Tasks", to: `/teams/${selectedTeamId}/tasks`, icon: ListTodo },
    { label: "Documents", to: `/teams/${selectedTeamId}/documents`, icon: FileText },
    { label: "Contributions", to: `/teams/${selectedTeamId}/contributions`, icon: GitMerge },
  ] : [];

  const resourceItems = [
    { label: "Link GitHub", action: "github", icon: Github },
    { label: "Help & Support", to: "https://www.dyad.sh/", icon: HelpCircle, external: true },
  ];

  // Filter navigation items based on search query
  const filteredNavigationItems = navigationItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredWorkspaceItems = workspaceItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredResourceItems = resourceItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (callback: () => void) => {
    callback();
    onOpenChange(false);
  };

  const handleLinkGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin,
        scopes: 'repo',
      },
    });
    if (error) {
      console.error('Could not link GitHub account:', error.message);
    }
  };

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  return (
    <>
      <style>{`
        [cmdk-item] .icon-animate {
          transition: transform 0.2s ease-out;
        }
        [cmdk-item]:hover .icon-animate,
        [cmdk-item][data-selected="true"] .icon-animate {
          transform: scale(1.1) rotate(var(--rotation));
        }
        [cmdk-item]:active .icon-animate {
          transform: scale(0.95);
        }
      `}</style>
      <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search for pages, projects, tasks, documents..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Navigation */}
        {filteredNavigationItems.length > 0 && (
          <>
            <CommandGroup heading="Navigation">
              {filteredNavigationItems.map((item) => (
                <CommandItem
                  key={item.to}
                  value={item.label}
                  onSelect={() => handleSelect(() => navigate(item.to))}
                >
                  <AnimatedIcon Icon={item.icon} rotation={6} />
                  <span>{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Workspace */}
        {filteredWorkspaceItems.length > 0 && (
          <>
            <CommandGroup heading="Workspace">
              {filteredWorkspaceItems.map((item) => (
                <CommandItem
                  key={item.to}
                  value={item.label}
                  onSelect={() => handleSelect(() => navigate(item.to))}
                >
                  <AnimatedIcon Icon={item.icon} rotation={-6} />
                  <span>{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Teams */}
        {teams && teams.length > 0 && (
          <>
            <CommandGroup heading="Teams">
              {teams.map((team) => (
                <CommandItem
                  key={team.id}
                  value={team.name}
                  onSelect={() => handleSelect(() => navigate(`/teams/${team.id}`))}
                >
                  <AnimatedIcon Icon={Users} rotation={12} />
                  <span>{team.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <>
            <CommandGroup heading="Projects">
              {projects.map((project) => (
                <CommandItem
                  key={project.id}
                  value={project.name}
                  onSelect={() => handleSelect(() => navigate(`/projects/${project.id}`))}
                >
                  <AnimatedIcon Icon={FolderKanban} rotation={3} />
                  <span>{project.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Tasks */}
        {tasks && tasks.length > 0 && (
          <>
            <CommandGroup heading="Tasks">
              {tasks.map((task) => (
                <CommandItem
                  key={task.id}
                  value={task.title}
                  onSelect={() => handleSelect(() => navigate(`/teams/${selectedTeamId}/tasks`))}
                >
                  <AnimatedIcon Icon={ListTodo} rotation={-6} />
                  <span>{task.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Documents */}
        {documents && documents.length > 0 && (
          <>
            <CommandGroup heading="Documents">
              {documents.map((document) => (
                <CommandItem
                  key={document.id}
                  value={document.title}
                  onSelect={() => handleSelect(() => navigate(`/documents/${document.id}`))}
                >
                  <AnimatedIcon Icon={FileText} rotation={12} />
                  <span>{document.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Resources */}
        {filteredResourceItems.length > 0 && (
          <CommandGroup heading="Resources">
            {filteredResourceItems.map((item) => (
              <CommandItem
                key={item.label}
                value={item.label}
                onSelect={() => {
                  if (item.action === "github") {
                    handleSelect(handleLinkGitHub);
                  } else if (item.external && item.to) {
                    handleSelect(() => window.open(item.to, "_blank"));
                  } else if (item.to) {
                    handleSelect(() => navigate(item.to));
                  }
                }}
              >
                <AnimatedIcon Icon={item.icon} rotation={-12} />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
    </>
  );
}
