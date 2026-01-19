import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import parseGeoraster from 'georaster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import from local vendor file using require for compatibility
const GeoRasterLayer = require('../vendor/GeoRasterLayer');

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 600);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

const GeotiffMap = ({ fileUrl }) => {
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const loadGeotiff = async () => {
      try {
        console.log("Loading GeoTIFF from:", fileUrl);
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);
        const arrayBuffer = await response.arrayBuffer();
        
        const georaster = await parseGeoraster(arrayBuffer);
        console.log("GeoRaster parsed:", georaster);

        const layer = new GeoRasterLayer({
          georaster: georaster,
          opacity: 0.7,
          // Custom color scale for "Severidad" (Severity) usually Fire-like or Red-ish
          pixelValuesToColorFn: values => {
            const val = values[0];
            if (val === 0 || isNaN(val)) return null;
            // Simple thermal-like styling assumption for severity
            if (val < 0.2) return '#2c7bb6';
            if (val < 0.4) return '#abd9e9';
            if (val < 0.6) return '#ffffbf';
            if (val < 0.8) return '#fdae61';
            return '#d7191c';
          },
          resolution: 64 // Optional: adjust for performance
        });

        if (mapRef.current) {
           layer.addTo(mapRef.current);
           mapRef.current.fitBounds(layer.getBounds());
        }

      } catch (err) {
        console.error("Error loading GeoTIFF:", err);
        setError(err.message);
      }
    };

    if (fileUrl) {
        // Short timeout to ensure map container is ready
        setTimeout(loadGeotiff, 100);
    }
  }, [fileUrl]);

  if (error) return <div className="error-message">Error loading GeoTIFF: {error}</div>;

  return (
    <div className="geotiff-map-container" style={{ height: '400px', width: '100%', border: '1px solid #ddd' }}>
        <MapContainer 
            center={[40.416775, -3.703790]} 
            zoom={6} 
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
        >
            <MapResizer />
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />
        </MapContainer>
    </div>
  );
};

export default GeotiffMap;
