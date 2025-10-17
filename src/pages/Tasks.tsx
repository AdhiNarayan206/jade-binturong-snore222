import { useState } from "react";
import { tasks as initialTasks, projects, users, Task } from "@/data/mockData";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import { ThemeToggle } from "@/components/ThemeToggle";

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState("");

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const getPriorityVariant = (priority: string) => {
    if (priority === "High") return "destructive";
    if (priority === "Medium") return "secondary";
    return "outline";
  };

  const getAssignee = (assigneeId: string) =>
    users.find((u) => u.id === assigneeId);
  const getProject = (projectId: string) =>
    projects.find((p) => p.id === projectId);

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4 flex flex-col h-full">
      <header className="flex justify-between items-center pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">
            Track and manage all tasks across your projects.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filter tasks..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
          <CreateTaskDialog
            onTaskCreated={handleTaskCreated}
            projects={projects}
            users={users}
          />
          <ThemeToggle />
        </div>
      </header>
      
      <div className="flex-1">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border">
              <TableHead>Title</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Assignee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => {
              const assignee = getAssignee(task.assigneeId);
              const project = getProject(task.projectId);
              return (
                <TableRow key={task.id} className="border-b-0 hover:bg-accent">
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>{project?.name || "N/A"}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>
                    <Badge variant={getPriorityVariant(task.priority)}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell>
                    {assignee && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={assignee.avatar} />
                              <AvatarFallback>
                                {assignee.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{assignee.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Tasks;