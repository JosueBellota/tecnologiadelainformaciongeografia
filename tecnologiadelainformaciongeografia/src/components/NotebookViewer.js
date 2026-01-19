import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const NotebookViewer = ({ fileUrl }) => {
  const [cells, setCells] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotebook = async () => {
      try {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error(`Failed to load notebook: ${response.statusText}`);
        
        const data = await response.json();
        if (!data.cells) throw new Error("Invalid notebook format");
        
        setCells(data.cells);
      } catch (err) {
        console.error("Error loading notebook:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (fileUrl) loadNotebook();
  }, [fileUrl]);

  if (loading) return <div className="loading-message">Cargando Notebook...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  const renderOutput = (outputs) => {
    if (!outputs || outputs.length === 0) return null;

    return outputs.map((output, index) => {
      // Handle image/png or image/jpeg
      if (output.data && (output.data['image/png'] || output.data['image/jpeg'])) {
        const mimeType = output.data['image/png'] ? 'image/png' : 'image/jpeg';
        const base64Data = output.data[mimeType];
        return (
          <div key={index} className="notebook-output-image">
             <img src={`data:${mimeType};base64,${base64Data}`} alt="Notebook Output" />
          </div>
        );
      }
      
      // Handle text/html (often used for folium maps or tables)
      if (output.data && output.data['text/html']) {
         // This is risky if content is untrusted, but for local student files it's usually acceptable
         // Ideally we would sanitize this
         const htmlContent = output.data['text/html'].join('');
         return (
             <div 
                key={index} 
                className="notebook-output-html"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
             />
         );
      }

      // Handle text/plain
      if (output.text) {
        const textContent = Array.isArray(output.text) ? output.text.join('') : output.text;
        return (
          <pre key={index} className="notebook-output-text">
            {textContent}
          </pre>
        );
      }

      return null;
    });
  };

  return (
    <div className="notebook-viewer">
      {cells.map((cell, index) => {
        if (cell.cell_type === 'markdown') {
          const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
          return (
            <div key={index} className="notebook-cell markdown-cell">
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                {source}
              </ReactMarkdown>
            </div>
          );
        }

        if (cell.cell_type === 'code') {
          return (
            <div key={index} className="notebook-cell code-cell">
               {/* We hide input code to focus on results as per "Table/Graph" requirements, 
                   but can be toggled if needed. For now showing outputs only is cleaner for a portfolio. 
                   Uncomment below to show code. */}
               {/* 
               <pre className="input-code">
                 {Array.isArray(cell.source) ? cell.source.join('') : cell.source}
               </pre> 
               */}
               <div className="cell-output">
                 {renderOutput(cell.outputs)}
               </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export default NotebookViewer;
