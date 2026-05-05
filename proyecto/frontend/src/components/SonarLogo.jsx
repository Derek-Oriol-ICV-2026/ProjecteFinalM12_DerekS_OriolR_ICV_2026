import React from 'react';
import './SonarLogo.css';

export default function SonarLogo({ size = 'sm', showText = false, animated = true }) {
  const sizeMap = {
    sm: 170,
    md: 80,
    lg: 120
  };

  const iconSize = sizeMap[size];
  const viewBoxSize = 240;

  return (
    <div className={`sonar-logo ${size} ${animated ? 'animated' : ''}`}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        xmlns="http://www.w3.org/2000/svg"
        className="sonar-svg"
      >
        <defs>
          <linearGradient id="sonarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#0284c7', stopOpacity: 1 }} />
          </linearGradient>

          <filter id="sonarGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform={`translate(${viewBoxSize / 2}, ${viewBoxSize / 2})`}>
          {/* Anillos concéntricos */}
          <circle cx="0" cy="0" r="15" fill="none" stroke="url(#sonarGrad)" strokeWidth="0.8" opacity="0.4" />
          <circle cx="0" cy="0" r="30" fill="none" stroke="url(#sonarGrad)" strokeWidth="0.8" opacity="0.3" />
          <circle cx="0" cy="0" r="45" fill="none" stroke="url(#sonarGrad)" strokeWidth="0.8" opacity="0.2" />

          {/* Líneas de referencia */}
          <line x1="0" y1="-50" x2="0" y2="50" stroke="url(#sonarGrad)" strokeWidth="0.8" opacity="0.25" />
          <line x1="-50" y1="0" x2="50" y2="0" stroke="url(#sonarGrad)" strokeWidth="0.8" opacity="0.25" />
          <line x1="-35" y1="-35" x2="35" y2="35" stroke="url(#sonarGrad)" strokeWidth="0.8" opacity="0.15" />
          <line x1="-35" y1="35" x2="35" y2="-35" stroke="url(#sonarGrad)" strokeWidth="0.8" opacity="0.15" />

          {/* Onda pulsante */}
          {animated && (
            <>
              <circle className="pulse-ring" cx="0" cy="0" r="8" fill="none" stroke="url(#sonarGrad)" strokeWidth="2" opacity="0.8" />
              <circle className="pulse-ring pulse-ring-delay" cx="0" cy="0" r="8" fill="none" stroke="url(#sonarGrad)" strokeWidth="2" opacity="0.8" />
            </>
          )}

          {/* Línea de barrido */}
          <g className={animated ? 'sweep-line' : ''}>
            <line x1="0" y1="0" x2="0" y2="-50" stroke="url(#sonarGrad)" strokeWidth="1.5" opacity="0.6" />
          </g>

          {/* Puntos de detección */}
          <g className={animated ? 'blip' : ''}>
            <circle cx="25" cy="-30" r="2.5" fill="url(#sonarGrad)" filter="url(#sonarGlow)" />
            <circle cx="25" cy="-30" r="4" fill="none" stroke="url(#sonarGrad)" strokeWidth="1" opacity="0.5" />
          </g>

          <g className={animated ? 'blip blip-delay-1' : ''}>
            <circle cx="40" cy="-10" r="2" fill="url(#sonarGrad)" filter="url(#sonarGlow)" />
            <circle cx="40" cy="-10" r="3.5" fill="none" stroke="url(#sonarGrad)" strokeWidth="0.8" opacity="0.4" />
          </g>

          <g className={animated ? 'blip blip-delay-2' : ''}>
            <circle cx="15" cy="35" r="3" fill="url(#sonarGrad)" filter="url(#sonarGlow)" />
            <circle cx="15" cy="35" r="5" fill="none" stroke="url(#sonarGrad)" strokeWidth="1" opacity="0.5" />
          </g>

          <g className={animated ? 'blip blip-delay-3' : ''}>
            <circle cx="-35" cy="20" r="2" fill="url(#sonarGrad)" filter="url(#sonarGlow)" />
            <circle cx="-35" cy="20" r="3.5" fill="none" stroke="url(#sonarGrad)" strokeWidth="0.8" opacity="0.4" />
          </g>

          {/* Punto central */}
          <circle cx="0" cy="0" r="4" fill="url(#sonarGrad)" filter="url(#sonarGlow)" />
          <circle cx="0" cy="0" r="6" fill="none" stroke="url(#sonarGrad)" strokeWidth="1.5" opacity="0.6" />
        </g>
      </svg>

      {showText && (
        <div className="sonar-text">
          <span>Abyss</span>
        </div>
      )}
    </div>
  );
}