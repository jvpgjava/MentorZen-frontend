import React, { useState, useEffect, useRef } from 'react';

interface LoadingProps {
  onComplete?: () => void;
}

const Loading: React.FC<LoadingProps> = ({ onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const textRef = useRef<SVGTextElement>(null);
  const fullText = 'Carregando...';
  const charDelay = 100;

  useEffect(() => {
    let currentIndex = 0;
    let cycleCount = 0;
    const maxCycles = 2;

    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        cycleCount++;
        if (cycleCount >= maxCycles) {
          setIsComplete(true);
          if (onComplete) {
            setTimeout(() => onComplete(), 300);
          }
          clearInterval(interval);
        } else {
          currentIndex = 0;
          setDisplayedText('');
        }
      }
    }, charDelay);

    return () => clearInterval(interval);
  }, [onComplete]);

  const getTextWidth = () => {
    if (textRef.current) {
      return textRef.current.getComputedTextLength();
    }
    return displayedText.length * 11;
  };

  const textWidth = getTextWidth();
  const pencilX = 50 + textWidth + 3;
  const pencilY = 167;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
      <div className="relative w-80 h-96">
        <svg
          className="w-full h-full"
          viewBox="0 0 280 360"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>

          <g>
            <rect
              x="20"
              y="20"
              width="240"
              height="320"
              rx="2"
              fill="#fef3f2"
              stroke="url(#orangeGradient)"
              strokeWidth="2.5"
              opacity="0.9"
            />

            {[50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300].map((y) => (
              <line
                key={y}
                x1="30"
                y1={y}
                x2="250"
                y2={y}
                stroke="#f97316"
                strokeWidth="1"
                opacity="0.15"
              />
            ))}
          </g>

          <g className="writing-group">
            <text
              ref={textRef}
              x="50"
              y="140"
              fill="url(#orangeGradient)"
              fontSize="24"
              fontWeight="600"
              fontFamily="Inter, sans-serif"
              className="writing-text"
            >
              {displayedText}
            </text>

            {!isComplete && displayedText.length > 0 && (
              <g className="pencil-group" transform={`translate(${pencilX}, ${pencilY})`}>
                <g className="pencil-rotate">
                  <rect
                    x="-5"
                    y="-30"
                    width="10"
                    height="30"
                    fill="url(#orangeGradient)"
                    rx="2.5"
                    className="pencil-body"
                  />
                  <path
                    d="M -5 -30 L 5 -30 L 0 -38 Z"
                    fill="#ea580c"
                    className="pencil-top"
                  />
                </g>
              </g>
            )}
          </g>
        </svg>
      </div>

      <style>{`
        .pencil-group {
          transition: transform 0.1s ease-out;
        }
        
        .pencil-rotate {
          animation: wobble 0.15s ease-in-out infinite;
          transform-origin: 0 0;
        }
        
        .pencil-body {
          transform: translateY(0);
        }
        
        .writing-text {
          dominant-baseline: alphabetic;
        }
        
        .pencil-tip {
          animation: pulse 0.3s ease-in-out infinite;
        }
        
        @keyframes wobble {
          0%, 100% {
            transform: rotate(25deg);
          }
          25% {
            transform: rotate(23deg);
          }
          50% {
            transform: rotate(25deg);
          }
          75% {
            transform: rotate(27deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            r: 4;
          }
          50% {
            opacity: 0.8;
            r: 4.5;
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
