
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight,
  Vote,
  User,
  Users,
  Calendar,
  Settings,
  Plus,
  List,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, isAdmin, isCandidate, isVoter, logout } = useAuth();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside 
      className={cn(
        "flex h-screen flex-col border-r bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Sidebar Header with Logo */}
      <div className="flex h-16 items-center justify-between border-b p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Vote className="h-6 w-6 text-vote-primary" />
            <span className="font-semibold text-lg">BallotBox</span>
          </div>
        )}
        {collapsed && <Vote className="h-6 w-6 mx-auto text-vote-primary" />}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className={cn("hidden md:flex", collapsed && "mx-auto")}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {/* User Profile Section */}
      <div className={cn(
        "flex items-center border-b p-4",
        collapsed ? "justify-center" : "justify-start"
      )}>
        <div className="h-10 w-10 rounded-full bg-vote-light flex items-center justify-center text-vote-primary font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        {!collapsed && (
          <div className="ml-3 overflow-hidden">
            <p className="truncate font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          <NavItem
            to="/app"
            icon={<List />}
            label="Dashboard"
            collapsed={collapsed}
            end
          />

          <NavItem
            to="/app/elections"
            icon={<Calendar />}
            label="Elections"
            collapsed={collapsed}
          />

          {isAdmin() && (
            <NavItem
              to="/app/elections/create"
              icon={<Plus />}
              label="Create Election"
              collapsed={collapsed}
            />
          )}

          {isCandidate() && (
            <NavItem
              to={`/app/candidates/${user?.id}`}
              icon={<User />}
              label="My Profile"
              collapsed={collapsed}
            />
          )}

          {isAdmin() && (
            <NavItem
              to="/app/settings"
              icon={<Settings />}
              label="Settings"
              collapsed={collapsed}
            />
          )}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="border-t p-4">
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start",
            collapsed && "justify-center px-0"
          )}
          onClick={logout}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          {!collapsed && "Logout"}
        </Button>
      </div>
    </aside>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  end?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, collapsed, end }) => {
  return (
    <li>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          cn(
            "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
            collapsed ? "justify-center px-0" : "justify-start"
          )
        }
      >
        <span className={cn("h-5 w-5", !collapsed && "mr-2")}>{icon}</span>
        {!collapsed && <span>{label}</span>}
      </NavLink>
    </li>
  );
};

export default Sidebar;
