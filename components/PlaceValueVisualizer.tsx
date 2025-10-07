
import React from 'react';

interface PlaceValueVisualizerProps {
  numberStr: string;
}

const Block: React.FC<{ color: string; size: string; count: number; delay: number; label: string }> = ({ color, size, count, delay, label }) => {
  return (
    <div className="flex flex-col items-center mx-2">
      <div className={`grid ${count > 4 ? 'grid-cols-3' : 'grid-cols-2'} gap-1 p-1`}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`${size} ${color} rounded-md shadow-md transform transition-all duration-500 ease-out`}
            style={{ animation: `pop-in 0.5s ease-out ${delay + i * 0.05}s both` }}
          />
        ))}
      </div>
       <p className="mt-2 text-sm font-semibold text-gray-600">{label}</p>
    </div>
  );
};


export const PlaceValueVisualizer: React.FC<PlaceValueVisualizerProps> = ({ numberStr }) => {
  const number = parseInt(numberStr, 10) || 0;
  const thousands = Math.floor(number / 1000);
  const hundreds = Math.floor((number % 1000) / 100);
  const tens = Math.floor((number % 100) / 10);
  const ones = number % 10;

  const blockData = [
    { count: thousands, color: 'bg-red-400', size: 'w-10 h-10', label: 'Thousands' },
    { count: hundreds, color: 'bg-blue-400', size: 'w-8 h-8', label: 'Hundreds' },
    { count: tens, color: 'bg-green-400', size: 'w-4 h-8', label: 'Tens' },
    { count: ones, color: 'bg-yellow-400', size: 'w-4 h-4', label: 'Ones' },
  ];

  return (
    <div className="flex justify-center items-start p-4 bg-gray-100 rounded-lg min-h-[180px] w-full">
      <style>{`
        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      {blockData.map((data, index) => 
        data.count > 0 && <Block key={index} {...data} delay={index * 0.2} />
      )}
    </div>
  );
};
