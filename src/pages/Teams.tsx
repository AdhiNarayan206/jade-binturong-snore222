import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateTeamDialog } from "@/components/CreateTeamDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { showError, showSuccess } from "@/utils/toast";

type Team = {
  id: string;
  name: string;
  description: string | null;
};

type Invitation = {
  id: string;
  teams: {
    name: string;
  } | null;
};

const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    setLoading(true);
    
    // Fetch teams
    const { data: teamsData, error: teamsError } = await supabase
      .from("teams")
      .select("id, name, description");
    if (teamsError) {
      showError("Failed to fetch teams: " + teamsError.message);
    } else {
      setTeams(teamsData || []);
    }

    // Fetch invitations
    const { data: invitesData, error: invitesError } = await supabase
      .from("team_members")
      .select(`
        id,
        teams ( name )
      `)
      .eq("status", "pending")
      .eq("user_id", (await supabase.auth.getUser()).data.user?.id);
    
    if (invitesError) {
      showError("Failed to fetch invitations: " + invitesError.message);
    } else {
      setInvitations(invitesData as any || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleInvitation = async (invitationId: string, accept: boolean) => {
    if (accept) {
      const { error } = await supabase
        .from("team_members")
        .update({ status: "accepted", joined_at: new Date().toISOString() })
        .eq("id", invitationId);
      if (error) {
        showError(error.message);
      } else {
        showSuccess("Invitation accepted!");
      }
    } else {
      const { error } = await supabase
        .from("team_members")
        .update({ status: "declined" })
        .eq("id", invitationId);
      if (error) {
        showError(error.message);
      } else {
        showSuccess("Invitation declined.");
      }
    }
    fetchAllData();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground">
            Create and manage your teams.
          </p>
        </div>
        <CreateTeamDialog onTeamCreated={fetchAllData} />
      </div>

      {loading || invitations.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <div className="space-y-2">
                {invitations.map((invite) => (
                  <div key={invite.id} className="border p-4 rounded-md flex justify-between items-center">
                    <p>You have been invited to join <strong>{invite.teams?.name}</strong>.</p>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleInvitation(invite.id, true)}>Accept</Button>
                      <Button size="sm" variant="outline" onClick={() => handleInvitation(invite.id, false)}>Decline</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Your Teams</CardTitle>
          <CardDescription>A list of all teams you are a member of.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : teams.length > 0 ? (
            <div className="space-y-2">
              {teams.map((team) => (
                <Link to={`/teams/${team.id}`} key={team.id} className="block border p-4 rounded-md hover:bg-accent">
                  <h3 className="font-semibold">{team.name}</h3>
                  <p className="text-sm text-muted-foreground">{team.description}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              You are not a member of any teams yet. Create one to get started!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Teams;