import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import TeamProjects from "./pages/TeamProjects"; // Renamed
import TeamTasks from "./pages/TeamTasks"; // Renamed
import TeamContributionsPage from "./pages/TeamContributionsPage"; // Renamed
import TeamDocuments from "./pages/TeamDocuments"; // Renamed
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import ProjectDetail from "./pages/ProjectDetail";
import DocumentDetail from "./pages/DocumentDetail";
import Teams from "./pages/Teams";
import TeamDetail from "./pages/TeamDetail";
import TeamWorkspaceLayout from "./components/TeamWorkspaceLayout"; // New Layout
import { ThemeProvider } from "./components/theme-provider";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      {!session ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            
            {/* Global Routes */}
            <Route path="/account" element={<Account />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
            <Route path="/documents/:documentId" element={<DocumentDetail />} />

            {/* Team Workspace Routes */}
            <Route path="/teams/:teamId" element={<TeamWorkspaceLayout />}>
              <Route index element={<TeamDetail />} />
              <Route path="projects" element={<TeamProjects />} />
              <Route path="tasks" element={<TeamTasks />} />
              <Route path="documents" element={<TeamDocuments />} />
              <Route path="contributions" element={<TeamContributionsPage />} />
            </Route>
            
          </Route>
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </>
      )}
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;