<div align="center">

# 🚀 Team Collaboration & Project Management Platform

### *Built with [Dyad](https://dyad.sh) - The Modern AI-Powered Development Platform*

<p align="center">
  <strong>A modern, feature-rich team collaboration and project management application built with React, TypeScript, and Supabase.</strong>
  <br>
  <em>Manage projects, tasks, documents, and track GitHub contributions all in one place.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.0.0-6366f1?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/Built_with-Dyad-8b5cf6?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMiA3TDEyIDEyTDIyIDdMMTIgMloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yIDEyTDEyIDE3TDIyIDEyIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+" alt="Dyad">
  <img src="https://img.shields.io/badge/React-18.3.1-61dafb?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.5.3-3178c6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Supabase-Backend-10b981?style=for-the-badge&logo=supabase" alt="Supabase">
  <img src="https://img.shields.io/badge/Vite-6.3.4-a855f7?style=for-the-badge&logo=vite" alt="Vite">
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-powered-by-dyad">Powered by Dyad</a> •
  <a href="#-deployment">Deployment</a>
</p>

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🏢 Team Management
- **Create and manage multiple teams** with customizable settings
- **Invite team members** with role-based access control
- **GitHub repository integration** for contribution tracking
- **Team workspace** with dedicated sections for projects, tasks, and documents

</td>
<td width="50%">

### 📊 Project Management
- **Project creation and tracking** with status updates
- **Deadline management** with upcoming deadline notifications
- **Project details** with comprehensive views
- **Team-specific project organization**

</td>
</tr>
<tr>
<td width="50%">

### ✅ Task Management
- **Create and assign tasks** to team members
- **Task status tracking** (To Do, In Progress, Done)
- **My Tasks view** for personalized task management
- **Task descriptions** with Markdown support

</td>
<td width="50%">

### 📁 Document Management
- **Upload and organize documents** within teams
- **Document versioning** and access control
- **Document detail views** with metadata
- **Markdown rendering** for documentation

</td>
</tr>
<tr>
<td width="50%">

### 📈 GitHub Contribution Tracking
- **Sync GitHub contributions** for team members
- **Visual contribution charts** using Recharts
- **Team contribution overview** with statistics
- **Repository linking** per team

</td>
<td width="50%">

### 🔍 Global Search
- **Command palette-style search** (Ctrl+K / ⌘K)
- **Search across teams, projects, tasks, and documents**
- **Smart categorization** and fuzzy matching
- **Keyboard navigation** for power users

</td>
</tr>
<tr>
<td colspan="2">

### 🎨 Modern UI/UX
- **Dark/Light theme** support with system preference detection
- **Responsive design** for mobile, tablet, and desktop
- **shadcn/ui components** for consistent design
- **Smooth animations** and transitions
- **Accessibility-first** approach

</td>
</tr>
</table>

---

## 💎 Powered by Dyad

<div align="center">

<img src="https://img.shields.io/badge/🚀_Accelerated_with-Dyad-8b5cf6?style=for-the-badge" alt="Powered by Dyad">

</div>

This project was **built and accelerated** using [**Dyad**](https://dyad.sh), an AI-powered development platform that revolutionizes how modern applications are created.

### Why Dyad?

<table>
<tr>
<td width="33%" align="center">

#### ⚡ **Rapid Development**
Dyad's AI assistance accelerated the development process, helping scaffold components, generate boilerplate code, and maintain consistent patterns across the entire application.

</td>
<td width="33%" align="center">

#### 🎯 **Best Practices**
Built-in architectural guidance ensured the project follows React and TypeScript best practices, with proper component structure, type safety, and performance optimizations.

</td>
<td width="33%" align="center">

#### 🔧 **Developer Experience**
Seamless integration with modern tools like Vite, TypeScript, and shadcn/ui, with intelligent code suggestions and automated workflow optimizations.

</td>
</tr>
</table>

### Dyad Features Used in This Project

- **🎨 Component Generation**: Leveraged Dyad to create consistent, reusable React components with TypeScript
- **🗂️ Project Scaffolding**: Used Dyad's intelligent scaffolding for optimal folder structure and file organization
- **🔗 Integration Setup**: Streamlined Supabase integration, authentication, and API setup
- **📝 Code Quality**: Maintained high code quality with Dyad's real-time suggestions and best practice enforcement
- **🎭 UI/UX Design**: Utilized Dyad's design system integration with shadcn/ui for cohesive, accessible interfaces
- **⚙️ Configuration Management**: Automated setup of ESLint, TypeScript, Tailwind CSS, and other tooling

<div align="center">

**[Learn more about Dyad →](https://dyad.sh)**

</div>

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **pnpm** (v8 or higher)
- **Supabase account** for backend services

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
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 🛠️ Tech Stack

<div align="center">

### **Cutting-Edge Technologies Powering This Platform**

</div>

<table>
<tr>
<td width="50%" valign="top">

### 🎨 Frontend
- **React 18.3.1** - UI library
- **TypeScript 5.5.3** - Type safety
- **Vite 6.3.4** - Build tool and dev server
- **React Router 6.26.2** - Client-side routing
- **TanStack Query 5.56.2** - Server state management

</td>
<td width="50%" valign="top">

### 🎭 UI Framework
- **shadcn/ui** - Component library
- **Radix UI** - Unstyled, accessible components
- **Tailwind CSS 3.4.11** - Utility-first CSS
- **Lucide React** - Icon library
- **next-themes** - Theme management

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🗄️ Backend & Database
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Storage for documents

</td>
<td width="50%" valign="top">

### 📊 Data Visualization
- **Recharts 2.12.7** - Charting library for contribution graphs

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 📋 Forms & Validation
- **React Hook Form 7.53.0** - Form management
- **Zod 3.23.8** - Schema validation
- **@hookform/resolvers** - Validation integration

</td>
<td width="50%" valign="top">

### 🔧 Additional Libraries
- **date-fns** - Date manipulation
- **react-markdown** - Markdown rendering
- **cmdk** - Command palette interface
- **sonner** - Toast notifications

</td>
</tr>
</table>

---

## 📁 Project Structure

```
jade-binturong-snore222/
├── public/                  # Static assets
│   └── robots.txt
├── src/
│   ├── components/         # Reusable components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── Layout.tsx     # Main layout wrapper
│   │   ├── Sidebar.tsx    # Navigation sidebar
│   │   ├── SearchDialog.tsx
│   │   ├── TeamSelector.tsx
│   │   └── ...
│   ├── context/           # React Context providers
│   │   └── AuthContext.tsx
│   ├── data/              # Mock data and constants
│   │   └── mockData.ts
│   ├── hooks/             # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   ├── use-team-selector.ts
│   │   └── use-toast.ts
│   ├── integrations/      # Third-party integrations
│   │   └── supabase/      # Supabase client setup
│   ├── lib/               # Utility functions
│   │   └── utils.ts
│   ├── pages/             # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Teams.tsx
│   │   ├── TeamProjects.tsx
│   │   └── ...
│   ├── utils/             # Helper utilities
│   │   └── toast.ts
│   ├── App.tsx            # Root component with routing
│   ├── main.tsx           # Application entry point
│   └── globals.css        # Global styles
├── supabase/              # Supabase functions
│   └── functions/
│       ├── github-proxy/
│       ├── send-team-invite/
│       └── sync-github-contributions/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

## 🎯 Available Scripts

<div align="center">

| Command | Description | Status |
|---------|-------------|--------|
| `pnpm dev` | 🚀 Start development server | ![Dev](https://img.shields.io/badge/dev-ready-10b981) |
| `pnpm build` | 📦 Build for production | ![Build](https://img.shields.io/badge/build-optimized-6366f1) |
| `pnpm build:dev` | 🔨 Build in development mode | ![Build Dev](https://img.shields.io/badge/build-dev-f59e0b) |
| `pnpm preview` | 👁️ Preview production build | ![Preview](https://img.shields.io/badge/preview-available-8b5cf6) |
| `pnpm lint` | ✅ Run ESLint | ![Lint](https://img.shields.io/badge/lint-configured-3b82f6) |

</div>

## 🔑 Key Features Explained

### Authentication
- Secure authentication via Supabase Auth
- Session management with AuthContext
- Protected routes with automatic redirects
- Login page with social auth options

### Team Workspaces
Each team has its own workspace with:
- Projects management
- Task tracking
- Document storage
- GitHub contribution analytics

### Search Functionality
- **Keyboard shortcut**: `Ctrl+K` (Windows/Linux) or `⌘K` (Mac)
- Real-time search across all data
- Categorized results
- Fuzzy matching algorithm
- See [SEARCH_FEATURE.md](./SEARCH_FEATURE.md) for details

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions
- Optimized for performance

## 🎨 Theme System

The application supports both light and dark themes:
- **System preference detection**
- **Manual theme switching**
- **Persistent theme selection**
- **CSS custom properties** for theming

## 🔒 Security

- Row-level security (RLS) in Supabase
- Authenticated API requests
- Secure token management
- Environment variable protection

## 📊 Database Schema

The application uses the following main tables:
- `teams` - Team information
- `team_members` - Team membership
- `projects` - Project data
- `tasks` - Task management
- `documents` - Document storage
- `github_contributions` - GitHub activity

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Manual Build
```bash
pnpm build
```
The build output will be in the `dist/` directory.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Guidelines

- Follow TypeScript best practices
- Use existing shadcn/ui components
- Write accessible components (ARIA labels, keyboard navigation)
- Keep components modular and reusable
- Follow the established folder structure
- See [AI_RULES.md](./AI_RULES.md) for detailed guidelines

## 🐛 Known Issues

- None currently reported

## 📈 Future Enhancements

- [ ] Real-time collaboration features
- [ ] Advanced task dependencies
- [ ] Time tracking
- [ ] Calendar integration
- [ ] Mobile app
- [ ] Advanced reporting and analytics
- [ ] Email notifications
- [ ] File preview for documents

## 📄 License

This project is private and proprietary.

## 👥 Authors

- Development Team

## 🙏 Acknowledgments

<div align="center">

### Special Thanks To

<table>
<tr>
<td align="center" width="25%">
<a href="https://dyad.sh">
<img src="https://img.shields.io/badge/🚀-Dyad-8b5cf6?style=for-the-badge" alt="Dyad"><br>
<sub><b>AI Development Platform</b></sub>
</a>
</td>
<td align="center" width="25%">
<a href="https://ui.shadcn.com">
<img src="https://img.shields.io/badge/🎨-shadcn/ui-000000?style=for-the-badge" alt="shadcn/ui"><br>
<sub><b>UI Component Library</b></sub>
</a>
</td>
<td align="center" width="25%">
<a href="https://lucide.dev">
<img src="https://img.shields.io/badge/🎭-Lucide-f97316?style=for-the-badge" alt="Lucide"><br>
<sub><b>Icon Library</b></sub>
</a>
</td>
<td align="center" width="25%">
<a href="https://supabase.com">
<img src="https://img.shields.io/badge/⚡-Supabase-10b981?style=for-the-badge" alt="Supabase"><br>
<sub><b>Backend Platform</b></sub>
</a>
</td>
</tr>
</table>

</div>

## 📞 Support

For support, please open an issue in the repository or contact the development team.

---

<div align="center">

### 💜 Made with passion using cutting-edge technology

<p>
<img src="https://img.shields.io/badge/Built_with-React-61dafb?style=flat-square&logo=react" alt="React">
<img src="https://img.shields.io/badge/Powered_by-TypeScript-3178c6?style=flat-square&logo=typescript" alt="TypeScript">
<img src="https://img.shields.io/badge/Backend-Supabase-10b981?style=flat-square&logo=supabase" alt="Supabase">
<img src="https://img.shields.io/badge/Accelerated_with-Dyad-8b5cf6?style=flat-square" alt="Dyad">
</p>

**🌟 Star this repo if you find it useful! 🌟**

<sub>Built in 2025 • Continuously Evolving • Open to Collaboration</sub>

</div>
