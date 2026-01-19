import React, { useState, useRef } from 'react';

const Practice10Map = () => {
  const [sliderValue, setSliderValue] = useState(50);
  const map3Ref = useRef(null);

  const mapa1 = process.env.PUBLIC_URL + "/practicas_files/pract10_mapa1.jpeg";
  const mapa2 = process.env.PUBLIC_URL + "/practicas_files/pract10_mapa2.jpeg";
  const mapa3 = process.env.PUBLIC_URL + "/practicas_files/pract10_mapa3.jpeg";

  const handleSliderChange = (e) => {
    setSliderValue(e.target.value);
  };

  return (
    <div className="practice-10-container" style={{ 
      padding: '20px', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '20px',
      maxHeight: '80vh', 
      overflowY: 'scroll', // Force scrollbar to be visible
      width: '100%'
    }}>
      
      <div className="comparison-container" style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '800px', 
          aspectRatio: '16/9', 
          overflow: 'hidden', 
          border: '2px solid #ddd', 
          borderRadius: '8px',
          flexShrink: 0 
      }}>
        
        {/* Background Image (Mapa 2 - Right side revealed when slider moves left) */}
        <img 
          src={mapa2} 
          alt="Mapa 2" 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' 
          }} 
        />

        {/* Foreground Image (Mapa 1 - Left side, clipped by slider) */}
        <img 
          src={mapa1} 
          alt="Mapa 1" 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            clipPath: `inset(0 ${100 - sliderValue}% 0 0)` 
          }} 
        />

        {/* Slider Input */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={handleSliderChange}
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '100%',
            transform: 'translateY(-50%)',
            appearance: 'none',
            background: 'transparent',
            pointerEvents: 'none', 
            zIndex: 10
          }}
          className="slider-input"
        />
        
        {/* Custom Slider Line/Handle Visuals */}
        <div 
            style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${sliderValue}%`,
                width: '4px',
                backgroundColor: 'white',
                transform: 'translateX(-50%)',
                pointerEvents: 'none',
                boxShadow: '0 0 5px rgba(0,0,0,0.5)'
            }}
        >
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '30px',
                height: '30px',
                backgroundColor: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 5px rgba(0,0,0,0.5)',
                color: '#333',
                fontSize: '12px'
            }}>
                ↔
            </div>
        </div>

      </div>

      {/* Mapa 3 Below */}
      <div 
        ref={map3Ref} 
        className="mapa3-container" 
        style={{ width: '100%', maxWidth: '800px', paddingBottom: '40px' }}
      >
        <img 
          src={mapa3} 
          alt="Mapa 3" 
          style={{ width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #ddd' }} 
        />
      </div>

      <style>{`
        .slider-input::-webkit-slider-thumb {
          pointer-events: auto;
          appearance: none;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
        }
        .slider-input::-moz-range-thumb {
          pointer-events: auto;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default Practice10Map;