import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issues in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const GpxMap = ({ fileUrl }) => {
  const [positions, setPositions] = useState([]);
  const [center, setCenter] = useState([40.416775, -3.703790]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGpx = async () => {
      try {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error('Failed to load GPX file');
        const text = await response.text();
        
        // Simple XML parsing
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        const trkpts = xmlDoc.getElementsByTagName("trkpt");
        
        const coords = [];
        for (let i = 0; i < trkpts.length; i++) {
          const lat = parseFloat(trkpts[i].getAttribute("lat"));
          const lon = parseFloat(trkpts[i].getAttribute("lon"));
          coords.push([lat, lon]);
        }

        if (coords.length > 0) {
          setPositions(coords);
          setCenter(coords[0]); // Center on start
        } else {
            setError("No track points found in GPX");
        }
        
      } catch (err) {
        console.error("Error parsing GPX:", err);
        setError(err.message);
      }
    };

    if (fileUrl) loadGpx();
  }, [fileUrl]);

  if (error) return <div className="error-message">Error loading GPX: {error}</div>;
  if (positions.length === 0) return <div className="loading-message">Loading GPX data...</div>;

  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={positions} color="blue" />
    </MapContainer>
  );
};

export default GpxMap;
