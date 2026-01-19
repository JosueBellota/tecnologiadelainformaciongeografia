import React, { useState } from 'react';
import './Practice8Viewer.css';

const Practice8Viewer = ({ items }) => {
    // State to track loading status of each iframe by index
    const [loadingStatus, setLoadingStatus] = useState(
        items.map(() => true)
    );

    const handleLoad = (index) => {
        setLoadingStatus(prev => {
            const newState = [...prev];
            newState[index] = false;
            return newState;
        });
    };

    return (
        <div className="practice8-container">
            {items.map((item, index) => (
                <div key={index} className="practice8-item">
                    <h3>{item.title}</h3>
                    <div className="iframe-container">
                        {loadingStatus[index] && (
                            <div className="loading-overlay">
                                <div className="spinner"></div>
                                <p>Cargando contenido...</p>
                            </div>
                        )}
                        {item.type === 'image' ? (
                            <img 
                                src={item.url} 
                                alt={item.title} 
                                className="practice8-image"
                                onLoad={() => handleLoad(index)}
                                style={{ width: '100%', height: 'auto', display: loadingStatus[index] ? 'none' : 'block' }}
                            />
                        ) : (
                            <iframe 
                                src={item.url} 
                                title={item.title} 
                                className="practice8-iframe"
                                onLoad={() => handleLoad(index)}
                            />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Practice8Viewer;