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
      <div style={{ color: 'var(--color-muted)', textAlign: 'center', padding: '32px 0', fontSize: '12px' }}>
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
          <TrendingUp size={14} strokeWidth={1} className="text-silver" />
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Revenue Attribution Trend
          </span>
        </div>
        <span style={{ fontSize: '10px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
          PEAK: ${maxRevenue.toLocaleString()}
        </span>
      </div>
      <div style={{ position: 'relative', width: '100%', height: `${height}px` }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%' }}>
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.02)" strokeDasharray="3,3" />
          <line x1={padding} y1={(height - padding * 2) / 2 + padding} x2={width - padding} y2={(height - padding * 2) / 2 + padding} stroke="rgba(255,255,255,0.02)" strokeDasharray="3,3" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--border-subtle)" />
          
          {areaD && <path d={areaD} fill="url(#chartGrad)" opacity="0.05" />}
          {pathD && <path d={pathD} fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
          
          {points.map((p, idx) => (
            <g key={idx}>
              <circle cx={p.x} cy={p.y} r="3" fill="#ffffff" stroke="var(--bg-surface)" strokeWidth="1.5" />
              <title>{p.label}: ${p.val}</title>
            </g>
          ))}
          
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--color-muted)', paddingLeft: '50px' }}>
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
      <div style={{ color: 'var(--color-muted)', textAlign: 'center', padding: '32px 0', fontSize: '12px' }}>
        Generate attributed conversion statistics inside workspace.
      </div>
    );
  }

  const width = 500;
  const height = 180;
  const padding = 30;
  const barWidth = 24;
  const gap = 44;

  const maxConversions = Math.max(...chartData.map(c => c.stats?.converted || 0), 10);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={14} strokeWidth={1} className="text-silver" />
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Campaign Conversions
          </span>
        </div>
        <span style={{ fontSize: '10px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
          MAX: {maxConversions}
        </span>
      </div>
      <div style={{ position: 'relative', width: '100%', height: `${height}px` }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%' }}>
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.02)" strokeDasharray="3,3" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--border-subtle)" />

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
                  rx="2" 
                  fill="#ffffff" 
                  opacity="0.8"
                />
                <text 
                  x={x + barWidth / 2} 
                  y={y - 6} 
                  textAnchor="middle" 
                  fill="var(--color-secondary)" 
                  fontSize="9" 
                  fontWeight="600"
                  fontFamily="var(--font-mono)"
                >
                  {val}
                </text>
                <title>{c.name}: {val} Conversions</title>
              </g>
            );
          })}
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--color-muted)', paddingLeft: '70px', paddingRight: '30px' }}>
        {chartData.map((c, i) => (
          <span key={i} style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '60px' }} title={c.name}>
            {c.name.split(" ")[0]}
          </span>
        ))}
      </div>
    </div>
  );
}
