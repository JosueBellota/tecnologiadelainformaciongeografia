import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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

const GpxAnalysis = ({ fileUrl }) => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [positions, setPositions] = useState([]);
  const [center, setCenter] = useState([40.416775, -3.703790]);
  const [error, setError] = useState(null);

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }

  const deg2rad = (deg) => {
    return deg * (Math.PI/180)
  }

  useEffect(() => {
    const processGpx = async () => {
      try {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error('Failed to load GPX');
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        const trkpts = xmlDoc.getElementsByTagName("trkpt");

        let processedData = [];
        let mapPositions = [];
        let totalDist = 0;
        let maxEle = -Infinity;
        let minEle = Infinity;
        let totalEleGain = 0;
        let startTime = null;
        let endTime = null;

        for (let i = 0; i < trkpts.length; i++) {
          const pt = trkpts[i];
          const lat = parseFloat(pt.getAttribute("lat"));
          const lon = parseFloat(pt.getAttribute("lon"));
          const ele = parseFloat(pt.getElementsByTagName("ele")[0]?.textContent || 0);
          const timeStr = pt.getElementsByTagName("time")[0]?.textContent;
          const time = timeStr ? new Date(timeStr) : null;

          mapPositions.push([lat, lon]);

          let distFromPrev = 0;
          let speed = 0;
          let slope = 0;

          if (i > 0) {
            const prev = processedData[i-1];
            distFromPrev = getDistanceFromLatLonInKm(prev.lat, prev.lon, lat, lon) * 1000; // in meters
            totalDist += distFromPrev;

            if (time && prev.time) {
                const timeDiffSeconds = (time - prev.time) / 1000;
                if (timeDiffSeconds > 0) {
                    speed = (distFromPrev / timeDiffSeconds) * 3.6; // km/h
                }
            }

            const eleDiff = ele - prev.ele;
            if (eleDiff > 0) totalEleGain += eleDiff;
            
            if (distFromPrev > 0) {
                slope = (eleDiff / distFromPrev) * 100;
            }
          } else {
              if (time) startTime = time;
          }

          if (time) endTime = time;
          if (ele > maxEle) maxEle = ele;
          if (ele < minEle) minEle = ele;

          processedData.push({
            id: i,
            lat,
            lon,
            ele,
            time,
            distCum: parseFloat((totalDist).toFixed(2)), // Cumulative distance in meters
            speed: parseFloat(speed.toFixed(2)),
            slope: parseFloat(slope.toFixed(2))
          });
        }

        setData(processedData);
        setPositions(mapPositions);
        if (mapPositions.length > 0) setCenter(mapPositions[0]);

        const totalTimeSeconds = (endTime && startTime) ? (endTime - startTime) / 1000 : 0;
        const avgSpeed = totalTimeSeconds > 0 ? ((totalDist/1000) / (totalTimeSeconds/3600)) : 0;

        setSummary({
            totalDist: (totalDist / 1000).toFixed(2) + " km",
            maxEle: maxEle.toFixed(2) + " m",
            minEle: minEle.toFixed(2) + " m",
            eleGain: totalEleGain.toFixed(2) + " m",
            avgSpeed: avgSpeed.toFixed(2) + " km/h",
            duration: new Date(totalTimeSeconds * 1000).toISOString().substr(11, 8) // HH:MM:SS
        });

      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    if (fileUrl) processGpx();
  }, [fileUrl]);

  if (error) return <div className="error-message">Error: {error}</div>;
  if (!summary) return <div className="loading-message">Procesando datos GPX...</div>;

  return (
    <div className="gpx-analysis-container">
      
      <div className="gpx-section">
        <h3>1. Resumen del Recorrido (Tabla de Resultados)</h3>
        <div className="stats-grid">
            <div className="stat-item"><strong>Distancia:</strong> {summary.totalDist}</div>
            <div className="stat-item"><strong>Velocidad Media:</strong> {summary.avgSpeed}</div>
            <div className="stat-item"><strong>Desnivel +:</strong> {summary.eleGain}</div>
            <div className="stat-item"><strong>Altitud Máx:</strong> {summary.maxEle}</div>
            <div className="stat-item"><strong>Duración:</strong> {summary.duration}</div>
        </div>
      </div>

      <div className="gpx-section map-section">
        <h3>2. Mapa del Recorrido</h3>
        <div style={{ height: '300px', width: '100%' }}>
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                <MapResizer />
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />
                <Polyline positions={positions} color="blue" weight={4} />
            </MapContainer>
        </div>
      </div>

      <div className="gpx-section">
        <h3>3. Gráfico de Rendimiento (Perfil de Elevación y Velocidad)</h3>
        <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="distCum" 
                        label={{ value: 'Distancia (m)', position: 'insideBottomRight', offset: -10 }} 
                        type="number"
                        domain={['dataMin', 'dataMax']}
                    />
                    <YAxis yAxisId="left" label={{ value: 'Altitud (m)', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: 'Velocidad (km/h)', angle: 90, position: 'insideRight' }} />
                    <Tooltip />
                    <Legend verticalAlign="top"/>
                    <Line yAxisId="left" type="monotone" dataKey="ele" stroke="#8884d8" name="Altitud" dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="speed" stroke="#82ca9d" name="Velocidad" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GpxAnalysis;
