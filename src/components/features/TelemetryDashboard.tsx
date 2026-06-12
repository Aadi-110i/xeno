'use client';

import { 
  Target, 
  Activity, 
  TrendingUp, 
  Cpu, 
  RefreshCw,
  ArrowUpRight
} from 'lucide-react';
import { CampaignChart, ConversionsBarChart } from './Charts';
import styles from './TelemetryDashboard.module.css';

interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'running' | 'completed' | 'failed';
  channel: string;
  segment?: { name: string };
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

interface TelemetryDashboardProps {
  campaigns: Campaign[];
  runningCampaignId: string;
  runningCampaignStats: any;
  telemetry: any[];
  onRefreshTelemetry: () => void;
  onSelectCampaign: (id: string) => void;
  telemetryEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function TelemetryDashboard({
  campaigns,
  runningCampaignId,
  runningCampaignStats,
  telemetry,
  onRefreshTelemetry,
  onSelectCampaign,
  telemetryEndRef
}: TelemetryDashboardProps) {
  const totalCampaigns = campaigns.length;
  const completedCampaigns = campaigns.filter(c => c.status === 'completed').length;
  
  let totalMessages = 0;
  let totalDelivered = 0;
  let totalOpened = 0;
  let totalConverted = 0;
  let totalRevenue = 0;

  campaigns.forEach(c => {
    if (c.stats) {
      totalMessages += c.stats.total;
      totalDelivered += c.stats.delivered;
      totalOpened += c.stats.opened;
      totalConverted += c.stats.converted;
      totalRevenue += c.stats.revenue;
    }
  });

  const deliveryRate = totalMessages > 0 ? (totalDelivered / totalMessages) * 100 : 0;
  const conversionRate = totalOpened > 0 ? (totalConverted / totalOpened) * 100 : 0;

  return (
    <div className="animated-fade-in">
      {/* KPI Section - Bento Grid */}
      <div className="bento-grid mb-24">
        <div className={`${styles.kpiCard} glass-panel`} style={{ gridColumn: 'span 4' }}>
          <div className={styles.kpiHeader}>
            <span>Campaign Deployments</span>
            <Target size={16} className={styles.muted} />
          </div>
          <div className="stat-number">{totalCampaigns}</div>
          <div className={styles.kpiFooter}>{completedCampaigns} finalized batches</div>
        </div>
        
        <div className={`${styles.kpiCard} glass-panel`} style={{ gridColumn: 'span 4' }}>
          <div className={styles.kpiHeader}>
            <span>Delivery Health</span>
            <Activity size={16} className={styles.muted} />
          </div>
          <div className="stat-number">{deliveryRate.toFixed(1)}%</div>
          <div className={styles.kpiFooter}>{totalDelivered} messages delivered</div>
        </div>

        <div className={`${styles.kpiCard} glass-panel`} style={{ gridColumn: 'span 4' }}>
          <div className={styles.kpiHeader}>
            <span>Attributed Revenue</span>
            <TrendingUp size={16} className={styles.green} />
          </div>
          <div className="stat-number text-green">${totalRevenue.toLocaleString()}</div>
          <div className={styles.kpiFooter}>{totalConverted} conversions ({(conversionRate).toFixed(1)}% rate)</div>
        </div>
      </div>

      {/* Main Insights - Bento Grid */}
      <div className="bento-grid mb-24">
        <div className="glass-panel p-24" style={{ gridColumn: 'span 7' }}>
          <CampaignChart campaigns={campaigns} />
        </div>
        <div className="glass-panel p-24" style={{ gridColumn: 'span 5' }}>
          <ConversionsBarChart campaigns={campaigns} />
        </div>
      </div>

      {/* Active Monitor & Logs */}
      <div className="bento-grid">
        {/* Active Dispatch */}
        <div style={{ gridColumn: 'span 7' }} className="flex flex-col gap-16">
          {runningCampaignId && runningCampaignStats && (
            <div className={`${styles.activeMonitor} glass-panel p-20 animated-fade-in`}>
              <div className={styles.monitorHeader}>
                <div className={styles.monitorTitle}>
                  <div className={styles.pulseDot} />
                  <span>Staggered Dispatch Monitor</span>
                </div>
                <div className={styles.monitorProgress}>
                  {runningCampaignStats.delivered + runningCampaignStats.failed} / {runningCampaignStats.total}
                </div>
              </div>
              
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${((runningCampaignStats.delivered + runningCampaignStats.failed) / runningCampaignStats.total) * 100}%` }}
                />
              </div>

              <div className={styles.monitorStats}>
                <div className={styles.subStat}>
                  <label>Delivered</label>
                  <span>{runningCampaignStats.delivered}</span>
                </div>
                <div className={styles.subStat}>
                  <label>Opened</label>
                  <span>{runningCampaignStats.opened}</span>
                </div>
                <div className={styles.subStat}>
                  <label>Conversions</label>
                  <span>{runningCampaignStats.converted}</span>
                </div>
                <div className={styles.subStat}>
                  <label>Revenue</label>
                  <span className="text-green">${runningCampaignStats.revenue.toFixed(0)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="glass-panel p-24">
            <div className={styles.sectionHeader}>
              <h3>Campaign Workspace Logs</h3>
              <button className="btn btn-secondary py-4 px-8" style={{ fontSize: '11px' }}>View All</button>
            </div>
            
            <div className={styles.logList}>
              {campaigns.length === 0 ? (
                <div className={styles.emptyState}>No campaigns found. Launch one in Campaign Orchestrator!</div>
              ) : (
                campaigns.slice(0, 5).map((camp) => (
                  <div 
                    key={camp.id} 
                    className={styles.logItem}
                    onClick={() => onSelectCampaign(camp.id)}
                  >
                    <div className={styles.logMain}>
                      <span className={styles.logName}>{camp.name}</span>
                      <div className={styles.logMeta}>
                        <span className={styles.channelLabel}>{camp.channel}</span>
                        <span>•</span>
                        <span>{camp.segment?.name || 'All Shoppers'}</span>
                        <span>•</span>
                        <span className={`badge badge-${camp.status}`}>{camp.status}</span>
                      </div>
                    </div>
                    {camp.stats && (
                      <div className={styles.logStats}>
                        <div className={styles.logStatItem}>
                          <label>REVENUE</label>
                          <span className="text-green">${camp.stats.revenue.toFixed(0)}</span>
                        </div>
                        <ArrowUpRight size={14} className={styles.muted} />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Telemetry Terminal */}
        <div style={{ gridColumn: 'span 5' }}>
          <div className={styles.terminal}>
            <div className={styles.terminalHeader}>
              <div className={styles.terminalTitle}>
                <Cpu size={14} className={styles.indigo} />
                <span>delivery_webhook_listener.sh</span>
              </div>
              <RefreshCw 
                size={14} 
                className={styles.refreshIcon} 
                onClick={onRefreshTelemetry} 
              />
            </div>
            <div className={styles.terminalLogs}>
              {telemetry.map((log) => (
                <div key={log.id} className={`${styles.terminalRow} ${log.highlight ? styles.terminalHighlight : ''}`}>
                  <span className={styles.timestamp}>[{log.time}]</span>
                  <span>{log.msg}</span>
                </div>
              ))}
              <div ref={telemetryEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
