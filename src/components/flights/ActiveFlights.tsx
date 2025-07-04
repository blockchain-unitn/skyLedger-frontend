
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plane, Clock, MapPin, Activity, PlayCircle, PauseCircle } from 'lucide-react';

interface ActiveFlight {
  id: string;
  droneId: string;
  flightStatus: 'preparing' | 'in_flight' | 'landing' | 'completed';
  plannedRoute: {
    startPoint: { lat: number; lng: number; name: string };
    endPoint: { lat: number; lng: number; name: string };
    waypoints: Array<{ lat: number; lng: number; order: number }>;
  };
  currentPosition?: { lat: number; lng: number; altitude: number };
  departureTime: {
    planned: string;
    actual?: string;
  };
  estimatedArrival: string;
  pilot: string;
  flightType: string;
  progress: number; // 0-100
}

const mockFlights: ActiveFlight[] = [
  {
    id: 'FLT-001',
    droneId: 'DRN-001',
    flightStatus: 'in_flight',
    plannedRoute: {
      startPoint: { lat: 40.7128, lng: -74.0060, name: 'Manhattan Helipad' },
      endPoint: { lat: 40.7580, lng: -73.9855, name: 'Central Park North' },
      waypoints: [
        { lat: 40.7300, lng: -73.9950, order: 1 },
        { lat: 40.7450, lng: -73.9800, order: 2 }
      ]
    },
    currentPosition: { lat: 40.7350, lng: -73.9900, altitude: 120 },
    departureTime: {
      planned: '2024-01-15T14:00:00Z',
      actual: '2024-01-15T14:03:00Z'
    },
    estimatedArrival: '2024-01-15T14:45:00Z',
    pilot: 'John Smith (License #PL-1234)',
    flightType: 'Commercial Survey',
    progress: 65
  },
  {
    id: 'FLT-002',
    droneId: 'DRN-045',
    flightStatus: 'preparing',
    plannedRoute: {
      startPoint: { lat: 40.6413, lng: -73.7781, name: 'JFK Airport Cargo' },
      endPoint: { lat: 40.7505, lng: -73.9934, name: 'Times Square' },
      waypoints: [
        { lat: 40.6800, lng: -73.8200, order: 1 },
        { lat: 40.7200, lng: -73.9500, order: 2 }
      ]
    },
    departureTime: {
      planned: '2024-01-15T15:30:00Z'
    },
    estimatedArrival: '2024-01-15T16:15:00Z',
    pilot: 'Sarah Johnson (License #PL-5678)',
    flightType: 'Emergency Response',
    progress: 0
  },
  {
    id: 'FLT-003',
    droneId: 'DRN-123',
    flightStatus: 'in_flight',
    plannedRoute: {
      startPoint: { lat: 40.7831, lng: -73.9712, name: 'Washington Heights' },
      endPoint: { lat: 40.7282, lng: -74.0776, name: 'Jersey City' },
      waypoints: [
        { lat: 40.7600, lng: -73.9900, order: 1 }
      ]
    },
    currentPosition: { lat: 40.7450, lng: -73.9850, altitude: 95 },
    departureTime: {
      planned: '2024-01-15T13:45:00Z',
      actual: '2024-01-15T13:47:00Z'
    },
    estimatedArrival: '2024-01-15T14:30:00Z',
    pilot: 'Mike Davis (License #PL-9012)',
    flightType: 'Infrastructure Inspection',
    progress: 82
  }
];

