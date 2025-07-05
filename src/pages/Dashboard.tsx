
import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { DronesList } from '@/components/drones/DronesList';
import { UTMMap } from '@/components/map/UTMMap';
import { AlertsPanel } from '@/components/alerts/AlertsPanel';
import { FlightPermissions } from '@/components/permissions/FlightPermissions';
import { RouteLogging } from '@/components/logging/RouteLogging';
import { OperatorsList } from '@/components/operators/OperatorsList';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview />;
      case 'drones':
        return <DronesList />;
      case 'map':
        return <UTMMap />;
      case 'alerts':
        return <AlertsPanel />;
      case 'permissions':
        return <FlightPermissions />;
      case 'logging':
        return <RouteLogging />;
      case 'operators':
        return <OperatorsList />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto p-6">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
