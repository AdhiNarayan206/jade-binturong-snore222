# Team Collaboration & Project Management Platform

A modern, full-featured team collaboration and project management application built with React, TypeScript, and Supabase. This platform enables teams to efficiently manage projects, tasks, documents, and track contributions in a unified workspace.

## 🚀 Features

### Team Management
- **Team Creation & Administration**: Create and manage multiple teams with ease
- **Team Invitations**: Invite members to join teams with a streamlined invitation system
- **Team Workspaces**: Dedicated workspaces for each team with organized navigation

### Project Management
- **Project Tracking**: Create and monitor projects with status indicators (On Track, At Risk, Off Track)
- **Project Details**: Comprehensive project views with task breakdowns and timelines
- **Due Date Management**: Track project deadlines and upcoming milestones

### Task Management
- **Task Organization**: Create and manage tasks with multiple status levels (To Do, In Progress, Done)
- **Task Assignment**: Assign tasks to team members with clear ownership
- **Priority Management**: Set task priorities to focus on what matters most
- **Personal Dashboard**: View all your assigned tasks in one place

### Document Management
- **Document Repository**: Store and organize team documents
- **Document Details**: View and manage document metadata and content
- **Team Document Access**: Share documents within team workspaces

### Analytics & Insights
- **Dashboard Overview**: Real-time statistics on active projects, completed tasks, and upcoming deadlines
- **Team Contributions Chart**: Visualize team member contributions over time
- **Activity Tracking**: Monitor team activity and progress

### User Experience
- **Dark/Light Theme**: Toggle between dark and light themes for comfortable viewing
- **Responsive Design**: Fully responsive interface that works on desktop, tablet, and mobile
- **Authentication**: Secure user authentication powered by Supabase Auth
- **Modern UI Components**: Built with shadcn/ui for a polished, accessible interface

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - Modern React with hooks and functional components
- **TypeScript 5.5** - Type-safe development
- **Vite 6.3** - Fast build tool and development server
- **React Router 6.26** - Client-side routing and navigation
- **TanStack Query 5.56** - Powerful data synchronization and caching

### UI Framework
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible React components
- **Radix UI** - Unstyled, accessible component primitives
- **Lucide React** - Beautiful icon library
- **next-themes** - Theme management (dark/light mode)

### Backend & Database
- **Supabase** - Backend-as-a-Service platform
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication & authorization
  - Row Level Security (RLS)

### Forms & Validation
- **React Hook Form 7.53** - Performant form management
- **Zod 3.23** - TypeScript-first schema validation

### Additional Libraries
- **date-fns 3.6** - Modern date utility library
- **Recharts 2.12** - Chart and visualization library
- **React Markdown** - Markdown rendering support
- **Sonner** - Toast notifications

## 📦 Installation

### Prerequisites
- Node.js 18.x or higher
- pnpm (recommended) or npm
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/AdhiNarayan206/jade-binturong-snore222.git
   cd jade-binturong-snore222
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```
   or if using npm:
   ```bash
   npm install
   ```

3. **Configure Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Create a `.env.local` file in the root directory:
     ```env
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Set up the database**
   - Run the migration scripts in your Supabase project
   - Configure Row Level Security (RLS) policies for tables

5. **Start the development server**
   ```bash
   pnpm dev
   ```
   The application will be available at `http://localhost:5173`

## 🚀 Usage

### Development
```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Build for development environment
pnpm build:dev

# Preview production build
pnpm preview

# Run linter
pnpm lint
```

### Project Structure
```
src/
├── components/       # Reusable UI components
├── context/         # React context providers (Auth, etc.)
├── data/            # Mock data and constants
├── hooks/           # Custom React hooks
├── integrations/    # External service integrations (Supabase)
├── lib/             # Utility libraries and helpers
├── pages/           # Page components (routes)
├── utils/           # Utility functions
├── App.tsx          # Main application component with routing
└── main.tsx         # Application entry point
```

### Key Pages
- **Dashboard** (`/`) - Overview of projects, tasks, and team activity
- **Teams** (`/teams`) - Manage teams and view invitations
- **Team Workspace** (`/teams/:teamId`) - Team-specific workspace with:
  - Projects (`/teams/:teamId/projects`)
  - Tasks (`/teams/:teamId/tasks`)
  - Documents (`/teams/:teamId/documents`)
  - Contributions (`/teams/:teamId/contributions`)
- **Account** (`/account`) - User account settings
- **Project Details** (`/projects/:projectId`) - Individual project view
- **Document Details** (`/documents/:documentId`) - Individual document view

## 🔐 Authentication

The application uses Supabase Auth for user authentication. Users must log in to access the platform. The authentication flow includes:
- Email/password authentication
- Session management
- Protected routes
- Automatic redirect to login for unauthenticated users

## 🎨 Theme Support

The application supports both dark and light themes. Users can toggle between themes using the theme switcher in the navigation. Theme preference is stored locally and persists across sessions.

## 🌐 Deployment

This project is configured for deployment on Vercel with the included `vercel.json` configuration. The configuration ensures proper routing for the single-page application.

### Deploy to Vercel
1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables (Supabase URL and keys)
4. Deploy

### Other Platforms
The application can be deployed to any platform that supports static sites with SPA routing:
- Netlify
- GitHub Pages
- AWS Amplify
- Cloudflare Pages

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Use TypeScript for type safety
- Place components in appropriate directories
- Use shadcn/ui components when possible
- Keep pages in the `src/pages/` directory
- Update routes in `src/App.tsx` when adding new pages
- Use Tailwind CSS for styling

## 📄 License

This project is private and proprietary.

## 👥 Authors

Built with ❤️ using [Dyad](https://dyad.sh) - AI-powered application development platform

## 🙏 Acknowledgments

- [React](https://react.dev) - The foundation of our UI
- [Vite](https://vitejs.dev) - Lightning-fast build tool
- [Supabase](https://supabase.com) - Backend infrastructure
- [shadcn/ui](https://ui.shadcn.com) - Beautiful component library
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
