import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { showSuccess, showError } from "@/utils/toast";

interface UpdateTeamRepoFormProps {
  teamId: string;
  currentRepo: string | null;
  onRepoUpdated: () => void;
}

export function UpdateTeamRepoForm({ teamId, currentRepo, onRepoUpdated }: UpdateTeamRepoFormProps) {
  const [repo, setRepo] = useState(currentRepo || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("teams")
      .update({ github_repo: repo })
      .eq("id", teamId);

    setLoading(false);

    if (error) {
      showError(error.message);
    } else {
      showSuccess("Repository updated successfully!");
      onRepoUpdated();
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>GitHub Repository</CardTitle>
          <CardDescription>
            Link a GitHub repository to this team to track contributions. Use the format `owner/repository`.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="repo">Repository</Label>
            <Input
              id="repo"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="e.g., facebook/react"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Repository"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}