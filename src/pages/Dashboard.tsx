import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Activity, CheckCircle, Clock } from "lucide-react";
import { projects, tasks } from "@/data/mockData";
import { addDays, isAfter, isBefore } from "date-fns";
import { TeamContributionChart } from "@/components/TeamContributionChart";
import MyTasks from "@/components/MyTasks";

const Dashboard = () => {
  // Calculate stats from mock data
  const activeProjects = projects.length;
  const tasksCompleted = tasks.filter((task) => task.status === "Done").length;

  const today = new Date();
  const sevenDaysFromNow = addDays(today, 7);
  const upcomingDeadlines = projects.filter((p) => {
    const dueDate = new Date(p.dueDate);
    return isAfter(dueDate, today) && isBefore(dueDate, sevenDaysFromNow);
  }).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's a summary of your projects.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="group hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Projects
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6 group-active:scale-95" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              Total projects being managed.
            </p>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasks Completed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-12 group-active:scale-95" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksCompleted}</div>
            <p className="text-xs text-muted-foreground">
              Total tasks marked as done.
            </p>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Deadlines
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:scale-110 group-hover:rotate-12 group-active:scale-95" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingDeadlines}</div>
            <p className="text-xs text-muted-foreground">
              In the next 7 days.
            </p>
          </CardContent>
        </Card>
      </div>

      <MyTasks />
      <TeamContributionChart />
    </div>
  );
};

export default Dashboard;