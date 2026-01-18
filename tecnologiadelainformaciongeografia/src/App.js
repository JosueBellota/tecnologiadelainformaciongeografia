import React from 'react';
import './App.css';

function App() {
  // Data derived from the provided instructions (Table in 2.png)
  const practices = [
    { 
      id: 1, 
      title: "Práctica 1", 
      info: "Captura de pantalla", 
      format: "Png, Jpg", 
      type: "image" 
    },
    { 
      id: 3, 
      title: "Práctica 3", 
      info: "Mapa de temperaturas y precipitaciones", 
      format: "Pdf", 
      type: "pdf" 
    },
    { 
      id: 4, 
      title: "Práctica 4", 
      info: "Capa Zonas Validas.shp", 
      format: "WebMap", 
      type: "map" 
    },
    { 
      id: 5, 
      title: "Práctica 5", 
      info: "Severidad.tif", 
      format: "WebMap", 
      type: "map" 
    },
    { 
      id: 7, 
      title: "Práctica 7", 
      info: "Tabla de resultados y gráfico de rendimiento", 
      format: "Jpg, Html", 
      type: "mixed" 
    },
    { 
      id: 8, 
      title: "Práctica 8", 
      info: "Contenedores.html y Accidentes Madríd.html", 
      format: "WebMap", 
      type: "map" 
    },
    { 
      id: 9, 
      title: "Práctica 9", 
      info: "Imágenes resultantes obtenidas del cálculo de los índices SAVI y EVI y que fueron exportadas a Drive.", 
      format: "WebMap", 
      type: "map" 
    },
    { 
      id: 10, 
      title: "Práctica 10", 
      info: "Imagenes resultante del índice calculado y exportada a Drive. Voluntario: Video GIF", 
      format: "WebMap", 
      type: "map" 
    },
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1>Portafolio WebMapping</h1>
        <p>Tecnologías de la Información Geográfica</p>
      </header>
      
      <main className="portfolio-container">
        <div className="practices-grid">
          {practices.map((practice) => (
            <div key={practice.id} className="practice-card">
              <div className="card-header">
                <h2>{practice.title}</h2>
              </div>
              <div className="card-body">
                <p className="card-info"><strong>Información:</strong> {practice.info}</p>
                <p className="card-format">Formato: {practice.format}</p>
                
                {/* 
                  ESPACIO PARA EL CONTENIDO
                  Tu amigo puede insertar aquí los componentes correspondientes 
                  (imágenes, iframes, mapas, etc.) reemplazando el div 'placeholder-content'.
                */}
                <div className={`placeholder-content ${practice.type}`}>
                  <span className="placeholder-label">
                    Espacio para {practice.format}
                    <br />
                    (Insertar contenido aquí)
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>
      </main>

      <footer>
        <p>© 2026 Portafolio WebMapping - Geografía</p>
      </footer>
    </div>
  );
}

export default App;