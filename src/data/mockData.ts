export type User = {
  id: string;
  name: string;
  avatar: string;
};

export type Task = {
  id: string;
  title: string;
  status: "To Do" | "In Progress" | "Done";
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  assigneeId: string;
  projectId: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  status: "On Track" | "At Risk" | "Off Track";
  dueDate: string;
};

export type Document = {
  id: string;
  title: string;
  content: string;
  lastModified: string;
};

export const users: User[] = [
  { id: "user-1", name: "Alice", avatar: "/placeholder.svg" },
  { id: "user-2", name: "Bob", avatar: "/placeholder.svg" },
  { id: "user-3", name: "Charlie", avatar: "/placeholder.svg" },
];

export let projects: Project[] = [
  {
    id: "proj-1",
    name: "CollabMate UI Redesign",
    description: "Complete overhaul of the user interface for better user experience.",
    status: "On Track",
    dueDate: "2024-09-30",
  },
  {
    id: "proj-2",
    name: "API Integration for GitHub",
    description: "Integrate GitHub API for contribution tracking.",
    status: "At Risk",
    dueDate: "2024-08-15",
  },
  {
    id: "proj-3",
    name: "Backend Refactoring",
    description: "Refactor the backend services for scalability and performance.",
    status: "Off Track",
    dueDate: "2024-08-20",
  },
];

export let tasks: Task[] = [
  {
    id: "task-1",
    title: "Design new dashboard mockups",
    status: "Done",
    priority: "High",
    dueDate: "2024-07-30",
    assigneeId: "user-1",
    projectId: "proj-1",
  },
  {
    id: "task-2",
    title: "Develop dashboard components",
    status: "In Progress",
    priority: "High",
    dueDate: "2024-08-10",
    assigneeId: "user-2",
    projectId: "proj-1",
  },
  {
    id: "task-3",
    title: "Setup OAuth for GitHub API",
    status: "To Do",
    priority: "Medium",
    dueDate: "2024-08-05",
    assigneeId: "user-3",
    projectId: "proj-2",
  },
    {
    id: "task-4",
    title: "Implement commit tracking endpoint",
    status: "To Do",
    priority: "High",
    dueDate: "2024-08-12",
    assigneeId: "user-3",
    projectId: "proj-2",
  },
];

export let documents: Document[] = [
  {
    id: "doc-1",
    title: "Project Charter: UI Redesign",
    content: "This document outlines the scope, objectives, and participants of the UI Redesign project.",
    lastModified: "2024-07-20",
  },
  {
    id: "doc-2",
    title: "API Integration Specifications",
    content: "Technical specifications for integrating the GitHub API.",
    lastModified: "2024-07-18",
  },
];

// Functions to add to mock data to simulate creation
export const addProject = (project: Omit<Project, 'id'>) => {
  const newProject = { ...project, id: `proj-${Date.now()}` };
  projects = [...projects, newProject];
  return newProject;
}

export const addTask = (task: Omit<Task, 'id'>) => {
  const newTask = { ...task, id: `task-${Date.now()}` };
  tasks = [...tasks, newTask];
  return newTask;
}

export const addDocument = (doc: Omit<Document, 'id' | 'lastModified'>) => {
  const newDocument = { 
    ...doc, 
    id: `doc-${Date.now()}`,
    lastModified: new Date().toISOString().split('T')[0] 
  };
  documents = [...documents, newDocument];
  return newDocument;
}