import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { MapPin, Layers, Filter, Plane } from 'lucide-react';
import { MapContainer, TileLayer, Polygon, Tooltip } from 'react-leaflet';
import L from 'leaflet';

import { getZones } from '@/services/apiZone';
import { Zone, Boundary } from '@/types/apiTypes';
enum ZoneType {
  RURAL = 'RURAL',
  URBAN = 'URBAN',
  HOSPITALS = 'HOSPITALS',
  MILITARY = 'MILITARY',
  RESTRICTED = 'RESTRICTED',
}

const zoneTypeColors: Record<ZoneType, string> = {
  RURAL: 'bg-green-200 text-green-800',
  URBAN: 'bg-blue-200 text-blue-800',
  HOSPITALS: 'bg-pink-200 text-pink-800',
  MILITARY: 'bg-purple-200 text-purple-800',
  RESTRICTED: 'bg-orange-200 text-orange-800',
};
const zoneTypeCol: Record<ZoneType, { fillColor: string; color: string }> = {
  RURAL: { fillColor: '#bbf7d0', color: '#166534' },       // verde chiaro e bordo verde scuro
  URBAN: { fillColor: '#bfdbfe', color: '#1e40af' },       // blu chiaro e bordo blu scuro
  HOSPITALS: { fillColor: '#fbcfe8', color: '#be185d' },   // rosa chiaro e bordo rosa scuro
  MILITARY: { fillColor: '#ddd6fe', color: '#6b21a8' },    // viola chiaro e bordo viola scuro
  RESTRICTED: { fillColor: '#fed7aa', color: '#c2410c' },  // arancio chiaro e bordo arancio scuro
};


export const UTMMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [activeLayers, setActiveLayers] = useState<Record<ZoneType, boolean>>(() => {
    return {
      RURAL: true,
      URBAN: true,
      HOSPITALS: true,
      MILITARY: false,
      RESTRICTED: true,
    };
  });

  const [zones, setZones] = useState<Zone[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getZones();
        setZones(data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  // Toggle singolo layer
  const toggleLayer = (layer: ZoneType) => {
    setActiveLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  // Centra mappa su coordinate iniziali
  const center: [number, number] = [45.4641, 9.1919];
  const zoom = 12;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">UTM Airspace Map</h1>
          <p className="text-slate-600 mt-2">Monitor airspace zones</p>
        </div>
        <div className="flex items-center space-x-2">
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Controls */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Layers size={18} />
            <span>Map Layers</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Zone Types</h4>
            {Object.entries(activeLayers).map(([key, isActive]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded ${zoneTypeColors[key as ZoneType]}`}></div>
                  <span className="text-sm">{key}</span>
                </div>
                <Switch
                  checked={isActive}
                  onCheckedChange={() => toggleLayer(key as ZoneType)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: 400, width: 600 }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {zones.map((zone) => {
        if (!activeLayers[zone.zoneType]) return null;

        const positions = zone.boundaries.map(b => [b.latitude, b.longitude]) as [number, number][];

        return (
          <Polygon
            key={zone.id}
            positions={positions}
            pathOptions={{
              color: zoneTypeCol[zone.zoneType].fillColor,
              fillColor: zoneTypeCol[zone.zoneType].color,
              fillOpacity: 0.4,
              weight: zone.isActive ? 3 : 1,
              dashArray: zone.isActive ? '' : '4',
            }}
          >
            <Tooltip>
              <div>
                <strong>{zone.name}</strong><br />
                Type: {zone.zoneType}<br />
                Status: {zone.isActive ? 'Active' : 'Inactive'}<br />
                {zone.description}
                {/* Se mostri i boundaries, aggiungi key! */}
                {/* <ul>
                  {zone.boundaries.map((b, idx) => (
                    <li key={idx}>{b.latitude}, {b.longitude}</li>
                  ))}
                </ul> */}
              </div>
            </Tooltip>
          </Polygon>
        );
      })}
      </MapContainer>
    </div>

      {/* Zones */}
      <Card>
        <CardHeader>
          <CardTitle>Active Airspace Zones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {zones.map((zone) => (
              <div key={zone.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={zoneTypeColors[zone.zoneType] || 'bg-gray-200 text-gray-800'}>
                    {zone.zoneType}
                  </Badge>
                  {zone.isActive ? (
                    <Badge className="bg-green-100 text-green-700">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
                <h4 className="font-semibold text-slate-900">{zone.name}</h4>
                <p className="text-sm text-slate-600 mt-1">{zone.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
