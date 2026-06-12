'use client';

import { motion } from 'motion/react';
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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.dashboard}
    >
      {/* KPI Section */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>Orchestrations</span>
            <Target size={14} />
          </div>
          <div className={styles.kpiValue}>{totalCampaigns}</div>
          <div className={styles.kpiFooter}>
            <TrendingUp size={12} /> {completedCampaigns} finalized batches
          </div>
        </div>
        
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>Node Health</span>
            <Activity size={14} />
          </div>
          <div className={styles.kpiValue}>{deliveryRate.toFixed(1)}%</div>
          <div className={styles.kpiFooter}>
            <TrendingUp size={12} /> {totalDelivered} delivered signals
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>Attributed ROI</span>
            <TrendingUp size={14} />
          </div>
          <div className={styles.kpiValue}>${totalRevenue.toLocaleString()}</div>
          <div className={styles.kpiFooter}>
            <TrendingUp size={12} /> {totalConverted} conversions ({(conversionRate).toFixed(1)}%)
          </div>
        </div>
      </div>

      {/* Main Insights */}
      <div className={styles.insightsGrid}>
        <div className={styles.kpiCard}>
          <CampaignChart campaigns={campaigns} />
        </div>
        <div className={styles.kpiCard}>
          <ConversionsBarChart campaigns={campaigns} />
        </div>
      </div>

      {/* Active Monitor & Logs */}
      <div className={styles.bottomGrid}>
        {/* Active Dispatch */}
        <div className={styles.leftCol}>
          {runningCampaignId && runningCampaignStats && (
            <motion.div 
              className={styles.activeMonitor}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className={styles.monitorHeader}>
                <div className={styles.monitorTitle}>
                  <div className={styles.pulseDot} />
                  <span>Real-time Dispatch Stream</span>
                </div>
                <div className={styles.monitorProgress}>
                  {runningCampaignStats.delivered + runningCampaignStats.failed} / {runningCampaignStats.total}
                </div>
              </div>
              
              <div className={styles.progressBar}>
                <motion.div 
                  className={styles.progressFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${((runningCampaignStats.delivered + runningCampaignStats.failed) / runningCampaignStats.total) * 100}%` }}
                />
              </div>

              <div className={styles.monitorStats}>
                <div className={styles.subStat}>
                  <label>DELIVERED</label>
                  <span>{runningCampaignStats.delivered}</span>
                </div>
                <div className={styles.subStat}>
                  <label>OPENED</label>
                  <span>{runningCampaignStats.opened}</span>
                </div>
                <div className={styles.subStat}>
                  <label>CONVERTED</label>
                  <span>{runningCampaignStats.converted}</span>
                </div>
                <div className={styles.subStat}>
                  <label>REVENUE</label>
                  <span style={{ color: '#818cf8' }}>${runningCampaignStats.revenue.toFixed(0)}</span>
                </div>
              </div>
            </motion.div>
          )}

          <div className={styles.kpiCard}>
            <div className={styles.sectionHeader}>
              <h3>Execution History</h3>
              <button className={styles.tinyBtn}>Full Index</button>
            </div>
            
            <div className={styles.logList}>
              {campaigns.length === 0 ? (
                <div className={styles.emptyState}>Initialize an orchestration node to begin tracking.</div>
              ) : (
                campaigns.slice(0, 5).map((camp, i) => (
                  <motion.div 
                    key={camp.id} 
                    className={styles.logItem}
                    onClick={() => onSelectCampaign(camp.id)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className={styles.logMain}>
                      <span className={styles.logName}>{camp.name}</span>
                      <div className={styles.logMeta}>
                        <span className={styles.channelLabel}>{camp.channel}</span>
                        <span>•</span>
                        <span>{camp.segment?.name || 'All Shoppers'}</span>
                        <span>•</span>
                        <span className={styles.statusBadge}>{camp.status}</span>
                      </div>
                    </div>
                    {camp.stats && (
                      <div className={styles.logStats}>
                        <div className={styles.logStatItem}>
                          <label>REVENUE</label>
                          <span style={{ color: '#818cf8' }}>${camp.stats.revenue.toFixed(0)}</span>
                        </div>
                        <ArrowUpRight size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Telemetry Terminal */}
        <div className={styles.rightCol}>
          <div className={styles.terminal}>
            <div className={styles.terminalHeader}>
              <div className={styles.terminalTitle}>
                <Cpu size={14} />
                <span>delivery_signals_node.sh</span>
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
    </motion.div>
  );
}
