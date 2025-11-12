import React from 'react';

interface RadarChartProps {
  realData: {
    financial: number;
    operational: number;
    reputation: number;
    risk: number;
    innovation: number;
    sustainability: number;
  };
  invertedData: {
    financial: number;
    operational: number;
    reputation: number;
    risk: number;
    innovation: number;
    sustainability: number;
  };
}

const RadarChart: React.FC<RadarChartProps> = ({ realData, invertedData }) => {
  const metrics = [
    { key: 'financial', label: 'Impacto Financeiro', icon: '💰' },
    { key: 'operational', label: 'Eficiência Operacional', icon: '⚙️' },
    { key: 'reputation', label: 'Reputação', icon: '⭐' },
    { key: 'risk', label: 'Gestão de Risco', icon: '🛡️' },
    { key: 'innovation', label: 'Inovação', icon: '💡' },
    { key: 'sustainability', label: 'Sustentabilidade', icon: '🌱' }
  ];

  const size = 500;
  const center = size / 2;
  const maxRadius = 180;
  const levels = 5;

  // Calcular pontos do polígono para os dados
  const getPoint = (value: number, index: number) => {
    const angle = (Math.PI * 2 * index) / metrics.length - Math.PI / 2;
    const radius = (value / 10) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle)
    };
  };

  // Criar path para os dados
  const createPath = (data: any) => {
    const points = metrics.map((metric, index) =>
      getPoint(data[metric.key as keyof typeof data], index)
    );
    return points.map((point, i) =>
      `${i === 0 ? 'M' : 'L'} ${point.x},${point.y}`
    ).join(' ') + ' Z';
  };

  // Criar linhas de grade (círculos concêntricos)
  const gridLevels = Array.from({ length: levels }, (_, i) => {
    const radius = maxRadius * ((i + 1) / levels);
    return (
      <circle
        key={i}
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="rgba(255, 255, 255, 0.1)"
        strokeWidth="1"
      />
    );
  });

  // Criar linhas radiais (eixos)
  const radialLines = metrics.map((_, index) => {
    const angle = (Math.PI * 2 * index) / metrics.length - Math.PI / 2;
    const x = center + maxRadius * Math.cos(angle);
    const y = center + maxRadius * Math.sin(angle);
    return (
      <line
        key={index}
        x1={center}
        y1={center}
        x2={x}
        y2={y}
        stroke="rgba(255, 255, 255, 0.1)"
        strokeWidth="1"
      />
    );
  });

  // Labels para cada eixo
  const labels = metrics.map((metric, index) => {
    const angle = (Math.PI * 2 * index) / metrics.length - Math.PI / 2;
    const labelRadius = maxRadius + 50;
    const x = center + labelRadius * Math.cos(angle);
    const y = center + labelRadius * Math.sin(angle);

    // Calcular valores para cada métrica
    const realValue = realData[metric.key as keyof typeof realData];
    const invertedValue = invertedData[metric.key as keyof typeof invertedData];

    return (
      <g key={index}>
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="14"
          fontWeight="600"
          className="select-none"
        >
          <tspan x={x} dy="-10">{metric.icon}</tspan>
          <tspan x={x} dy="20">{metric.label}</tspan>
          <tspan x={x} dy="18" fontSize="12" fill="rgba(59, 130, 246, 1)" fontWeight="700">
            Real: {realValue.toFixed(1)}
          </tspan>
          <tspan x={x} dy="16" fontSize="12" fill="rgba(168, 85, 247, 1)" fontWeight="700">
            Inv: {invertedValue.toFixed(1)}
          </tspan>
        </text>
      </g>
    );
  });

  const realPath = createPath(realData);
  const invertedPath = createPath(invertedData);

  return (
    <div className="w-full flex justify-center items-center p-8">
      <div className="relative">
        <svg
          width={size + 100}
          height={size + 100}
          viewBox={`0 0 ${size + 100} ${size + 100}`}
          className="drop-shadow-2xl"
        >
          <defs>
            <filter id="glow-blue">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="glow-purple">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <g transform="translate(50, 50)">
            {/* Grade de fundo */}
            {gridLevels}
            {radialLines}

            {/* Polígono da decisão real */}
            <path
              d={realPath}
              fill="rgba(59, 130, 246, 0.2)"
              stroke="rgba(59, 130, 246, 1)"
              strokeWidth="3"
              filter="url(#glow-blue)"
              className="transition-all duration-300 hover:fill-opacity-30"
            />

            {/* Pontos da decisão real */}
            {metrics.map((metric, index) => {
              const point = getPoint(realData[metric.key as keyof typeof realData], index);
              return (
                <circle
                  key={`real-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill="rgba(59, 130, 246, 1)"
                  stroke="white"
                  strokeWidth="2"
                  filter="url(#glow-blue)"
                  className="transition-all duration-300 hover:r-8"
                />
              );
            })}

            {/* Polígono da decisão invertida */}
            <path
              d={invertedPath}
              fill="rgba(168, 85, 247, 0.2)"
              stroke="rgba(168, 85, 247, 1)"
              strokeWidth="3"
              filter="url(#glow-purple)"
              className="transition-all duration-300 hover:fill-opacity-30"
            />

            {/* Pontos da decisão invertida */}
            {metrics.map((metric, index) => {
              const point = getPoint(invertedData[metric.key as keyof typeof invertedData], index);
              return (
                <circle
                  key={`inverted-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill="rgba(168, 85, 247, 1)"
                  stroke="white"
                  strokeWidth="2"
                  filter="url(#glow-purple)"
                  className="transition-all duration-300 hover:r-8"
                />
              );
            })}

            {/* Labels */}
            {labels}
          </g>
        </svg>

        {/* Legenda */}
        <div className="flex justify-center gap-8 mt-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
            <span className="text-white font-semibold text-lg">Decisão Real</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white shadow-lg"></div>
            <span className="text-white font-semibold text-lg">Decisão Invertida</span>
          </div>
        </div>

        {/* Nota explicativa */}
        <div className="mt-6 text-center">
          <p className="text-gray-300 text-sm">
            Escala de 0 a 10 — Quanto maior o valor, melhor o desempenho na dimensão
          </p>
        </div>
      </div>
    </div>
  );
};

export default RadarChart;
