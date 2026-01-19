import React, { useState } from 'react';
import './App.css';
import './firebase'; // Initialize Firebase
import ShapefileMap from './components/ShapefileMap';

import NotebookViewer from './components/NotebookViewer';
import Practice10Map from './components/Practice10Map';

import Practice8Viewer from './components/Practice8Viewer';

function App() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

    // Data derived from the provided instructions (Table in 2.png)
    const practices = [
      {
        id: 1,
        title: "Práctica 1",
        info: "Captura de pantalla",
        format: "Png, Jpg",
        type: "image",
        content: process.env.PUBLIC_URL + "/practicas_files/capturadepantalla.jpeg"
      },
      {
        id: 3,
        title: "Práctica 3",
        info: "Mapa de temperaturas y precipitaciones",
        format: "Pdf",
        type: "pdf",
        content: process.env.PUBLIC_URL + "/practicas_files/Precipitaciones Mapa.pdf"
      },
      {
        id: 4,
        title: "Práctica 4",
        info: "Capa Zonas Validas.shp",
        format: "WebMap",
        type: "map",
        content: process.env.PUBLIC_URL + "/practicas_files/ZONAS_VALIDAS.shp",
        isShapefile: true
      },
      {
        id: 5,
        title: "Práctica 5",
        info: "Severidad",
        format: "Jpg",
        type: "image",
        content: process.env.PUBLIC_URL + "/practicas_files/pract5.jpeg"
      },
      {
        id: 7,
        title: "Práctica 7",
        info: "Tabla de resultados y gráfico de rendimiento",
        format: "Jpg, Html",
        type: "map",
        content: [
          { title: "Tabla de Resultados", url: process.env.PUBLIC_URL + "/practicas_files/pract7.html" },
          { title: "Gráfico de Rendimiento", url: process.env.PUBLIC_URL + "/practicas_files/pract7_1.jpeg", type: "image" }
        ]
      },
      {
        id: 8,
        title: "Práctica 8",
        info: "Contenedores.html y Accidentes Madríd.html",
        format: "WebMap",
        type: "map",
        // Array of contents for this practice
        content: [
          { title: "Contenedores", url: process.env.PUBLIC_URL + "/practicas_files/Contenedores.html" },
          { title: "Accidentes Madrid", url: process.env.PUBLIC_URL + "/practicas_files/Accidentes.html" }
        ]
      },
      {
        id: 9,
        title: "Práctica 9",
        info: "Imágenes resultantes obtenidas del cálculo de los índices SAVI y EVI y que fueron exportadas a Drive.",
        format: "WebMap",
        type: "map",
        content: process.env.PUBLIC_URL + "/practicas_files/Medio_Ambiente.html",
        isIframe: true
      },
      {
        id: 10,
        title: "Práctica 10",
        info: "Imagenes resultante del índice calculado y exportada a Drive. Voluntario: Video GIF",
        format: "WebMap",
        type: "map",
        content: null, // Content handled by component internally or not needed
        isPractice10Map: true
      },
    ];
  const renderContent = (practice) => {
    if (practice.isPractice10Map) {
        return (
            <div className="map-container-wrapper">
                <Practice10Map />
            </div>
        );
    }

    if (!practice.content) {
      return (
        <div className={`placeholder-content ${practice.type}`}>
          <span className="placeholder-label">
            Espacio para {practice.format}
            <br />
            (El contenido se cargará aquí)
          </span>
        </div>
      );
    }

    if (practice.id === 8 || practice.id === 7) {
        return <Practice8Viewer items={practice.content} />;
    }

    if (practice.isShapefile) {
        return (
            <div className="map-container-wrapper">
                <ShapefileMap fileUrl={practice.content} />
            </div>
        );
    }





    if (practice.isDownload) {
         return (
            <div className="download-container">
                <p>Este archivo no se puede visualizar directamente en el navegador.</p>
                <a href={practice.content} download className="download-button">
                    Descargar {practice.info}
                </a>
            </div>
         );
    }

    if (practice.isNotebook) {
        return (
            <div className="notebook-container-wrapper">
                <NotebookViewer fileUrl={practice.content} />
            </div>
        );
    }

    if (practice.type === 'pdf' || practice.isIframe) {
        return (
            <iframe 
                src={practice.content} 
                title={practice.title} 
                className="content-iframe pdf-viewer"
            />
        );
    }

    if (practice.type === 'image') {
        return (
            <div className="image-content-container">
                <img 
                    src={practice.content} 
                    alt={practice.title} 
                    className="content-image"
                />
            </div>
        );
    }

    return null;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Portafolio WebMapping</h1>
        <p>Tecnologías de la Información Geográfica</p>
      </header>
      
      <main className="portfolio-container">
        <div className="practices-grid">
          {practices.map((practice) => (
            <div 
              key={practice.id} 
              className={`practice-card ${expandedId === practice.id ? 'expanded' : ''}`}
              onClick={() => toggleExpand(practice.id)}
            >
              <div className="card-header">
                <h2>{practice.title}</h2>
                <span className="toggle-icon">{expandedId === practice.id ? '−' : '+'}</span>
              </div>
              <div className="card-body">
                <p className="card-info"><strong>Información:</strong> {practice.info}</p>
                <p className="card-format">Formato: {practice.format}</p>
                
                {/* Content Area - Visible only when expanded */}
                <div 
                    className={`content-area ${expandedId === practice.id ? 'visible' : ''}`}
                    onClick={(e) => e.stopPropagation()} // Prevent closing when interacting with content
                >
                  {expandedId === practice.id && renderContent(practice)}
                </div>

              </div>
            </div>
          ))}
        </div>
      </main>

      <footer>
        <p>© 2026 Josue Bellota Ichaso - Portafolio WebMapping - Geografía</p>
      </footer>
    </div>
  );
}

export default App;