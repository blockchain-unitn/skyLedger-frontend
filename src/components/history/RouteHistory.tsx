
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Download, Eye, Hash, Calendar, Plane } from 'lucide-react';

interface RouteChangeRecord {
  id: string;
  droneId: string;
  blockNumber: number;
  transactionHash: string;
  changeType: 'route_update' | 'zone_authorization' | 'permission_change' | 'registration' | 'maintenance';
  timestamp: string;
  details: any;
  oldValue?: any;
  newValue?: any;
}

const mockRecords: RouteChangeRecord[] = [
  {
    id: 'REC-001',
    droneId: 'DRN-001',
    blockNumber: 12548790,
    transactionHash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f',
    changeType: 'route_update',
    timestamp: '2024-01-15T14:30:00Z',
    details: {
      routeId: 'RT-2024-001',
      startPoint: { lat: 40.7128, lng: -74.0060 },
      endPoint: { lat: 40.7580, lng: -73.9855 },
      waypoints: 3,
      estimatedDuration: '45 minutes'
    },
    oldValue: {
      endPoint: { lat: 40.7505, lng: -73.9934 }
    },
    newValue: {
      endPoint: { lat: 40.7580, lng: -73.9855 }
    }
  },
  {
    id: 'REC-002',
    droneId: 'DRN-045',
    blockNumber: 12548756,
    transactionHash: '0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g',
    changeType: 'zone_authorization',
    timestamp: '2024-01-15T12:15:00Z',
    details: {
      authorizedZone: 'Emergency Zone 1',
      authorizationType: 'Temporary',
      validUntil: '2024-01-20T23:59:59Z',
      reason: 'Emergency response training'
    }
  },
  {
    id: 'REC-003',
    droneId: 'DRN-123',
    blockNumber: 12548690,
    transactionHash: '0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h',
    changeType: 'permission_change',
    timestamp: '2024-01-15T10:45:00Z',
    details: {
      permission: 'Night Operations',
      action: 'Added',
      certificationRequired: 'Part 107 Night Waiver',
      effectiveDate: '2024-01-15T00:00:00Z'
    }
  },
  {
    id: 'REC-004',
    droneId: 'DRN-078',
    blockNumber: 12548623,
    transactionHash: '0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i',
    changeType: 'maintenance',
    timestamp: '2024-01-15T08:20:00Z',
    details: {
      maintenanceType: 'Routine Inspection',
      performedBy: 'Certified Technician #CT-045',
      maintenanceHash: '0xmaint123456789',
      nextDueDate: '2024-07-15T00:00:00Z',
      status: 'Completed'
    }
  }
];

export const RouteHistory = () => {
  const [records] = useState<RouteChangeRecord[]>(mockRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [changeTypeFilter, setChangeTypeFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<RouteChangeRecord | null>(null);

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.droneId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.transactionHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.changeType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = changeTypeFilter === 'all' || record.changeType === changeTypeFilter;
    
    return matchesSearch && matchesType;
  });

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'route_update': return 'bg-blue-100 text-blue-800';
      case 'zone_authorization': return 'bg-green-100 text-green-800';
      case 'permission_change': return 'bg-purple-100 text-purple-800';
      case 'registration': return 'bg-orange-100 text-orange-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChangeTypeLabel = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const exportData = () => {
    const dataStr = JSON.stringify(filteredRecords, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `route_history_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Route & Zone Change History</h1>
          <p className="text-slate-600 mt-2">Complete blockchain transaction log of all airspace changes</p>
        </div>
        <Button onClick={exportData} className="flex items-center space-x-2">
          <Download size={16} />
          <span>Export History</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Records</p>
                <p className="text-2xl font-bold text-slate-900">{records.length}</p>
              </div>
              <Hash className="text-slate-500" size={24} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Today's Changes</p>
                <p className="text-2xl font-bold text-blue-600">8</p>
              </div>
              <Calendar className="text-blue-500" size={24} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Route Updates</p>
                <p className="text-2xl font-bold text-green-600">15</p>
              </div>
              <Plane className="text-green-500" size={24} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Latest Block</p>
                <p className="text-xl font-bold text-purple-600">12,548,790</p>
              </div>
              <Hash className="text-purple-500" size={24} />
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
                placeholder="Search by drone ID, transaction hash, or change type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={changeTypeFilter} onValueChange={setChangeTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Change Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="route_update">Route Updates</SelectItem>
                <SelectItem value="zone_authorization">Zone Authorization</SelectItem>
                <SelectItem value="permission_change">Permission Changes</SelectItem>
                <SelectItem value="registration">Registration</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* History Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Change History ({filteredRecords.length} records)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRecords.map((record, index) => (
              <div key={record.id} className="relative">
                {/* Timeline line */}
                {index < filteredRecords.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-slate-200"></div>
                )}
                
                <div className="flex items-start space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Hash className="text-blue-600" size={20} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Badge className={getChangeTypeColor(record.changeType)}>
                          {getChangeTypeLabel(record.changeType)}
                        </Badge>
                        <span className="font-mono text-sm text-blue-600">{record.droneId}</span>
                        <span className="text-sm text-slate-500">{formatTimestamp(record.timestamp)}</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedRecord(record)}
                      >
                        <Eye size={14} className="mr-1" />
                        Details
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600">Block Number</p>
                        <p className="font-mono">{record.blockNumber.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Transaction Hash</p>
                        <p className="font-mono text-xs text-blue-600 truncate">
                          {record.transactionHash}
                        </p>
                      </div>
                    </div>
                    
                    {/* Preview of change details */}
                    <div className="mt-2 p-2 bg-slate-50 rounded text-sm">
                      {record.changeType === 'route_update' && (
                        <p>Route updated with {record.details.waypoints} waypoints, estimated duration: {record.details.estimatedDuration}</p>
                      )}
                      {record.changeType === 'zone_authorization' && (
                        <p>Authorized for {record.details.authorizedZone} - {record.details.authorizationType} access</p>
                      )}
                      {record.changeType === 'permission_change' && (
                        <p>{record.details.action} permission: {record.details.permission}</p>
                      )}
                      {record.changeType === 'maintenance' && (
                        <p>{record.details.maintenanceType} completed by {record.details.performedBy}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedRecord && (
        <Dialog open={true} onOpenChange={() => setSelectedRecord(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Change Record Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Record ID</label>
                  <p className="font-mono">{selectedRecord.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Drone ID</label>
                  <p className="font-mono text-blue-600">{selectedRecord.droneId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Block Number</label>
                  <p className="font-mono">{selectedRecord.blockNumber.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Timestamp</label>
                  <p>{formatTimestamp(selectedRecord.timestamp)}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-600">Transaction Hash</label>
                <p className="font-mono text-sm bg-slate-100 p-2 rounded break-all">
                  {selectedRecord.transactionHash}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-600">Change Details</label>
                <pre className="text-sm bg-slate-100 p-4 rounded overflow-x-auto">
                  {JSON.stringify(selectedRecord.details, null, 2)}
                </pre>
              </div>
              
              {selectedRecord.oldValue && selectedRecord.newValue && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Previous Value</label>
                    <pre className="text-sm bg-red-50 p-3 rounded">
                      {JSON.stringify(selectedRecord.oldValue, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">New Value</label>
                    <pre className="text-sm bg-green-50 p-3 rounded">
                      {JSON.stringify(selectedRecord.newValue, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
