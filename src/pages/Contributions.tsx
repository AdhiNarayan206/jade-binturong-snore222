import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { showError } from "@/utils/toast";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTeamRepos } from "@/hooks/use-team-repos";

// Define a type for the commit data we expect from GitHub
type Commit = {
  sha: string;
  commit: {
    author: {
      name: string;
      date: string;
    };
    message: string;
  };
  html_url: string;
};

const Contributions = () => {
  const { repos, loading: loadingRepos } = useTeamRepos();
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [commits, setCommits] = useState<Commit[]>([]);
  const [isLoadingCommits, setIsLoadingCommits] = useState(false);

  // Set the first repo as default once loaded
  useEffect(() => {
    if (!loadingRepos && repos.length > 0 && !selectedRepo) {
      setSelectedRepo(repos[0]);
    }
  }, [loadingRepos, repos, selectedRepo]);

  // Fetch commits whenever the selectedRepo changes
  useEffect(() => {
    if (selectedRepo) {
      handleFetchCommits(selectedRepo);
    } else {
      setCommits([]);
    }
  }, [selectedRepo]);

  const handleFetchCommits = async (repo: string) => {
    setIsLoadingCommits(true);
    setCommits([]);

    try {
      const { data, error } = await supabase.functions.invoke("github-proxy", {
        body: { repo },
      });

      if (error) {
        throw new Error(error.message);
      }
      
      // The data from the edge function might have an error property
      if (data.error) {
        throw new Error(data.error);
      }

      setCommits(data);
    } catch (err: any) {
      console.error(err);
      showError(err.message || "Failed to fetch commits.");
    } finally {
      setIsLoadingCommits(false);
    }
  };

  const loading = loadingRepos || isLoadingCommits;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Contributions</h1>
        <p className="text-muted-foreground">
          Monitor team contributions from integrated GitHub repositories.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Repository</CardTitle>
          <CardDescription>
            Choose a linked repository to view its latest commits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-sm">
            <Select onValueChange={setSelectedRepo} value={selectedRepo} disabled={loadingRepos}>
              <SelectTrigger>
                <SelectValue placeholder="Select a repository" />
              </SelectTrigger>
              <SelectContent>
                {loadingRepos ? (
                  <SelectItem value="" disabled>Loading repositories...</SelectItem>
                ) : repos.length === 0 ? (
                  <SelectItem value="" disabled>No repositories linked to your teams.</SelectItem>
                ) : (
                  repos.map((repoName) => (
                    <SelectItem key={repoName} value={repoName}>
                      {repoName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {loading && selectedRepo && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Commits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-2">
                    <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && selectedRepo && commits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Commits for {selectedRepo}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Message</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commits.map((c) => (
                  <TableRow key={c.sha}>
                    <TableCell>
                      <a href={c.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary">
                        {c.commit.message.split('\n')[0]}
                      </a>
                    </TableCell>
                    <TableCell>{c.commit.author.name}</TableCell>
                    <TableCell>{format(new Date(c.commit.author.date), "PPP")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {!loading && selectedRepo && commits.length === 0 && !isLoadingCommits && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No commits found for this repository.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Contributions;