import { useState, useEffect } from "react";
import { Task } from "@/data/mockData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

type TeamMember = {
  user_id: string;
  profiles: {
    full_name: string | null;
  } | null;
};

interface EditTaskDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskUpdated: (updatedTask: Task) => void;
  projects: Array<{ id: string; name: string }>;
  teamId?: string;
}

export function EditTaskDialog({
  task,
  open,
  onOpenChange,
  onTaskUpdated,
  projects,
  teamId,
}: EditTaskDialogProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState(task.title);
  const [status, setStatus] = useState<Task["status"]>(task.status);
  const [priority, setPriority] = useState<Task["priority"]>(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [projectId, setProjectId] = useState(task.projectId);
  const [assigneeIds, setAssigneeIds] = useState<string[]>([task.assigneeId]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setTitle(task.title);
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(task.dueDate);
      setProjectId(task.projectId);
      setAssigneeIds([task.assigneeId]);
    }
  }, [open, task]);

  useEffect(() => {
    if (open && teamId) {
      fetchTeamMembers();
    }
  }, [open, teamId]);

  const fetchTeamMembers = async () => {
    if (!teamId) return;
    
    setLoadingMembers(true);
    const { data, error } = await supabase
      .from("team_members")
      .select(`
        user_id,
        profiles (
          full_name
        )
      `)
      .eq("team_id", teamId)
      .eq("status", "accepted");

    if (error) {
      console.error("Failed to load team members:", error);
    } else {
      setTeamMembers((data as any) || []);
    }
    setLoadingMembers(false);
  };

  const toggleAssignee = (userId: string) => {
    setAssigneeIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const removeAssignee = (userId: string) => {
    setAssigneeIds((prev) => prev.filter((id) => id !== userId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (assigneeIds.length === 0) {
      toast({
        title: "Error",
        description: "Please assign at least one team member.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedTask: Task = {
      ...task,
      title,
      status,
      priority,
      dueDate,
      projectId,
      assigneeId: assigneeIds[0], // Store first assignee for backward compatibility
    };

    onTaskUpdated(updatedTask);
    toast({
      title: "Task updated",
      description: "The task has been successfully updated.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update the task details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project">Project</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Assignees</Label>
              <div className="space-y-3">
                {/* Selected assignees */}
                {assigneeIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {assigneeIds.map((userId, index) => {
                      const member = teamMembers.find((m) => m.user_id === userId);
                      const isCurrentUser = userId === user?.id;
                      const displayName = isCurrentUser
                        ? "Me"
                        : member?.profiles?.full_name || `User ${index + 1}`;
                      
                      return (
                        <Badge key={userId} variant="secondary" className="gap-1">
                          {displayName}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                            onClick={() => removeAssignee(userId)}
                          />
                        </Badge>
                      );
                    })}
                  </div>
                )}
                
                {/* Assignee selection */}
                {loadingMembers ? (
                  <Skeleton className="h-32 w-full" />
                ) : (
                  <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
                    {user && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-assignee-${user.id}`}
                          checked={assigneeIds.includes(user.id)}
                          onCheckedChange={() => toggleAssignee(user.id)}
                        />
                        <Label
                          htmlFor={`edit-assignee-${user.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          Me (You)
                        </Label>
                      </div>
                    )}
                    {teamMembers.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No other team members available
                      </p>
                    ) : (
                      teamMembers
                        .filter((member) => member.user_id !== user?.id)
                        .map((member, index) => (
                          <div key={member.user_id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`edit-assignee-${member.user_id}`}
                              checked={assigneeIds.includes(member.user_id)}
                              onCheckedChange={() => toggleAssignee(member.user_id)}
                            />
                            <Label
                              htmlFor={`edit-assignee-${member.user_id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {member.profiles?.full_name || `User ${index + 1}`}
                            </Label>
                          </div>
                        ))
                    )}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Select one or more team members to assign
                </p>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as Task["status"])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as Task["priority"])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
