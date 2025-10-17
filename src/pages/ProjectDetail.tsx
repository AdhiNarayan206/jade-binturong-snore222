import { useParams } from "react-router-dom";
import { projects, tasks, users } from "@/data/mockData";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const project = projects.find((p) => p.id === projectId);
  const projectTasks = tasks.filter((t) => t.projectId === projectId);

  if (!project) {
    return <div>Project not found</div>;
  }

  const getPriorityVariant = (priority: string) => {
    if (priority === "High") return "destructive";
    if (priority === "Medium") return "secondary";
    return "outline";
  };

  const getAssignee = (assigneeId: string) => {
    return users.find((u) => u.id === assigneeId);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <p className="text-muted-foreground">{project.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>All tasks associated with this project.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Assignee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectTasks.map((task) => {
                const assignee = getAssignee(task.assigneeId);
                return (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>
                      <Badge variant={getPriorityVariant(task.priority)}>{task.priority}</Badge>
                    </TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell>
                      {assignee && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Avatar>
                              <AvatarImage src={assignee.avatar} />
                              <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{assignee.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetail;