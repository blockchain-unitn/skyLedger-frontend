
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, AlertTriangle, Activity, Shield, Users } from 'lucide-react';
import { StatsChart } from './StatsChart';

import { getOperators} from '@/services/apiOperator';
import { getDrones} from '@/services/apiDrone';
import { getViolations } from '@/services/apiAlert';
import { Operator, Drone, Alert } from '@/types/apiTypes';
import { useState, useEffect } from 'react';

export const DashboardOverview = () => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegistered, setFilterRegistered] = useState<'all' | 'registered' | 'unregistered'>('all');
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);

useEffect(() => {
    const fetchOperators = async () => {
      try {
        const result = await getOperators();
        setOperators(result);
      } catch (err) {
        console.error(err);
        setError('Failed to load operators');
      } finally {
        setLoading(false);
      }
    };

    fetchOperators();
  }, []);

  const filteredOperators = operators.filter((operator) => {
    const matchesSearch = operator.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegistration =
      filterRegistered === 'all' ||
      (filterRegistered === 'registered' && operator.registered) ||
      (filterRegistered === 'unregistered' && !operator.registered);

    return matchesSearch && matchesRegistration;
  });
  
  const [drones, setDrones] = useState<Drone[]>([]);
    const [filterType, setFilterType] = useState('all');
    const [selectedDrone, setSelectedDrone] = useState<Drone | null>(null);
  
   useEffect(() => {
      const fetchDrones = async () => {
        try {
          const result = await getDrones();
          setDrones(result);
        } catch (err) {
          console.error(err);
          setError('Failed to load drones');
        } finally {
          setLoading(false);
        }
      };
  
      fetchDrones();
    }, []);
  
    const filteredDrones = drones.filter((drone) => {
      const matchesSearch =
        drone.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drone.permissions.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drone.ownerHistory.some(owner => owner.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType =
        filterType === 'all' || drone.droneType.toLowerCase() === filterType.toLowerCase();
  
      return matchesSearch && matchesType;
    });
    const getStatusColor = (droneType: string) => {
    switch (droneType.toLowerCase()) {
      case 'cargo': return 'bg-green-100 text-green-800';
      case 'surveillance': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await getViolations();
        setAlerts(data);
      } catch (error) {
        console.error('Error fetching alerts', error);
        toast.error('Failed to load alerts');
      }
    };

    fetchAlerts();
  }, []);

  const filteredAlerts = alerts.filter((alert) => {

    return (
      alert.droneID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.position.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Calcola il timestamp di 24 ore fa
const get24HoursAgoTimestamp = () => {
  const now = Math.floor(Date.now() / 1000); // timestamp attuale in secondi
  return now - 24 * 60 * 60;
};

const last24hTimestamp = get24HoursAgoTimestamp();

// Filtra gli alert delle ultime 24 ore
const alertsLast24h = alerts.filter(alert => alert.timestamp >= last24hTimestamp);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000); // Assuming timestamp is in seconds
    return date.toLocaleString();
  };


  const stats = [
    {
      title: 'Total Certified Drones',
      value: drones.length,
      change: '',
      icon: Plane,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Todays Violations',
      value: alertsLast24h.length,
      change: '',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Authorized Operators',
      value: operators.length,
      change: '',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];



  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">UTM Dashboard Overview</h1>
        <p className="text-slate-600 mt-2">Monitor drone traffic and manage aviation safety</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                    <p className="text-sm text-slate-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={stat.color} size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/*<Card>
          <CardHeader>
            <CardTitle>Flight Activity (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <StatsChart />
          </CardContent>
        </Card>*/}
        <Card>
        <CardHeader>
          <CardTitle>Recent Drone Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDrones.slice(-3).map((drone, index) => (
              <div
                key={index}
                className="flex flex-col items-start p-3 bg-slate-50 rounded-lg"
              >
                <div className="flex flex-row items-center gap-2 mb-1">
                  <Plane className="text-blue-500" size={18} />
                  <p className="font-medium text-slate-900">ID: {drone.tokenId}</p>
                </div>
                <p className="text-sm text-slate-600">Type: {drone.droneType}</p>
                <p className="text-sm text-slate-600">Model: {drone.model}</p>
                <p className="text-sm text-slate-600">
                  Current owner:{' '}
                  {drone.ownerHistory.length > 0 ? (
                    <Badge variant="outline" className="text-xs">
                      {drone.ownerHistory[drone.ownerHistory.length - 1]}
                    </Badge>
                  ) : (
                    'Unknown'
                  )}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
        <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAlerts.slice(-3).map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex flex-row items-center gap-2">
                  <AlertTriangle className="text-red-500" size={18} />
                  <p className="font-medium text-slate-900">ID: {alert.droneID}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">
                    {(() => {
                      const match = alert.position.match(/lat:([-\d.]+),lng:([-\d.]+)/i);
                      return match ? `${match[1]}, ${match[2]}` : alert.position;
                    })()}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{formatTimestamp(alert.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};
