import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { tasks as initialTasks, projects, Task, updateTask, deleteTask } from "@/data/mockData";
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
import { EditTaskDialog } from "@/components/EditTaskDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TeamTasks = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const { toast } = useToast();

  const teamProjects = useMemo(() => {
    return projects.filter(p => p.teamId === teamId);
  }, [teamId]);

  const teamProjectIds = useMemo(() => teamProjects.map(p => p.id), [teamProjects]);

  const teamTasks = useMemo(() => {
    return tasks.filter(t => teamProjectIds.includes(t.projectId));
  }, [tasks, teamProjectIds]);

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    updateTask(updatedTask);
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
    setDeletingTaskId(null);
    toast({
      title: "Task deleted",
      description: "The task has been successfully deleted.",
    });
  };

  const getPriorityVariant = (priority: string) => {
    if (priority === "High") return "destructive";
    if (priority === "Medium") return "secondary";
    return "outline";
  };

  const getProject = (projectId: string) =>
    projects.find((p) => p.id === projectId);

  const filteredTasks = teamTasks.filter((task) =>
    task.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4 flex flex-col h-full">
      <header className="flex justify-between items-center pb-4 border-b border-border">
        <div>
          <h2 className="text-2xl font-bold">Tasks</h2>
          <p className="text-muted-foreground">
            Track and manage all tasks for this team's projects.
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
            projects={teamProjects} // Pass only team projects
            teamId={teamId}
          />
        </div>
      </header>
      
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border">
              <TableHead>Title</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No tasks found for this team.
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => {
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
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Avatar className="h-6 w-6 bg-transparent">
                              <AvatarFallback className="bg-transparent">
                                {task.assigneeId.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{task.assigneeId}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingTask(task)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeletingTaskId(task.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          open={!!editingTask}
          onOpenChange={(open) => !open && setEditingTask(null)}
          onTaskUpdated={handleTaskUpdated}
          projects={teamProjects}
          teamId={teamId}
        />
      )}

      <AlertDialog open={!!deletingTaskId} onOpenChange={(open) => !open && setDeletingTaskId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingTaskId && handleDeleteTask(deletingTaskId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeamTasks;