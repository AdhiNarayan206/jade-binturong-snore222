import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { tasks as initialTasks, projects, users, Task } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
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
import { Skeleton } from "@/components/ui/skeleton";

// NOTE: Since we are using mock data, we need a mock user ID for filtering.
// In a real app, we would map Supabase user ID to mock user ID or use real database queries.
const MOCK_USER_ID_MAP: { [key: string]: string } = {
    // Assuming the authenticated user is 'user-1' (Alice) for mock purposes
    // Replace this logic with actual user ID mapping if needed later.
    "default_supabase_user_id": "user-1" 
};

const MyTasks = () => {
  const { user, loading: loadingAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [myTasks, setMyTasks] = useState<Task[]>([]);

  // Determine the mock user ID based on the authenticated user
  const currentMockUserId = useMemo(() => {
    // For now, we hardcode the authenticated user to 'user-1' (Alice) in mock data
    // In a real scenario, we would fetch the profile linked to user.id
    return "user-1"; 
  }, [user]);

  useEffect(() => {
    if (!loadingAuth) {
        // Filter tasks assigned to the current mock user
        const assignedTasks = initialTasks
            .filter(task => task.assigneeId === currentMockUserId)
            .filter(task => task.status !== "Done") // Only show To Do / In Progress
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        
        setMyTasks(assignedTasks);
        setLoading(false);
    }
  }, [loadingAuth, currentMockUserId]);

  const getPriorityVariant = (priority: string) => {
    if (priority === "High") return "destructive";
    if (priority === "Medium") return "secondary";
    return "outline";
  };

  const getProject = (projectId: string) =>
    projects.find((p) => p.id === projectId);

  if (loading || loadingAuth) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My To-Do List</CardTitle>
        <CardDescription>
          Tasks assigned to you across all your projects.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {myTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Great job! You have no pending tasks.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myTasks.map((task) => {
                const project = getProject(task.projectId);
                return (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>
                        <Link to={`/projects/${task.projectId}`} className="text-primary hover:underline">
                            {project?.name || "N/A"}
                        </Link>
                    </TableCell>
                    <TableCell>
                        <Link to={`/teams/${project?.teamId}/projects`} className="text-muted-foreground hover:underline text-sm">
                            {project?.teamId === "team-alpha" ? "Alpha Team" : project?.teamId === "team-beta" ? "Beta Team" : "N/A"}
                        </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityVariant(task.priority)}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default MyTasks;