export const ActiveFlights = () => {
  const [flights, setFlights] = useState<ActiveFlight[]>(mockFlights);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredFlights = flights.filter(flight => {
    const matchesStatus = statusFilter === 'all' || flight.flightStatus === statusFilter;
    const matchesType = typeFilter === 'all' || flight.flightType.toLowerCase().includes(typeFilter.toLowerCase());
    
    return matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'in_flight': return 'bg-green-100 text-green-800';
      case 'landing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing': return PauseCircle;
      case 'in_flight': return PlayCircle;
      case 'landing': return PlayCircle;
      case 'completed': return PauseCircle;
      default: return PauseCircle;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTimeUntilDeparture = (plannedTime: string) => {
    const now = new Date();
    const planned = new Date(plannedTime);
    const diffInMinutes = Math.floor((planned.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffInMinutes > 0) {
      return `T-${diffInMinutes}m`;
    } else {
      return 'Overdue';
    }
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setFlights(prev => prev.map(flight => {
        if (flight.flightStatus === 'in_flight') {
          // Simulate progress increase
          const newProgress = Math.min(flight.progress + Math.random() * 2, 100);
          return { ...flight, progress: newProgress };
        }
        return flight;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const inFlightCount = flights.filter(f => f.flightStatus === 'in_flight').length;
  const preparingCount = flights.filter(f => f.flightStatus === 'preparing').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Active Flights</h1>
          <p className="text-slate-600 mt-2">Monitor live drone operations and flight status</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-600">Live Updates</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">In Flight</p>
                <p className="text-2xl font-bold text-green-600">{inFlightCount}</p>
              </div>
              <Activity className="text-green-500" size={24} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Preparing</p>
                <p className="text-2xl font-bold text-yellow-600">{preparingCount}</p>
              </div>
              <Clock className="text-yellow-500" size={24} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Today</p>
                <p className="text-2xl font-bold text-blue-600">24</p>
              </div>
              <Plane className="text-blue-500" size={24} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg Duration</p>
                <p className="text-2xl font-bold text-purple-600">42m</p>
              </div>
              <Clock className="text-purple-500" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Flight Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="in_flight">In Flight</SelectItem>
                <SelectItem value="landing">Landing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Flight Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="survey">Survey</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Flights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredFlights.map((flight) => {
          const StatusIcon = getStatusIcon(flight.flightStatus);
          
          return (
            <Card key={flight.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-3">
                    <StatusIcon className="text-blue-600" size={24} />
                    <span>{flight.droneId}</span>
                    <Badge className={getStatusColor(flight.flightStatus)}>
                      {flight.flightStatus.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </CardTitle>
                  <Badge variant="outline">{flight.flightType}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Route Information */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin size={14} className="text-green-600" />
                      <span className="font-medium">From:</span>
                    </div>
                    <span>{flight.plannedRoute.startPoint.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin size={14} className="text-red-600" />
                      <span className="font-medium">To:</span>
                    </div>
                    <span>{flight.plannedRoute.endPoint.name}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                {flight.flightStatus === 'in_flight' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Flight Progress</span>
                      <span>{Math.round(flight.progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${flight.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Current Position */}
                {flight.currentPosition && (
                  <div className="bg-slate-50 rounded-lg p-3">
                    <h4 className="text-sm font-medium mb-2">Current Position</h4>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-slate-600">Lat:</span>
                        <p className="font-mono">{flight.currentPosition.lat.toFixed(4)}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Lng:</span>
                        <p className="font-mono">{flight.currentPosition.lng.toFixed(4)}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Alt:</span>
                        <p className="font-mono">{flight.currentPosition.altitude}ft</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timing Information */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Departure:</span>
                    <p className="font-medium">
                      {flight.departureTime.actual 
                        ? formatTime(flight.departureTime.actual)
                        : flight.flightStatus === 'preparing' 
                          ? getTimeUntilDeparture(flight.departureTime.planned)
                          : formatTime(flight.departureTime.planned)
                      }
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600">ETA:</span>
                    <p className="font-medium">{formatTime(flight.estimatedArrival)}</p>
                  </div>
                </div>

                {/* Pilot Information */}
                <div className="text-sm">
                  <span className="text-slate-600">Pilot:</span>
                  <p className="font-medium">{flight.pilot}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <Button size="sm" variant="outline">
                    <MapPin size={14} className="mr-1" />
                    Track on Map
                  </Button>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
