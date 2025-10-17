import { Outlet, useParams } from "react-router-dom";
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

  return (
    <div className="space-y-6">
      
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

      {/* The main content area now takes up the full width */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default TeamWorkspaceLayout;