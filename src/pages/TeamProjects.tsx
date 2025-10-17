import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { projects as initialProjects, Project } from "@/data/mockData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { cn } from "@/lib/utils";

const TeamProjects = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const teamProjects = useMemo(() => {
    return projects.filter(p => p.teamId === teamId);
  }, [projects, teamId]);

  const handleProjectCreated = (newProject: Project) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
  };

  const getStatusVariant = (status: Project["status"]) => {
    switch (status) {
      case "On Track":
        return "default";
      case "At Risk":
        return "secondary";
      case "Off Track":
        return "destructive";
    }
  };

  if (!teamId) return <div>Invalid Team ID.</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Projects</h2>
          <p className="text-muted-foreground">
            Create, view, and manage projects.
          </p>
        </div>
        <CreateProjectDialog onProjectCreated={handleProjectCreated} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Project List</CardTitle>
          <CardDescription>A list of all projects managed by this team.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Link to={`/projects/${project.id}`} className="font-medium text-primary hover:underline">
                      {project.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
                  </TableCell>
                  <TableCell>{project.dueDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {teamProjects.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No projects found for this team.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamProjects;