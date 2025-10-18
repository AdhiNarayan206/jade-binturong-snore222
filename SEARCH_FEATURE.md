# Search Functionality Documentation

## Overview
The search functionality has been added to the application, providing a powerful command palette-style search interface that matches your site's theme and integrates seamlessly with your existing design system.

## Features

### 🔍 What You Can Search
- **Navigation Pages**: Dashboard, Teams Overview, Account
- **Workspace Items**: Projects, Tasks, Documents, Contributions (team-specific)
- **Teams**: All teams you're a member of
- **Projects**: Search by project name or description
- **Tasks**: Search by task title or description
- **Documents**: Search by document title or description
- **Resources**: GitHub linking, Help & Support

### ⌨️ How to Use

#### Opening the Search Dialog
1. **Click the Search Icon** in the sidebar (top section, next to the pencil icon)
2. **Keyboard Shortcut**: Press `Ctrl+K` (Windows/Linux) or `⌘K` (Mac)

#### Searching
1. Type your query in the search input
2. Results are automatically filtered and categorized
3. Use arrow keys to navigate results
4. Press Enter or click to select an item

#### Features
- **Real-time Search**: Results update as you type
- **Smart Categorization**: Results grouped by type (Navigation, Workspace, Teams, Projects, etc.)
- **Fuzzy Matching**: Searches across names and descriptions
- **Keyboard Navigation**: Full keyboard support for power users
- **Theme Integration**: Matches both light and dark themes

## Technical Details

### Components Created

#### 1. `SearchDialog.tsx`
Main search component with the following capabilities:
- Integrates with Supabase for real-time data fetching
- Uses React Query for efficient data caching
- Supports keyboard shortcuts (Ctrl+K / ⌘K)
- Filters and categorizes search results
- Handles navigation to different pages/resources

### Key Technologies
- **cmdk**: Command palette library for the search UI
- **@tanstack/react-query**: For data fetching and caching
- **react-router-dom**: For navigation
- **@supabase/supabase-js**: For database queries
- **Radix UI**: For accessible dialog components

### Integration Points

#### Sidebar Component
The search button is located in the sidebar with:
- Visual search icon
- Tooltip showing keyboard shortcut (⌘K)
- Click handler to open the search dialog
- State management for dialog open/close

#### Database Queries
Searches are performed on:
- `teams` table (filtered by user membership)
- `projects` table (filtered by team)
- `tasks` table (filtered by team)
- `documents` table (filtered by team)

All queries use case-insensitive search with the `ilike` operator.

## Styling

### Theme Compatibility
The search dialog automatically adapts to:
- **Light Theme**: Clean, bright interface with subtle shadows
- **Dark Theme**: Dark background with appropriate contrast
- **Sidebar Colors**: Uses CSS variables defined in `globals.css`

### CSS Variables Used
```css
--background
--foreground
--popover
--popover-foreground
--muted
--muted-foreground
--accent
--accent-foreground
--border
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` / `⌘K` | Open/Close search dialog |
| `↑` `↓` | Navigate results |
| `Enter` | Select highlighted result |
| `Esc` | Close dialog |

## Performance Considerations

1. **Lazy Loading**: Search queries only execute when dialog is open
2. **Result Limiting**: Maximum 5 results per category to prevent overload
3. **Debouncing**: Search input is debounced via cmdk
4. **Caching**: React Query caches results for better performance
5. **Team Filtering**: Results are automatically filtered by selected team

## Accessibility

- Full keyboard navigation support
- ARIA labels and roles from Radix UI
- Focus management within dialog
- Screen reader friendly
- Semantic HTML structure

## Future Enhancements

Potential improvements:
- Recent searches history
- Search result highlighting
- Advanced filters (by status, date, assignee)
- Search analytics
- File content search
- Global keyboard shortcuts for specific actions

## Troubleshooting

### Search returns no results
- Ensure you're logged in
- Check if you're a member of at least one team
- Verify database permissions in Supabase
- Check browser console for errors

### Keyboard shortcut not working
- Ensure focus is on the application window
- Check for conflicting browser extensions
- Try clicking the search button instead

### Styling issues
- Clear browser cache
- Check if theme is properly loaded
- Verify CSS variables in `globals.css`

## Maintenance

### Files Modified
- `src/components/Sidebar.tsx` - Added search button and dialog integration
- `src/components/SearchDialog.tsx` - New search dialog component

### Dependencies
No new dependencies were added. All required packages were already in your `package.json`:
- `cmdk`
- `@radix-ui/react-dialog`
- `@tanstack/react-query`
- `@supabase/supabase-js`

## Code Quality

✅ No existing code was destroyed or removed
✅ Follows existing code patterns and conventions
✅ Uses existing UI components and styling system
✅ TypeScript types properly defined
✅ Error handling implemented
✅ Responsive and accessible design
