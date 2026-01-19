import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Rectangle, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

const Practice10Map = () => {
  // Coordinates from Notebook: 
  // Top-Left: [39.1679, -3.766481]
  // Bottom-Right: [39.107981, -3.63584]
  const bounds = [
    [39.1679, -3.766481],
    [39.107981, -3.63584]
  ];
  
  const center = [
    (bounds[0][0] + bounds[1][0]) / 2,
    (bounds[0][1] + bounds[1][1]) / 2
  ];

  return (
    <div className="practice-10-container">
        <div className="map-wrapper" style={{ height: '400px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }}>
            <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
                <MapResizer />
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />
                <Rectangle bounds={bounds} pathOptions={{ color: 'red', weight: 2, fillOpacity: 0.1 }}>
                    <Popup>
                        Zona de Estudio NDWI<br />
                        [39.1679, -3.766481] a [39.107981, -3.63584]
                    </Popup>
                </Rectangle>
            </MapContainer>
        </div>
        <div className="info-box" style={{ marginTop: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '4px', fontSize: '0.9rem' }}>
            <p><strong>Nota:</strong> Este mapa muestra la localización de la zona de estudio definida en el Notebook.</p>
            <p>La capa de procesamiento satelital (NDWI) generada con Google Earth Engine requiere credenciales activas o la exportación de la imagen resultante.</p>
        </div>
    </div>
  );
};

export default Practice10Map;
