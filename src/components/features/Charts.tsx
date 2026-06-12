'use client';

import { TrendingUp, Activity } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  stats?: {
    total: number;
    sent: number;
    delivered: number;
    failed: number;
    opened: number;
    clicked: number;
    converted: number;
    revenue: number;
  };
}

export function CampaignChart({ campaigns }: { campaigns: Campaign[] }) {
  const chartData = campaigns
    .filter(c => c.stats && c.stats.total > 0)
    .slice(0, 6)
    .reverse();
    
  if (chartData.length === 0) {
    return (
      <div style={{ color: 'var(--color-secondary)', textAlign: 'center', padding: '32px 0', fontSize: '13px' }}>
        Launch campaign batches to visualize analytical revenue trends.
      </div>
    );
  }
  
  const width = 500;
  const height = 180;
  const padding = 30;
  
  const maxRevenue = Math.max(...chartData.map(c => c.stats?.revenue || 0), 100);
  
  const points = chartData.map((c, i) => {
    const x = padding + (i * (width - padding * 2)) / (chartData.length - 1 || 1) + 20;
    const y = height - padding - ((c.stats?.revenue || 0) / maxRevenue) * (height - padding * 2);
    return { x, y, label: c.name, val: c.stats?.revenue || 0 };
  });
  
  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");
  
  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z` 
    : "";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={16} className="text-indigo" />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Revenue Attribution Trend
          </span>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--color-tertiary)', fontFamily: 'var(--font-mono)' }}>
          PEAK: ${maxRevenue.toLocaleString()}
        </span>
      </div>
      <div style={{ position: 'relative', width: '100%', height: `${height}px` }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%' }}>
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />
          <line x1={padding} y1={(height - padding * 2) / 2 + padding} x2={width - padding} y2={(height - padding * 2) / 2 + padding} stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.08)" />
          
          {areaD && <path d={areaD} fill="url(#chartGrad)" opacity="0.1" />}
          {pathD && <path d={pathD} fill="none" stroke="var(--accent-indigo)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
          
          {points.map((p, idx) => (
            <g key={idx}>
              <circle cx={p.x} cy={p.y} r="5" fill="var(--accent-indigo)" stroke="var(--bg-main)" strokeWidth="2" />
              <title>{p.label}: ${p.val}</title>
            </g>
          ))}
          
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-indigo)" />
              <stop offset="100%" stopColor="var(--accent-indigo)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-tertiary)', paddingLeft: '50px' }}>
        {chartData.map((c, i) => (
          <span key={i} style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '60px' }} title={c.name}>
            {c.name.split(" ")[0]}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ConversionsBarChart({ campaigns }: { campaigns: Campaign[] }) {
  const chartData = campaigns
    .filter(c => c.stats && c.stats.total > 0)
    .slice(0, 5)
    .reverse();

  if (chartData.length === 0) {
    return (
      <div style={{ color: 'var(--color-secondary)', textAlign: 'center', padding: '32px 0', fontSize: '13px' }}>
        Generate attributed conversion statistics inside workspace.
      </div>
    );
  }

  const width = 500;
  const height = 180;
  const padding = 30;
  const barWidth = 32;
  const gap = 36;

  const maxConversions = Math.max(...chartData.map(c => c.stats?.converted || 0), 10);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={16} className="text-indigo" />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Campaign Conversions
          </span>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--color-tertiary)', fontFamily: 'var(--font-mono)' }}>
          MAX: {maxConversions}
        </span>
      </div>
      <div style={{ position: 'relative', width: '100%', height: `${height}px` }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%' }}>
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.08)" />

          {chartData.map((c, i) => {
            const val = c.stats?.converted || 0;
            const barHeight = ((val / maxConversions) * (height - padding * 2));
            const x = padding + i * (barWidth + gap) + 60;
            const y = height - padding - barHeight;

            return (
              <g key={i}>
                <rect 
                  x={x} 
                  y={y} 
                  width={barWidth} 
                  height={barHeight} 
                  rx="4" 
                  fill="url(#barGrad)" 
                  className="animated-fade-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
                <text 
                  x={x + barWidth / 2} 
                  y={y - 8} 
                  textAnchor="middle" 
                  fill="var(--color-primary)" 
                  fontSize="10" 
                  fontWeight="600"
                  fontFamily="var(--font-mono)"
                >
                  {val}
                </text>
                <title>{c.name}: {val} Conversions</title>
              </g>
            );
          })}
          
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-indigo)" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-tertiary)', paddingLeft: '70px', paddingRight: '30px' }}>
        {chartData.map((c, i) => (
          <span key={i} style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '60px' }} title={c.name}>
            {c.name.split(" ")[0]}
          </span>
        ))}
      </div>
    </div>
  );
}
