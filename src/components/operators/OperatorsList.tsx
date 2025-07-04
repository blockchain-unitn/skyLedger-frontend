
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, TrendingUp, Shield, Award } from 'lucide-react';
import { getOperators } from '@/services/apiOperator';
import { Operator } from '@/types/apiTypes';
import { useState, useEffect } from 'react';

export const OperatorsList = () => {
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

  if (loading) return <div>Loading operators...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const getStatusColor = (registered: boolean) => {
    return registered ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Network Operators</h1>
        <p className="text-slate-600 mt-2">
          Manage and monitor operators participating in the UTM network
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Operators
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{operators.length}</div>
            <p className="text-xs text-slate-500 mt-1">
              Active in network
            </p>
          </CardContent>
        </Card>
        {/*<Card>

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Reputation Tokens
            </CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatTokens(totalTokens)}</div>
            <p className="text-xs text-slate-500 mt-1">
              Distributed tokens
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Average Rating
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{averageRating.toFixed(1)}</div>
            <p className="text-xs text-slate-500 mt-1">
              Out of 5.0
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Verified Operators
            </CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {operators.filter(op => op.status === 'verified' || op.status === 'premium').length}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Security compliant
            </p>
          </CardContent>
        </Card>*/}

      </div>

      {/* Operators Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={20} />
            Registered Operators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Operator</TableHead>
                <TableHead className="text-right">Reputation Tokens</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operators.map((operator) => (
                <TableRow key={operator.address} className="hover:bg-slate-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-slate-900">{operator.address}</div>
                      <div className="text-sm text-slate-500">
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Award size={14} className="text-green-600" />
                      <span className="font-semibold text-green-700">
                        {operator.reputationBalance.toLocaleString()}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

