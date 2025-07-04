
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Plane, 
  Map, 
  AlertTriangle, 
  ClipboardCheck,
  Users, 
  Activity,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navigationItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'drones', label: 'Certified Drones', icon: Plane },
  { id: 'map', label: 'UTM Map', icon: Map },
  { id: 'alerts', label: 'Alerts & Violations', icon: AlertTriangle },
  /*{ id: 'permissions', label: 'Flight Permissions', icon: ClipboardCheck },*/
  { id: 'logging', label: 'Route Logging', icon: FileText },
  { id: 'operators', label: 'Operators', icon: Users },
];

export const Sidebar = ({ activeSection, onSectionChange, collapsed, onToggleCollapse }: SidebarProps) => {
  return (
    <div className={cn(
      "bg-slate-900 text-white transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-blue-400">UTM Dashboard</h1>
              <p className="text-xs text-slate-400">Drone Traffic Management</p>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center px-4 py-3 text-left hover:bg-slate-800 transition-colors",
                isActive && "bg-blue-600 hover:bg-blue-700 border-r-2 border-blue-400"
              )}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        {!collapsed && (
          <div className="text-xs text-slate-400">
            <p>Connected to SkyLedgerBlockchain</p>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span>Blockchain Synced</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
