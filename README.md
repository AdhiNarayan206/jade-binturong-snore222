# Team Collaboration & Project Management Platform

A modern, feature-rich team collaboration and project management application built with React, TypeScript, and Supabase. This platform enables teams to manage projects, tasks, documents, and track GitHub contributions in an intuitive and beautiful interface.

## ✨ Features

### 🎯 Core Functionality
- **Team Management**: Create and manage multiple teams with member invitations
- **Project Tracking**: Organize projects with detailed descriptions, due dates, and status tracking
- **Task Management**: Create, assign, and track tasks across your team
- **Document Collaboration**: Share and manage team documents
- **GitHub Integration**: Track and sync GitHub contributions automatically
- **Real-time Updates**: Live data synchronization using Supabase
- **Search**: Powerful command palette-style search (⌘K / Ctrl+K) to quickly find anything

### 🎨 User Experience
- **Dark/Light Theme**: Seamless theme switching with persistence
- **Responsive Design**: Fully responsive layout for desktop, tablet, and mobile
- **Modern UI**: Beautiful interface built with shadcn/ui and Tailwind CSS
- **Keyboard Navigation**: Full keyboard shortcuts support for power users
- **Toast Notifications**: Real-time feedback for user actions

### 🔐 Authentication & Security
- **Supabase Auth**: Secure authentication with email/password
- **Row Level Security**: Database-level security policies
- **Protected Routes**: Automatic redirection for unauthorized access
- **Session Management**: Persistent login sessions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm package manager
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jade-binturong-snore222
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: React Context + TanStack Query
- **UI Components**: shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Date Handling**: date-fns
- **Markdown**: react-markdown + remark-gfm

### Backend & Database
- **Backend**: Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Edge Functions**: Deno (Supabase Functions)

### Development Tools
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Package Manager**: pnpm
- **Deployment**: Vercel

## 📁 Project Structure

```
jade-binturong-snore222/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui base components
│   │   ├── Layout.tsx    # Main layout wrapper
│   │   ├── Sidebar.tsx   # Navigation sidebar
│   │   └── SearchDialog.tsx # Search functionality
│   ├── pages/            # Route pages
│   │   ├── Dashboard.tsx
│   │   ├── Teams.tsx
│   │   ├── TeamProjects.tsx
│   │   ├── TeamTasks.tsx
│   │   ├── TeamDocuments.tsx
│   │   ├── Account.tsx
│   │   └── Login.tsx
│   ├── context/          # React context providers
│   │   └── AuthContext.tsx
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   │   └── supabase.ts   # Supabase client
│   ├── data/             # Mock data and constants
│   ├── utils/            # Helper functions
│   ├── App.tsx           # Main app component & routing
│   └── main.tsx          # Application entry point
├── supabase/
│   └── functions/        # Edge functions
│       ├── send-team-invite/
│       ├── sync-github-contributions/
│       └── github-proxy/
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## 🎯 Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Build in development mode
pnpm build:dev

# Preview production build
pnpm preview

# Run linter
pnpm lint
```

## 🔑 Key Features Explained

### Search Functionality
Press `⌘K` (Mac) or `Ctrl+K` (Windows/Linux) to open the search dialog. You can search across:
- Navigation pages
- Teams
- Projects
- Tasks
- Documents
- Team contributions

See [SEARCH_FEATURE.md](./SEARCH_FEATURE.md) for detailed documentation.

### Team Workspaces
Each team has its own workspace with dedicated sections for:
- **Projects**: View and manage team projects
- **Tasks**: Track team tasks and assignments
- **Documents**: Access team documentation
- **Contributions**: View GitHub contribution statistics

### GitHub Integration
The platform includes Supabase Edge Functions for:
- `github-proxy`: Proxies GitHub API requests
- `sync-github-contributions`: Syncs GitHub contribution data
- `send-team-invite`: Handles team invitation emails

## 🎨 Theming

The application supports both light and dark themes with automatic persistence. Theme settings are stored in localStorage and can be toggled from the theme selector in the navigation.

### Custom Theme Variables
Theme colors are defined in `src/globals.css` using CSS variables. You can customize the theme by modifying these variables.

## 🔒 Environment Variables

Required environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The `vercel.json` configuration is already set up for SPA routing.

### Other Platforms

You can deploy to any static hosting service:
1. Run `pnpm build`
2. Deploy the `dist` folder
3. Configure environment variables
4. Set up rewrites for SPA routing

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📝 Database Schema

The application uses the following main tables in Supabase:
- `teams` - Team information
- `team_members` - Team membership
- `projects` - Project data
- `tasks` - Task tracking
- `documents` - Document storage
- `github_contributions` - GitHub activity tracking

Refer to your Supabase project for the complete schema and RLS policies.

## 🐛 Troubleshooting

### Common Issues

**Search not working**
- Ensure you're logged in
- Verify you're a member of at least one team
- Check Supabase connection

**Build errors**
- Clear `node_modules` and reinstall: `rm -rf node_modules pnpm-lock.yaml && pnpm install`
- Check Node.js version (18+ required)

**Authentication issues**
- Verify environment variables are set correctly
- Check Supabase project status
- Clear browser cache and localStorage

## 📄 License

This project is created using the Dyad platform.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Powered by [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)

## 📞 Support

For issues and questions:
- Check existing documentation in the `/docs` folder
- Review [SEARCH_FEATURE.md](./SEARCH_FEATURE.md) for search functionality
- Open an issue in the repository

---

**Note**: This is a Dyad-generated application. Customize it to fit your team's needs!
