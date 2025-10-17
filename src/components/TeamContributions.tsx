import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { showError, showSuccess } from "@/utils/toast";
import { GitCommit } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

type Contribution = {
  commit_count: number;
  last_synced_at: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

interface TeamContributionsProps {
  teamId: string;
  isAdmin: boolean;
}

export function TeamContributions({ teamId, isAdmin }: TeamContributionsProps) {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  const fetchContributions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("team_contributions")
      .select(`
        commit_count,
        last_synced_at,
        profiles (
          full_name,
          avatar_url
        )
      `)
      .eq("team_id", teamId)
      .order('commit_count', { ascending: false });

    if (error) {
      showError("Failed to fetch contributions: " + error.message);
    } else {
      setContributions((data as any) || []);
      if (data && data.length > 0 && data[0].last_synced_at) {
        setLastSynced(data[0].last_synced_at);
      } else {
        setLastSynced(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContributions();
  }, [teamId]);

  const handleSync = async () => {
    setSyncing(true);
    const { data, error } = await supabase.functions.invoke('sync-github-contributions', {
      body: { teamId },
    });

    if (error) {
      showError(`Sync failed: ${(error as any).context?.error || error.message}`);
    } else if (data.error) {
      showError(`Sync failed: ${data.error}`);
    } else {
      showSuccess(data.message || "Sync successful!");
      fetchContributions(); // Refresh data after sync
    }
    setSyncing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Team Contributions</CardTitle>
          <CardDescription>
            Commit counts from the linked repository.
            {lastSynced && ` Last synced ${formatDistanceToNow(new Date(lastSynced), { addSuffix: true })}.`}
          </CardDescription>
        </div>
        {isAdmin && (
          <Button onClick={handleSync} disabled={syncing}>
            {syncing ? "Syncing..." : "Sync with GitHub"}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : contributions.length > 0 ? (
          <div className="space-y-4">
            {contributions.map((contrib, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={contrib.profiles?.avatar_url || undefined} />
                    <AvatarFallback>
                      {contrib.profiles?.full_name ? contrib.profiles.full_name.charAt(0) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-medium">{contrib.profiles?.full_name || "Unknown User"}</p>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GitCommit className="h-4 w-4" />
                  <span className="font-mono text-sm">{contrib.commit_count} commits</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No contribution data available. Sync to see data.
          </p>
        )}
      </CardContent>
    </Card>
  );
}