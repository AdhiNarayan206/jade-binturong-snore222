import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";

type Team = {
  id: string;
  name: string;
};

const TEAM_STORAGE_KEY = "selected_team_id";

export function useTeamSelector() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      
      // Fetch teams the user is an accepted member of
      const { data, error } = await supabase
        .from("teams")
        .select(`
          id,
          name,
          team_members!inner ( status )
        `)
        .eq('team_members.status', 'accepted');

      if (error) {
        showError("Failed to fetch teams: " + error.message);
        setLoading(false);
        return;
      }

      const userTeams: Team[] = (data as any[]).map(t => ({ id: t.id, name: t.name }));
      setTeams(userTeams);

      // Determine initial selected team
      const storedTeamId = localStorage.getItem(TEAM_STORAGE_KEY);
      
      if (storedTeamId && userTeams.some(t => t.id === storedTeamId)) {
        setSelectedTeamId(storedTeamId);
      } else if (userTeams.length > 0) {
        setSelectedTeamId(userTeams[0].id);
      } else {
        setSelectedTeamId(null);
      }

      setLoading(false);
    };

    fetchTeams();
  }, []);

  const selectTeam = (teamId: string) => {
    if (teams.some(t => t.id === teamId)) {
      localStorage.setItem(TEAM_STORAGE_KEY, teamId);
      setSelectedTeamId(teamId);
    }
  };

  const selectedTeam = useMemo(() => {
    return teams.find(t => t.id === selectedTeamId) || null;
  }, [teams, selectedTeamId]);

  return {
    teams,
    selectedTeamId,
    selectedTeam,
    selectTeam,
    loading,
  };
}