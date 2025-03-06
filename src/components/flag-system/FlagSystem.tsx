'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useFlagGenerator } from '@/hooks/useFlagGenerator';
import { useFlagHistory } from '@/contexts/FlagHistoryContext';
import { letterToFlag } from '@/lib/flag-system/flagMap';
import { Switch } from '../ui/switch';

// Componente para mostrar las banderas en el canvas
const FlagDisplay = ({ 
  word, 
  isGridMode, 
  backgroundColor 
}: { 
  word: string; 
  isGridMode: boolean;
  backgroundColor: string;
}) => {
  if (!word) {
    return (
      <div className="text-center p-8">
          <span className="text-white/60 font-sans text-xl block">
            Enter or generate a word to display flags
          </span>
      </div>
    );
  }

  // Determinar tamaño de banderas según longitud de palabra
  let flagSize = "w-20 h-20";
  if (word.length > 6) {
    flagSize = "w-16 h-16";
  }
  if (word.length > 8) {
    flagSize = "w-14 h-14";
  }

  // Array de letras para mostrar
  const letters = word.split('').map(letter => letter.toUpperCase());
  
  // Renderizado según el modo
  if (isGridMode) {
    // Modo columnas: dos columnas sin espacio
    return (
      <div 
        className="flex flex-col justify-center items-center h-full w-full transition-colors duration-300"
        style={{ backgroundColor }}
      >
        <div className="w-[70%] mx-auto">
          {/* Display usando flexbox + flexwrap con SVG directos */}
          <div 
            style={{ display: 'flex', flexWrap: 'wrap', width: '140px', margin: '0 auto' }}
            className="sm:scale-100 scale-75 transform origin-center"
          >
            {letters.map((letter, index) => {
              const flag = letterToFlag(letter);
              if (!flag) return null;
              
              return (
                <div 
                  key={index} 
                  style={{ 
                    width: '70px', 
                    height: '70px', 
                    flexShrink: 0,
                    flexGrow: 0,
                    margin: 0, 
                    padding: 0, 
                    float: 'left'
                  }}
                  className="sm:w-[70px] sm:h-[70px] w-[50px] h-[50px]"
                >
                  <img 
                    src={flag.flagPath} 
                    alt={`Bandera para la letra ${letter}`}
                    style={{ 
                      display: 'block', 
                      width: '100%', 
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Palabra en el borde inferior */}
        <div className="absolute bottom-4 w-full text-center">
          <span className="text-white font-sans text-4xl tracking-wider">{word}</span>
        </div>
      </div>
    );
  }
  
  // Modo normal: una sola fila
  return (
    <div 
      className="flex flex-col justify-center items-center h-full w-full transition-colors duration-300"
      style={{ backgroundColor }}
    >
      <div className="flex flex-row justify-center flex-wrap sm:flex-nowrap" style={{ fontSize: 0, lineHeight: 0 }}>
        {letters.map((letter, index) => {
          const flag = letterToFlag(letter);
          if (!flag) return null;
          
          return (
            <div key={index} className="flex items-center" style={{ margin: 0, padding: 0 }}>
              <img 
                src={flag.flagPath} 
                alt={`Bandera para la letra ${letter}`}
                  style={{ 
                    display: 'inline-block', 
                    objectFit: 'contain'
                  }}
                  className="sm:w-[70px] sm:h-[70px] w-[50px] h-[50px]"
              />
            </div>
          );
        })}
      </div>
      
      {/* Palabra en el borde inferior */}
      <div className="absolute bottom-4 w-full text-center">
          <span className="text-white font-sans text-4xl tracking-wider">{word}</span>
      </div>
    </div>
  );
};

// Componente de historial
const HistoryPanel = () => {
  const { history, addToHistory, clearHistory } = useFlagHistory();
  const { setWord } = useFlagGenerator()[1];
  
  // Manejar clic en palabra del historial
  const handleWordClick = (word: string) => {
    setWord(word); // Establecer la palabra seleccionada en el input
  };
  
  if (history.length === 0) {
    return (
      <div className="w-full mt-6 bg-black/30 border border-white/10 rounded-md p-4">
        <h3 className="font-sans text-sm text-white/80 mb-2 uppercase tracking-wide">History</h3>
        <p className="text-white/40 text-center py-4 font-sans text-sm">No words in history</p>
      </div>
    );
  }
  
  return (
    <div className="w-full mt-6 bg-black/30 border border-white/10 rounded-md p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-sans text-sm text-white/80 uppercase tracking-wide">History</h3>
        <button 
          onClick={clearHistory}
          className="text-xs text-white/40 hover:text-white/70 transition-colors font-sans px-2 py-1 bg-white/5 rounded hover:bg-white/10"
        >
          Clear
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {history.map((word, index) => (
          <div 
            key={index} 
            className="px-2 py-0.5 bg-white/10 rounded-md text-white text-xs cursor-pointer hover:bg-[#00ff00]/20 hover:border-[#00ff00]/30 transition-colors border border-transparent font-sans"
            onClick={() => handleWordClick(word)}
          >
            {word}
          </div>
        ))}
      </div>
    </div>
  );
};

// Versión móvil compacta del historial
const MobileHistoryPanel = () => {
  const { history, clearHistory } = useFlagHistory();
  const { setWord } = useFlagGenerator()[1];

  return (
    <div className="lg:hidden">
      <div className="w-full mt-3 bg-black/30 border border-white/10 rounded-md p-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-sans text-xs text-white/80 uppercase tracking-wide">History</h3>
          <button 
            onClick={clearHistory}
            className="text-[10px] text-white/40 hover:text-white/70 transition-colors font-sans px-1.5 py-0.5 bg-white/5 rounded hover:bg-white/10"
          >
            Clear
          </button>
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {history.length === 0 ? (
            <p className="text-white/40 text-center w-full py-2 font-sans text-xs">No words in history</p>
          ) : (
            history.map((word, index) => (
              <div 
                key={index} 
                className="px-1.5 py-0.5 bg-white/10 rounded text-white text-[10px] cursor-pointer hover:bg-[#00ff00]/20 hover:border-[#00ff00]/30 transition-colors border border-transparent font-sans"
                onClick={() => setWord(word)}
              >
                {word}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default function FlagSystem() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [
    { word, displayWord, isGenerating, isGeneratedRandomly, maxLength, isGridMode, backgroundColor },
    { setWord, generateRandomWord, setMaxLength, exportAsSvg, toggleGridMode, changeBackgroundColor }
  ] = useFlagGenerator();
  
  const { addToHistory } = useFlagHistory();
  const [showColorPalette, setShowColorPalette] = useState(false);
  
  // Mantener focus en el input al escribir
  useEffect(() => {
    if (word && !isGenerating && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [word, isGenerating]);
  
  // Añadir al historial cuando se genera o escribe una palabra completa
  useEffect(() => {
    if (displayWord && !isGenerating) {
      addToHistory(displayWord);
    }
  }, [displayWord, isGenerating, addToHistory]);

  // Manejar la selección directa de color
  const handleColorSelect = (color: string) => {
    setShowColorPalette(false);
    // Usar la función actualizada para establecer un color específico
    changeBackgroundColor(color);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 md:gap-8 mb-8 p-0">
      {/* Flag display area - optimized for all screen sizes */}
      <div className="w-full lg:w-[75%] flex justify-center mx-auto px-4 lg:px-0">
        <div className="w-full aspect-square">
          <div className="flex justify-center w-full relative">
            <div 
              style={{
                position: "relative", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center",  
                border: "1px solid #333", 
                borderRadius: "8px", 
                overflow: "hidden", 
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
                backgroundColor,
                width: "100%",
                height: "100%",
                maxWidth: "1000px",
                maxHeight: "1000px",
                aspectRatio: "1 / 1"
              }}
              className="transition-all duration-300"
            >
              <FlagDisplay 
                word={displayWord} 
                isGridMode={isGridMode} 
                backgroundColor={backgroundColor} 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Control panel - mobile optimized */}
      <div className="w-full lg:w-[25%] px-4 lg:px-0">
        {/* Mobile compact controls */}
        <div className="lg:hidden w-full bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-white/10 mb-4">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              ref={inputRef}
              className="w-full bg-black border border-white/20 rounded-md py-2 px-3 text-lg font-sans uppercase tracking-wider focus:border-[#00ff00] focus:outline-none"
              placeholder="TYPE OR GENERATE WORD..."
              value={word}
              onChange={(e) => setWord(e.target.value)}
            />
            <div className="flex gap-2 w-full">
              <button
                onClick={generateRandomWord}
                disabled={isGenerating}
                className="flex-grow px-3 py-2 bg-[#00ff00] text-black font-sans uppercase tracking-wider text-sm disabled:opacity-50 hover:brightness-110 transition-all duration-300"
              >
                {isGenerating ? '...' : 'RANDOM'}
              </button>
              <button
                onClick={() => {
                  const colors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff'];
                  const randomIndex = Math.floor(Math.random() * colors.length);
                  changeBackgroundColor(colors[randomIndex]);
                }}
                className="w-12 px-0 py-2 bg-blue-500 text-white font-sans uppercase tracking-wider text-sm hover:bg-blue-600 transition-all duration-300"
              >
                BG
              </button>
              <div className="relative w-12 bg-black/70 border border-white/20 rounded-md flex items-center justify-center">
                <input
                  type="number"
                  min="2"
                  max="10"
                  className="w-full h-full bg-transparent text-white text-center font-sans focus:outline-none"
                  value={maxLength}
                  onChange={(e) => setMaxLength(parseInt(e.target.value) || 2)}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Desktop full controls - hidden on mobile */}
        <div className="hidden lg:block w-full bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <div className="flex flex-col gap-5">
            {/* Display mode toggle - now with icons */}
            <div className="flex items-center justify-end mb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </div>
                <Switch 
                  checked={isGridMode}
                  onCheckedChange={toggleGridMode}
                />
                <div className="flex items-center justify-center w-6 h-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Text input */}
            <div className="w-full">
              <input
                type="text"
                ref={inputRef}
                className="w-full bg-black border border-white/20 rounded-md py-3 px-4 text-xl font-sans uppercase tracking-wider focus:border-[#00ff00] focus:outline-none"
                placeholder="TYPE OR GENERATE WORD..."
                value={word}
                onChange={(e) => setWord(e.target.value)}
              />
            </div>
            
            {/* Action buttons - main buttons in row */}
            <div className="flex gap-3 w-full mb-3">
              <button
                onClick={generateRandomWord}
                disabled={isGenerating}
                className="flex-grow-[3] px-6 py-3 bg-[#00ff00] text-black font-sans uppercase tracking-wider disabled:opacity-50 hover:brightness-110 transition-all duration-300"
              >
                {isGenerating ? 'GENERATING...' : 'RANDOM WORD'}
              </button>
              
              <button
                onClick={() => {
                  // Using only RGB colors, black and white
                  const colors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff'];
                  const randomIndex = Math.floor(Math.random() * colors.length);
                  changeBackgroundColor(colors[randomIndex]);
                }}
                className="flex-grow-[1] px-4 py-3 bg-blue-500 text-white font-sans uppercase tracking-wider hover:bg-blue-600 transition-all duration-300"
              >
                BG
              </button>
            </div>
            
            {/* Export button on second line */}
            <div className="w-full mb-3">
              <button
                disabled={!displayWord}
                onClick={exportAsSvg}
                className="w-full px-6 py-3 bg-white/10 border border-white/20 text-white font-sans uppercase tracking-wider disabled:opacity-30 hover:bg-white/20 transition-all duration-300"
              >
                EXPORT SVG
              </button>
            </div>
            
            {/* Length control */}
            <div className="w-full border-t border-white/10 pt-4">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="2"
                  max="10"
                  className="w-full accent-[#00ff00]"
                  value={maxLength}
                  onChange={(e) => setMaxLength(parseInt(e.target.value))}
                />
                <span className="font-sans text-xl text-white">{maxLength}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Panel de historial - versión desktop y móvil */}
        <div className="hidden lg:block">
          <HistoryPanel />
        </div>
        
        {/* Historial eliminado en versión móvil según requisito */}
      </div>
    </div>
  );
}
