
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Eye, CheckCircle, XCircle, Clock, Plane } from 'lucide-react';
import { getFlightPermissions } from '@/services/flightPerm';

interface FlightPermissionRequest {
  id: string;
  droneId: string;
  requestedZones: string[];
  requestDate: string;
  flightDate: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  operator: string;
  flightPurpose: string;
  estimatedDuration: string;
}

const mockPermissions: FlightPermissionRequest[] = [
  {
    id: 'FPR-001',
    droneId: 'DRN-001',
    requestedZones: ['URBAN', 'HOSPITALS'],
    requestDate: '2024-01-15T10:00:00Z',
    flightDate: '2024-01-16T14:00:00Z',
    status: 'approved',
    operator: 'John Smith',
    flightPurpose: 'Medical Supply Delivery',
    estimatedDuration: '45 minutes'
  },
  {
    id: 'FPR-002',
    droneId: 'DRN-045',
    requestedZones: ['RESTRICTED', 'MILITARY'],
    requestDate: '2024-01-15T09:30:00Z',
    flightDate: '2024-01-15T16:00:00Z',
    status: 'rejected',
    rejectionReason: 'Insufficient security clearance for military zone access',
    operator: 'Sarah Johnson',
    flightPurpose: 'Security Patrol',
    estimatedDuration: '2 hours'
  },
  {
    id: 'FPR-003',
    droneId: 'DRN-123',
    requestedZones: ['COMMERCIAL', 'URBAN'],
    requestDate: '2024-01-15T11:15:00Z',
    flightDate: '2024-01-17T10:00:00Z',
    status: 'pending',
    operator: 'Mike Davis',
    flightPurpose: 'Infrastructure Inspection',
    estimatedDuration: '1.5 hours'
  },
  {
    id: 'FPR-004',
    droneId: 'DRN-089',
    requestedZones: ['URBAN', 'PARKS'],
    requestDate: '2024-01-15T08:45:00Z',
    flightDate: '2024-01-16T09:00:00Z',
    status: 'approved',
    operator: 'Lisa Chen',
    flightPurpose: 'Event Coverage',
    estimatedDuration: '3 hours'
  }
];

export const FlightPermissions = () => {
  const [permissions] = useState<FlightPermissionRequest[]>(mockPermissions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPermission, setSelectedPermission] = useState<FlightPermissionRequest | null>(null);

  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.droneId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.flightPurpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || permission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const approvedCount = permissions.filter(p => p.status === 'approved').length;
  const pendingCount = permissions.filter(p => p.status === 'pending').length;
  const rejectedCount = permissions.filter(p => p.status === 'rejected').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Flight Permissions</h1>
          <p className="text-slate-600 mt-2">Manage drone flight authorization requests</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <CheckCircle className="text-green-500" size={24} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Clock className="text-yellow-500" size={24} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
              </div>
              <XCircle className="text-red-500" size={24} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Requests</p>
                <p className="text-2xl font-bold text-blue-600">{permissions.length}</p>
              </div>
              <Plane className="text-blue-500" size={24} />
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
                placeholder="Search by drone ID, operator, or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Permissions List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPermissions.map((permission) => {
          const StatusIcon = getStatusIcon(permission.status);
          
          return (
            <Card key={permission.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-3">
                    <StatusIcon className="text-blue-600" size={24} />
                    <span>{permission.droneId}</span>
                    <Badge className={getStatusColor(permission.status)}>
                      {permission.status.toUpperCase()}
                    </Badge>
                  </CardTitle>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedPermission(permission)}
                  >
                    <Eye size={14} className="mr-1" />
                    Details
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Operator:</span>
                    <p className="font-medium">{permission.operator}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Flight Date:</span>
                    <p className="font-medium">{formatDateTime(permission.flightDate)}</p>
                  </div>
                </div>

                <div>
                  <span className="text-slate-600">Purpose:</span>
                  <p className="font-medium">{permission.flightPurpose}</p>
                </div>

                <div>
                  <span className="text-slate-600">Requested Zones:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {permission.requestedZones.map((zone, index) => (
                      <Badge key={index} variant="outline">{zone}</Badge>
                    ))}
                  </div>
                </div>

                {permission.status === 'rejected' && permission.rejectionReason && (
                  <div className="bg-red-50 p-3 rounded-lg">
                    <span className="text-red-600 font-medium">Rejection Reason:</span>
                    <p className="text-red-700 text-sm mt-1">{permission.rejectionReason}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedPermission && (
        <Dialog open={true} onOpenChange={() => setSelectedPermission(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Flight Permission Details - {selectedPermission.id}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Drone ID</label>
                  <p className="font-mono text-blue-600">{selectedPermission.droneId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Status</label>
                  <Badge className={getStatusColor(selectedPermission.status)}>
                    {selectedPermission.status.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Operator</label>
                  <p>{selectedPermission.operator}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Duration</label>
                  <p>{selectedPermission.estimatedDuration}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-600">Flight Purpose</label>
                <p>{selectedPermission.flightPurpose}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-600">Requested Zones</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedPermission.requestedZones.map((zone, index) => (
                    <Badge key={index} variant="outline">{zone}</Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Request Date</label>
                  <p>{formatDateTime(selectedPermission.requestDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Flight Date</label>
                  <p>{formatDateTime(selectedPermission.flightDate)}</p>
                </div>
              </div>

              {selectedPermission.rejectionReason && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Rejection Reason</label>
                  <div className="bg-red-50 p-3 rounded mt-1">
                    <p className="text-red-700">{selectedPermission.rejectionReason}</p>
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
