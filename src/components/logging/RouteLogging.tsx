import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Eye, MapPin, Clock, Route as RouteIcon } from 'lucide-react';

import { getRouteLoggings } from '@/services/apiRouteLogging';
import { RouteLoggings } from '@/types/apiTypes';

const statusLabels: Record<number, string> = {
  0: 'Normal',
  1: 'Deviated',
};

const statusColors: Record<number, string> = {
  0: 'bg-green-100 text-green-800',
  1: 'bg-yellow-100 text-yellow-800',
};

export const RouteLogging = () => {
  const [routeLogs, setRouteLogs] = useState<RouteLoggings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRoute, setSelectedRoute] = useState<RouteLoggings | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRouteLoggings();
        setRouteLogs(data);
      } catch (err) {
        setError('Failed to load route logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredRoutes = routeLogs.filter(route => {
    const matchesSearch =
      route.droneId.toString().includes(searchTerm) ||
      route.utmAuthorizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || route.status.toString() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const calculateDuration = (start: number, end?: number) => {
    if (!end) return 'In Progress';
    const duration = (end - start) / 60;
    return `${Math.round(duration)} min`;
  };

  // Stats
const normalCount = routeLogs.filter(r => r.status === 0).length;
const deviatedCount = routeLogs.filter(r => r.status !== 0).length;
const totalCount = routeLogs.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Route Logging</h1>
          <p className="text-slate-600 mt-2">Complete flight history and route analysis</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Normal</p>
                <p className="text-2xl font-bold text-green-600">{normalCount}</p>
              </div>
              <span className="text-green-500 text-2xl">✔️</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Deviated</p>
                <p className="text-2xl font-bold text-yellow-600">{deviatedCount}</p>
              </div>
              <span className="text-yellow-500 text-2xl">⚠️</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Routes</p>
                <p className="text-2xl font-bold text-blue-600">{totalCount}</p>
              </div>
              <RouteIcon className="text-blue-500" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <Input
                placeholder="Search by drone ID or authorizer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="0">Normal</option>
              <option value="1">Deviated</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Route Logs */}
      <div className="space-y-4">
        {filteredRoutes.map((route, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Badge className={statusColors[route.status]}>
                    {statusLabels[route.status] || 'Unknown'}
                  </Badge>
                  <span className="font-mono text-lg font-bold">Drone ID: {route.droneId}</span>
                  <span className="text-xs text-slate-500">UTM Authorizer: {route.utmAuthorizer}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedRoute(route)}
                >
                  <Eye size={14} className="mr-1" />
                  Details
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Route Information */}
                <div className="space-y-3">
                  <h4 className="font-medium text-slate-900">Route Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin size={14} className="text-green-600" />
                      <span className="font-medium">From:</span>
                      <span>
                        {route.startPoint.latitude.toFixed(4)}, {route.startPoint.longitude.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin size={14} className="text-red-600" />
                      <span className="font-medium">To:</span>
                      <span>
                        {route.endPoint.latitude.toFixed(4)}, {route.endPoint.longitude.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock size={14} className="text-blue-600" />
                      <span className="font-medium">Duration:</span>
                      <span>{calculateDuration(route.startTime, route.endTime)}</span>
                    </div>
                  </div>
                </div>

                {/* Route Path */}
                <div className="space-y-3">
                  <h4 className="font-medium text-slate-900">Route Path</h4>
                  <div className="space-y-1 text-xs font-mono">
                    {route.route.map((point, i) => (
                      <div key={i}>
                        {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Zones */}
                <div className="space-y-3">
                  <h4 className="font-medium text-slate-900">Zones</h4>
                  <div className="flex flex-wrap gap-1">
                    {route.zones.map((zone, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{zone}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedRoute && (
        <Dialog open={true} onOpenChange={() => setSelectedRoute(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Route Details - Drone #{selectedRoute.droneId}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Drone ID</label>
                  <p className="font-mono text-blue-600">{selectedRoute.droneId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Status</label>
                  <Badge className={statusColors[selectedRoute.status]}>
                    {statusLabels[selectedRoute.status] || 'Unknown'}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Start Time</label>
                  <p>{formatDateTime(selectedRoute.startTime)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">End Time</label>
                  <p>{selectedRoute.endTime ? formatDateTime(selectedRoute.endTime) : 'In Progress'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Start Point</label>
                  <p className="text-xs text-slate-500 font-mono">
                    {selectedRoute.startPoint.latitude.toFixed(4)}, {selectedRoute.startPoint.longitude.toFixed(4)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">End Point</label>
                  <p className="text-xs text-slate-500 font-mono">
                    {selectedRoute.endPoint.latitude.toFixed(4)}, {selectedRoute.endPoint.longitude.toFixed(4)}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">Zones</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedRoute.zones.map((zone, i) => (
                    <Badge key={i} variant="outline">{zone}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">Route Path</label>
                <div className="space-y-1 text-xs font-mono mt-2">
                  {selectedRoute.route.map((point, i) => (
                    <div key={i}>
                      {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};