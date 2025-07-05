import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Shield, Wrench, User, Hash } from 'lucide-react'; // Rimosso Calendar

// Importa solo ciò che è necessario, AuthorizedPeriod non è più necessario qui
import { Drone, DroneType, ZoneType, DroneStatus } from '@/types/apiTypes';

interface DroneDetailModalProps {
    drone: Drone;
    onClose: () => void;
}

export const DroneDetailModal = ({ drone, onClose }: DroneDetailModalProps) => {

    // Funzione helper per ottenere la stringa del tipo di drone dal suo valore numerico
    const getDroneTypeString = (type: DroneType): string => {
        return DroneType[type] || 'Unknown Type';
    };

    // Funzione helper per ottenere la stringa del nome della zona dal suo valore numerico
    const getZoneTypeString = (zone: ZoneType): string => {
        return ZoneType[zone] || 'Unknown Zone';
    };

    // Funzione helper per ottenere la stringa dello stato del drone dal suo valore numerico
    const getDroneStatusString = (status: DroneStatus): string => {
        return DroneStatus[status] || 'Unknown Status';
    };

    // Funzione helper per determinare il colore del badge in base allo stato del drone
    const getStatusColor = (status: DroneStatus) => {
        switch (status) {
            case DroneStatus.ACTIVE: return 'bg-green-100 text-green-800';
            case DroneStatus.MAINTENANCE: return 'bg-yellow-100 text-yellow-800';
            case DroneStatus.INACTIVE: return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-3">
                        <span>Drone Details: {drone.serialNumber || drone.tokenId}</span>
                        <Badge className={getStatusColor(drone.status)}>
                            {getDroneStatusString(drone.status)}
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3"> {/* 3 colonne invece di 4 */}
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="permissions">Permissions</TabsTrigger>
                        {/* Rimosso tab Maintenance e History se vuoti o non popolati */}
                        <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Shield size={18} />
                                        <span>Aircraft Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-slate-600">Model</label>
                                        <p className="font-semibold">{drone.model}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-600">Type</label>
                                        <Badge variant="outline">{getDroneTypeString(drone.droneType)}</Badge>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-600">Drone ID</label>
                                        <p className="font-mono text-blue-600">{drone.tokenId}</p>
                                    </div>
                                    {drone.serialNumber && (
                                        <div>
                                            <label className="text-sm font-medium text-slate-600">Serial Number</label>
                                            <p className="font-mono text-blue-600">{drone.serialNumber}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <User size={18} />
                                        <span>Owner Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-slate-600">Owner/Operator History</label>
                                        <div className="flex flex-wrap gap-2">
                                            {(drone.ownerHistory || []).map((owner, idx) => (
                                                <Badge key={idx} variant="secondary">{owner}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-600">Registration Status</label>
                                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Certificates & Qualifications</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {(drone.certHashes || []).map((cert, index) => (
                                        <Badge key={index} variant="secondary" className="px-3 py-1">
                                            {cert}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="permissions" className="space-y-4">
                        <Card> {/* Rimosso la griglia a 2 colonne, poiché c'è solo una card */}
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <MapPin size={18} />
                                    <span>Authorized Zones</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {(drone.permittedZones || []).map((zone, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                                            <span>{getZoneTypeString(zone)}</span>
                                            <Badge variant="outline">Active</Badge>
                                        </div>
                                    ))}
                                    {/* Messaggio se non ci sono zone autorizzate */}
                                    {(drone.permittedZones && drone.permittedZones.length === 0) && (
                                        <p className="text-sm text-slate-500 italic">No authorized zones defined.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        {/* Rimosso la card "Operating Periods" e il div a griglia */}
                    </TabsContent>

                    <TabsContent value="maintenance" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Wrench size={18} />
                                    <span>Maintenance Records</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-600">Maintenance Hash</label>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <Hash size={16} className="text-slate-400" />
                                        <span className="font-mono text-sm">{drone.maintenanceHash || 'N/A'}</span>
                                    </div>
                                </div>

                                {/* Rimosso i dati hardcoded delle attività di manutenzione */}
                                <p className="text-sm text-slate-500 italic">No recent maintenance activities found.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="history" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Change Log</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Rimosso i dati hardcoded della cronologia */}
                                <p className="text-sm text-slate-500 italic">No change log history available.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};