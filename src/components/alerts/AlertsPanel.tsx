import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Bell, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { getViolations } from '@/services/apiAlert';
import { Alert } from '@/types/apiTypes';

export const AlertsPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getViolations();
        setAlerts(data);
      } catch (error) {
        console.error('Error fetching alerts', error);
        setError('Failed to load alerts');
        toast.error('Failed to load alerts');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const filteredAlerts = alerts.filter((alert) => {
    return (
      alert.droneID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.position?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000); // Assuming timestamp is in seconds
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Alerts & Violations</h1>
          <p className="text-slate-600 mt-2">Real-time monitoring of airspace violations</p>
        </div>
        <Button
          variant={soundEnabled ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSoundEnabled(!soundEnabled)}
        >
          <Bell size={16} className="mr-2" />
          {soundEnabled ? 'Sound On' : 'Sound Off'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Alerts</p>
                <p className="text-2xl font-bold text-red-600">{filteredAlerts.length}</p>
              </div>
              <AlertTriangle className="text-red-500" size={24} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total</p>
                <p className="text-2xl font-bold text-green-600">{alerts.length}</p>
              </div>
              <CheckCircle className="text-green-500" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <Input
              placeholder="Search by drone ID or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle>Violations List ({filteredAlerts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading alerts...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="space-y-4">
              {filteredAlerts.length === 0 ? (
                <div className="text-slate-500">No alerts found.</div>
              ) : (
                filteredAlerts.map((alert, idx) => (
                  <div key={idx} className="p-4 border rounded-lg transition-all hover:shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Drone ID</p>
                        <p className="font-mono text-blue-600">{alert.droneID}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Position</p>
                        <p className="font-medium">
                          {(() => {
                            // Esempio: "lat:45.4642,lng:9.1900" => "45.4642, 9.1900"
                            const match = alert.position.match(/lat:([-\d.]+),lng:([-\d.]+)/i);
                            return match ? `${match[1]}, ${match[2]}` : alert.position;
                          })()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Timestamp</p>
                        <p className="font-medium">{formatTimestamp(alert.timestamp)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 text-sm text-slate-500">
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};