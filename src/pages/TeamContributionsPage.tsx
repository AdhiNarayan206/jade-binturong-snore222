import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamContributions } from "@/components/TeamContributions";
import { UpdateTeamRepoForm } from "@/components/UpdateTeamRepoForm";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { Skeleton } from "@/components/ui/skeleton";

// This page is now responsible for displaying the contributions for a specific team.
const TeamContributionsPage = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [teamRepo, setTeamRepo] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!teamId) return;
    setLoading(true);

    // Fetch team repo and check admin status
    const [{ data: teamData, error: teamError }, { data: adminData }] = await Promise.all([
      supabase.from("teams").select("github_repo").eq("id", teamId).single(),
      supabase.rpc('is_admin_of', { team_id_to_check: teamId }),
    ]);

    if (teamError) {
      showError("Failed to fetch team details: " + teamError.message);
    } else if (teamData) {
      setTeamRepo(teamData.github_repo);
    }
    
    setIsAdmin(adminData || false);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [teamId]);

  if (!teamId) return <div>Invalid Team ID.</div>;

  if (loading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Contributions</h2>
        <p className="text-muted-foreground">
          Monitor team contributions from the integrated GitHub repository.
        </p>
      </div>

      {isAdmin && (
        <UpdateTeamRepoForm
          teamId={teamId}
          currentRepo={teamRepo}
          onRepoUpdated={fetchData}
        />
      )}

      {teamRepo ? (
        <TeamContributions teamId={teamId} isAdmin={isAdmin} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>GitHub Repository Required</CardTitle>
            <CardDescription>
              Please link a GitHub repository above to start tracking contributions for this team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* The form above handles linking */}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamContributionsPage;