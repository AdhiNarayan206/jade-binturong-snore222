import { useTeamSelector } from "@/hooks/use-team-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";

export function TeamSelector() {
  const { teams, selectedTeamId, selectTeam, loading } = useTeamSelector();

  if (loading) {
    return <Skeleton className="h-8 w-full" />;
  }

  if (teams.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-2 flex items-center gap-2">
        <Users className="h-4 w-4" /> No Teams
      </div>
    );
  }

  return (
    <Select value={selectedTeamId || undefined} onValueChange={selectTeam}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Team" />
      </SelectTrigger>
      <SelectContent>
        {teams.map((team) => (
          <SelectItem key={team.id} value={team.id}>
            {team.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}