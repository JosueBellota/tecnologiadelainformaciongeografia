import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import * as shp from 'shpjs';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Internal component to force map recalculation after expansion
const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 600); // Slightly longer than CSS transition (500ms)
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

const ShapefileMap = ({ fileUrl }) => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadShapefile = async () => {
      try {
        console.log("Fetching shapefile from:", fileUrl);
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);
        
        const arrayBuffer = await response.arrayBuffer();
        
        // Since we likely only have the .shp, we use parseShp directly
        // If we had the full set (shp, dbf, shx), we could use shp(url) or shp.parseZip(buffer)
        const geometries = shp.parseShp(arrayBuffer);
        
        // shp.parseShp returns an array of geometries. 
        // We need to wrap them in a FeatureCollection for GeoJSON component
        const geoJson = {
          type: "FeatureCollection",
          features: geometries.map(geom => ({
            type: "Feature",
            properties: {}, // No attributes since we lack .dbf
            geometry: geom
          }))
        };

        console.log("Parsed GeoJSON:", geoJson);
        setGeoJsonData(geoJson);
      } catch (err) {
        console.error("Error loading shapefile:", err);
        setError(err.message);
      }
    };

    if (fileUrl) {
      loadShapefile();
    }
  }, [fileUrl]);

  if (error) {
    return <div className="error-message">Error loading map: {error}</div>;
  }

  if (!geoJsonData) {
    return <div className="loading-message">Loading map data...</div>;
  }

  return (
    <MapContainer 
      center={[40.416775, -3.703790]} // Default center (Madrid approx)
      zoom={6} 
      style={{ height: '100%', width: '100%' }}
    >
      <MapResizer />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON 
        data={geoJsonData} 
        style={() => ({
            color: '#ff7800',
            weight: 2,
            opacity: 0.65
        })}
        onEachFeature={(feature, layer) => {
             if (layer.getBounds) {
                 // Try to auto-fit bounds if possible, though React-Leaflet handles this differently usually
             }
        }}
      />
      {/* Auto-fit bounds component could be added here */}
    </MapContainer>
  );
};

export default ShapefileMap;
