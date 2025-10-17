import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { showError } from "@/utils/toast";
import { format } from "date-fns";

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
  const [repo, setRepo] = useState("");
  const [commits, setCommits] = useState<Commit[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchCommits = async () => {
    if (!repo) {
      showError("Please enter a repository name.");
      return;
    }
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Contributions</h1>
        <p className="text-muted-foreground">
          Monitor team contributions from an integrated GitHub repository.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fetch Repository Commits</CardTitle>
          <CardDescription>
            Enter a repository name in the format `owner/repo` to see the latest commits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="e.g., facebook/react"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              disabled={isLoading}
            />
            <Button onClick={handleFetchCommits} disabled={isLoading}>
              {isLoading ? "Fetching..." : "Fetch Commits"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
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

      {!isLoading && commits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Commits for {repo}</CardTitle>
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
    </div>
  );
};

export default Contributions;