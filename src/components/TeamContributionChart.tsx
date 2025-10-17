import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { showError } from "@/utils/toast";

type ContributionData = {
  name: string; // Team Name
  commits: number;
};

export function TeamContributionChart() {
  const [data, setData] = useState<ContributionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributions = async () => {
      setLoading(true);
      
      // 1. Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // 2. Fetch all accepted team memberships for the current user
      const { data: memberships, error: membersError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id)
        .eq('status', 'accepted');

      if (membersError) {
        showError("Failed to fetch team memberships: " + membersError.message);
        setLoading(false);
        return;
      }

      const teamIds = memberships?.map(m => m.team_id) || [];
      if (teamIds.length === 0) {
        setLoading(false);
        return;
      }

      // 3. Fetch contributions and team names for these teams and this user
      const { data: contributionsData, error: contribError } = await supabase
        .from('team_contributions')
        .select(`
          commit_count,
          teams ( name )
        `)
        .eq('user_id', user.id)
        .in('team_id', teamIds);

      if (contribError) {
        showError("Failed to fetch contributions: " + contribError.message);
        setLoading(false);
        return;
      }

      const chartData: ContributionData[] = (contributionsData as any[])
        .map(c => ({
          name: c.teams?.name || 'Unknown Team',
          commits: c.commit_count || 0,
        }))
        .filter(c => c.commits > 0); // Only show teams with contributions

      setData(chartData);
      setLoading(false);
    };

    fetchContributions();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Team Contributions (Commits)</CardTitle>
        <CardDescription>
          Your commit count across teams with linked GitHub repositories.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="commits" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            No contribution data available. Join a team, link a GitHub repository, and sync contributions to see data here.
          </div>
        )}
      </CardContent>
    </Card>
  );
}