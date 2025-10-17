import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";

type TeamRepo = {
  id: string;
  github_repo: string;
};

export function useTeamRepos() {
  const [repos, setRepos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);
      
      // Fetch all teams the user is a member of, selecting only the github_repo field
      const { data, error } = await supabase
        .from("teams")
        .select("github_repo")
        .not("github_repo", "is", null); // Only select teams that have a repo set

      if (error) {
        console.error("Supabase Error fetching team repositories:", error);
        showError("Failed to fetch team repositories: " + error.message);
        setLoading(false);
        return;
      }

      console.log("Fetched team data:", data);

      // Extract unique repository names
      const uniqueRepos = Array.from(new Set(
        (data as TeamRepo[])
          .map(team => team.github_repo)
          .filter((repo): repo is string => !!repo)
      ));
      
      setRepos(uniqueRepos);
      setLoading(false);
    };

    fetchRepos();
  }, []);

  return { repos, loading };
}