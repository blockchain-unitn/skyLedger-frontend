import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye } from 'lucide-react';
import { DroneDetailModal } from './DroneDetailModal';
import { getDrones } from '@/services/apiDrone'; // Ensure this path is correct
import { Drone, DroneType, ZoneType, DroneStatus } from '@/types/apiTypes'; // Import enums directly

export const DronesList = () => {
  const [drones, setDrones] = useState<Drone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedDrone, setSelectedDrone] = useState<Drone | null>(null);

  useEffect(() => {
    const fetchDrones = async () => {
      try {
        const result = await getDrones();
        console.log("Drones API result:", result);
        setDrones(result);
      } catch (err) {
        console.error("Failed to fetch drones:", err); // More descriptive error logging
        setError('Failed to load drones');
      } finally {
        setLoading(false);
      }
    };

    fetchDrones();
  }, []);

  const filteredDrones = drones.filter((drone) => {
    // Safely get the permitted zones string, handling cases where it might be empty or undefined
    const permittedZonesString = (drone.permittedZones || [])
      .map((zone) => ZoneType[zone as ZoneType] || '') // Ensure type safety for enum access
      .join(' ')
      .toLowerCase();

    // Safely get the owner string, handling cases where ownerHistory might be empty or undefined
    const ownerString = (drone.ownerHistory && drone.ownerHistory.length > 0)
      ? drone.ownerHistory[drone.ownerHistory.length - 1].toLowerCase()
      : '';

    const matchesSearch =
      (drone.model || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      permittedZonesString.includes(searchTerm.toLowerCase()) ||
      ownerString.includes(searchTerm.toLowerCase());

    // Filter by droneType. The filterType from Select is a string, so convert drone.droneType to string for comparison.
    // Ensure drone.droneType is treated as a number for enum lookup if it's coming directly as 0, 1, 2...
    const matchesType =
      filterType === 'all' || drone.droneType.toString() === filterType;

    return matchesSearch && matchesType;
  });

  if (loading) return <div>Loading drones...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Function to determine badge color based on DroneType enum value
  const getTypeColor = (type: DroneType) => {
    switch (type) {
      case DroneType.CARGO: return 'bg-green-100 text-green-800';
      case DroneType.SURVEILLANCE: return 'bg-blue-100 text-blue-800';
      case DroneType.MEDICAL: return 'bg-purple-100 text-purple-800';
      case DroneType.MILITARY: return 'bg-yellow-100 text-yellow-800';
      case DroneType.AGRICULTURAL: return 'bg-orange-100 text-orange-800'; // Added
      case DroneType.RECREATIONAL: return 'bg-cyan-100 text-cyan-800';    // Added
      case DroneType.MAPPING: return 'bg-indigo-100 text-indigo-800';      // Added
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get ZoneType string from its numeric value
  const getZoneTypeName = (zoneValue: ZoneType): string => {
    // Ensure the value is a valid enum member, otherwise return 'Unknown'
    return ZoneType[zoneValue as ZoneType] || 'Unknown Zone';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Certified Drones</h1>
          <p className="text-slate-600 mt-2">Manage and monitor registered aircraft</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <Input
                placeholder="Search by model, permitted zones, or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Drone Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {/* Dynamically render SelectItems from DroneType enum */}
                {Object.keys(DroneType)
                  .filter((key) => isNaN(Number(key))) // Filter out numeric keys to get only string names
                  .map((key) => (
                    <SelectItem key={key} value={DroneType[key as keyof typeof DroneType].toString()}>
                      {key} {/* Display the string name of the enum */}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registered Aircraft ({filteredDrones.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-2 font-semibold text-slate-700">Model</th>
                  <th className="text-left py-3 px-2 font-semibold text-slate-700">Type</th>
                  <th className="text-left py-3 px-2 font-semibold text-slate-700">Permitted Zones</th>
                  <th className="text-left py-3 px-2 font-semibold text-slate-700">Current Owner</th>
                  <th className="text-left py-3 px-2 font-semibold text-slate-700">Certificates</th>
                  <th className="text-left py-3 px-2 font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrones.map((drone) => (
                  <tr
                    key={drone.tokenId}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedDrone(drone)}
                  >
                    <td className="py-4 px-2 font-medium">{drone.model}</td>
                    <td className="py-4 px-2">
                    <Badge className={getTypeColor(drone.droneType)}>
                      {typeof drone.droneType === 'number'
                        ? DroneType[drone.droneType]
                        : (Object.keys(DroneType).find(key => key.toLowerCase() === String(drone.droneType).toLowerCase()) || drone.droneType)}
                    </Badge>
                  </td>
                  <td className="py-4 px-2">
                    {(drone.permittedZones || [])
                      .map((zone) =>
                        typeof zone === 'number'
                          ? ZoneType[zone as ZoneType]
                          : (Object.keys(ZoneType).find(key => key.toLowerCase() === String(zone).toLowerCase()) || zone)
                      )
                      .join(', ')}
                  </td>
                    <td className="py-4 px-2">
                      {(drone.ownerHistory && drone.ownerHistory.length > 0)
                        ? drone.ownerHistory[drone.ownerHistory.length - 1]
                        : 'N/A'}
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex flex-wrap gap-1">
                        {(drone.certHashes || []).map((cert, i) => (
                          <Badge key={i} variant="secondary" className="text-xs truncate max-w-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <Badge
                        className={
                          (typeof drone.status === 'number'
                            ? DroneStatus[drone.status]
                            : (Object.keys(DroneStatus).find(key => key.toLowerCase() === String(drone.status).toLowerCase()) || drone.status)
                          ) === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {typeof drone.status === 'number'
                          ? DroneStatus[drone.status]
                          : (Object.keys(DroneStatus).find(key => key.toLowerCase() === String(drone.status).toLowerCase()) || drone.status)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedDrone && (
        <DroneDetailModal drone={selectedDrone} onClose={() => setSelectedDrone(null)} />
      )}
    </div>
  );
};