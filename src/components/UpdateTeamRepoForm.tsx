import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { showSuccess, showError } from "@/utils/toast";
import { Pencil, Check, X } from "lucide-react";

interface UpdateTeamRepoFormProps {
  teamId: string;
  currentRepo: string | null;
  onRepoUpdated: () => void;
}

export function UpdateTeamRepoForm({ teamId, currentRepo, onRepoUpdated }: UpdateTeamRepoFormProps) {
  const [repo, setRepo] = useState(currentRepo || "");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!currentRepo); // Start in edit mode if no repo is set

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const repoToSave = repo.trim() === "" ? null : repo.trim();

    const { error } = await supabase
      .from("teams")
      .update({ github_repo: repoToSave })
      .eq("id", teamId);

    setLoading(false);

    if (error) {
      showError(error.message);
    } else {
      showSuccess("Repository updated successfully!");
      onRepoUpdated();
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setRepo(currentRepo || "");
    setIsEditing(false);
  };

  const displayRepo = currentRepo || "No repository linked.";

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle>GitHub Repository</CardTitle>
            <CardDescription>
              Link a GitHub repository to this team to track contributions. Use the format `owner/repository`.
            </CardDescription>
          </div>
          {!isEditing && (
            <Button variant="outline" size="icon" type="button" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-2">
              <Label htmlFor="repo">Repository</Label>
              <Input
                id="repo"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="e.g., owner/repository"
              />
            </div>
          ) : (
            <div className="p-2 border rounded-md bg-muted/50">
              {currentRepo ? (
                <a 
                  href={`https://github.com/${currentRepo}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline font-mono"
                >
                  {displayRepo}
                </a>
              ) : (
                <span className="text-muted-foreground">{displayRepo}</span>
              )}
            </div>
          )}
        </CardContent>
        {isEditing && (
          <CardFooter className="flex justify-end gap-2">
            {currentRepo && (
              <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : (currentRepo ? <><Check className="mr-2 h-4 w-4" /> Save Changes</> : "Link Repository")}
            </Button>
          </CardFooter>
        )}
      </form>
    </Card>
  );
}