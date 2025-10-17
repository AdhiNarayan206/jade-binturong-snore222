import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { showError } from "@/utils/toast";
import { ArrowLeft, User, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { InviteMemberDialog } from "@/components/InviteMemberDialog";

type Team = {
  id: string;
  name: string;
  description: string | null;
};

type Member = {
  id: string;
  role: "Admin" | "Member";
  status: "pending" | "accepted" | "declined";
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

const TeamDetail = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchData = async () => {
    if (!teamId) return;
    setLoading(true);

    // Fetch team details
    const { data: teamData, error: teamError } = await supabase
      .from("teams")
      .select("id, name, description")
      .eq("id", teamId)
      .single();

    if (teamError) {
      showError("Failed to fetch team details: " + teamError.message);
      setLoading(false);
      return;
    }
    setTeam(teamData);

    // Fetch team members
    const { data: membersData, error: membersError } = await supabase
      .from("team_members")
      .select(`
        id,
        role,
        status,
        profiles (
          full_name,
          avatar_url
        )
      `)
      .eq("team_id", teamId);

    if (membersError) {
      showError("Failed to fetch team members: " + membersError.message);
    } else {
      setMembers(membersData as any || []);
    }

    // Check if current user is an admin
    const { data: adminData } = await supabase.rpc('is_admin_of', { team_id_to_check: teamId });
    setIsAdmin(adminData || false);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [teamId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-6 w-80" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!team) {
    return <div>Team not found.</div>;
  }

  return (
    <div className="space-y-4">
      <Button variant="outline" asChild>
        <Link to="/teams">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Teams
        </Link>
      </Button>
      <div>
        <h1 className="text-3xl font-bold">{team.name}</h1>
        <p className="text-muted-foreground">{team.description}</p>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Manage your team members and their roles.
            </CardDescription>
          </div>
          {isAdmin && <InviteMemberDialog teamId={team.id} onMemberInvited={fetchData} />}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={member.profiles?.avatar_url || undefined} />
                    <AvatarFallback>
                      {member.profiles?.full_name ? member.profiles.full_name.charAt(0) : <User />}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.profiles?.full_name || "Invited User"}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.status === 'pending' ? 'Invitation pending' : 'Member'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {member.role === 'Admin' && (
                    <Badge variant="outline">
                      <Shield className="mr-1 h-3 w-3" />
                      Admin
                    </Badge>
                  )}
                  {member.status === 'pending' && (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamDetail;