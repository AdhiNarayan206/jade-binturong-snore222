import { useState } from "react";
import { Link } from "react-router-dom";
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

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Here you can create, view, and manage all your projects.
          </p>
        </div>
        <CreateProjectDialog onProjectCreated={handleProjectCreated} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
          <CardDescription>A list of all projects in your workspace.</CardDescription>
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
              {projects.map((project) => (
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Projects;