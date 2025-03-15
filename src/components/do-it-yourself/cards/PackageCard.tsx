'use client';

import React, { memo } from 'react';
import { motion, Variants } from 'framer-motion';
import { Paquete } from '@/types/do-it-yourself';
import { diyA11y, diyStyles } from '@/config/do-it-yourself';
import { useDiy } from '@/contexts/DiyContext';

// Estilos para el efecto de borde gradiente
const gradientBorderStyle = {
  container: {
    position: 'relative',
    borderRadius: '12px',
    padding: '1px',
    background: '#111',
    transition: 'transform 0.3s ease',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
  } as React.CSSProperties,
  
  content: {
    position: 'relative',
    background: '#111',
    borderRadius: '11px',
    zIndex: 1,
    height: '100%',
    width: '100%',
  } as React.CSSProperties,
  
  pseudoBorder: {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: '12px',
    padding: '1px',
    background: 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff, #ff0000)',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    backgroundSize: '300% 300%',
    animation: 'gradient-move 3.5s ease-in-out infinite',
    zIndex: 0,
    opacity: 0,
    transition: 'opacity 0.3s ease',
  } as React.CSSProperties,
  
  hover: {
    transform: 'translateY(-5px)',
  },
  
  pseudoBorderHover: {
    opacity: 1,
  }
};

interface PackageCardProps {
  paquete: Paquete;
  onVerDetalles: (paquete: Paquete) => void;
  animationVariants: Variants;
}

const PackageCard = memo<PackageCardProps>(({
  paquete,
  onVerDetalles,
  animationVariants
}) => {
  // Obtenemos la función para agregar elementos del contexto DIY
  const { agregarElementoPresupuesto } = useDiy();
  
  // Funciones de manejo de eventos
  const handleAgregarClick = () => {
    agregarElementoPresupuesto(paquete);
  };

  const handleVerDetallesClick = () => {
    onVerDetalles(paquete);
  };

  const handleKeyDown = (e: React.KeyboardEvent, accion: 'agregar' | 'detalles') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      accion === 'agregar' ? handleAgregarClick() : handleVerDetallesClick();
    }
  };

  // Para paquetes, al hacer click mostramos detalles en lugar de agregar directamente
  return (
    <motion.div
      variants={animationVariants}
      style={gradientBorderStyle.container}
      className="group h-full relative cursor-pointer"
      onClick={handleVerDetallesClick}
      onKeyDown={(e) => handleKeyDown(e, 'detalles')}
      tabIndex={0}
      role="button"
      aria-label={`${paquete.nombre}: ${paquete.precio} ${diyA11y.descriptions.packageCard}`}
      whileHover={gradientBorderStyle.hover}
    >
      <div 
        style={gradientBorderStyle.pseudoBorder}
        className="pseudo-border"
      />
      <div style={gradientBorderStyle.content}>
        <div className={`${diyStyles.cardBody} flex flex-col h-full`}>
          <h3 className={`${diyStyles.cardTitle} min-h-[40px] flex items-center`}>
            {paquete.nombre}
          </h3>
          
          <p className={`${diyStyles.text.body} flex-1 text-[10px] leading-[14px] line-clamp-4 mb-auto`}>
            {paquete.descripcion ? (
              paquete.descripcion.length > 120
                ? `${paquete.descripcion.substring(0, 120)}...` 
                : paquete.descripcion
            ) : 'Sin descripción'}
          </p>
          
          <div className={diyStyles.cardFooterContainer}>
            {/* Tiempo */}
            <div className={diyStyles.cardFooterItem}>
              <div className={diyStyles.cardTimeLabel}>Tiempo</div>
              <div className={diyStyles.cardTimeValue}>{paquete.tiempo_estimado || '-'}</div>
            </div>
            
            {/* Precio */}
            <div className={diyStyles.cardFooterItem}>
              <div className={diyStyles.cardTimeLabel}>Precio</div>
              <div className={diyStyles.cardPrice}>${paquete.precio.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

PackageCard.displayName = 'PackageCard';

// Insertamos la animación de keyframes directamente y el estilo para activar el borde en hover
const styleTag = typeof document !== 'undefined' ? document.createElement('style') : null;
if (styleTag) {
  styleTag.innerHTML = `
    @keyframes gradient-move {
      0% { background-position: 0% 0%; }
      25% { background-position: 100% 0%; }
      50% { background-position: 100% 100%; }
      75% { background-position: 0% 100%; }
      100% { background-position: 0% 0%; }
    }
    
    .group:hover .pseudo-border { opacity: 1 !important; }
    
    /* Estilos de hover para navegadores que no soporten hover */
    @media (hover: hover) {
      .group:hover {
        transform: translateY(-5px);
      }
    }
  `;
  document.head.appendChild(styleTag);
}

export default PackageCard;
