import { Outlet, useParams, NavLink, Link } from "react-router-dom";
import {
  FolderKanban,
  ListTodo,
  FileText,
  GitMerge,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { showError } from "@/utils/toast";

const TeamWorkspaceLayout = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [teamName, setTeamName] = useState("Loading Team...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) return;

    const fetchTeamName = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("teams")
        .select("name, description")
        .eq("id", teamId)
        .single();

      if (error) {
        showError("Failed to load team details: " + error.message);
        setTeamName("Team Not Found");
      } else if (data) {
        setTeamName(data.name);
      }
      setLoading(false);
    };

    fetchTeamName();
  }, [teamId]);

  const navLinks = [
    { to: `/teams/${teamId}/projects`, label: "Projects", icon: FolderKanban },
    { to: `/teams/${teamId}/tasks`, label: "Tasks", icon: ListTodo },
    { to: `/teams/${teamId}/documents`, label: "Documents", icon: FileText },
    { to: `/teams/${teamId}/contributions`, label: "Contributions", icon: GitMerge },
  ];

  return (
    <div className="space-y-6">
      <Link to="/teams" className={cn(buttonVariants({ variant: "outline" }), "mb-4")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to All Teams
      </Link>
      
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
      ) : (
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">{teamName} Workspace</h1>
          <p className="text-muted-foreground">Manage projects, tasks, and documents for the {teamName} team.</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-64 shrink-0">
          <CardHeader>
            <CardTitle className="text-lg">Navigation</CardTitle>
            <CardDescription>Team specific resources</CardDescription>
          </CardHeader>
          <CardContent className="p-2 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    buttonVariants({ variant: "ghost" }),
                    "w-full justify-start text-foreground",
                    isActive && "bg-accent text-accent-foreground"
                  )
                }
              >
                <link.icon className="mr-2 h-4 w-4" />
                {link.label}
              </NavLink>
            ))}
          </CardContent>
        </Card>
        
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default TeamWorkspaceLayout;