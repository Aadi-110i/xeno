'use client';

import { Sparkles, ArrowRight, Cpu, Database, Users, RefreshCw, Send, TrendingUp } from 'lucide-react';
import styles from './LandingPage.module.css';

interface LandingPageProps {
  onEnterConsole: () => void;
  channelOnline: boolean;
  crmOnline: boolean;
  dbStats: { customers: number; orders: number };
  onSeedDatabase: () => void;
  seedingInProgress: boolean;
  aiSegmentPrompt: string;
  setAiSegmentPrompt: (val: string) => void;
  onSandboxLaunch: () => void;
}

export default function LandingPage({
  onEnterConsole,
  channelOnline,
  crmOnline,
  dbStats,
  onSeedDatabase,
  seedingInProgress,
  aiSegmentPrompt,
  setAiSegmentPrompt,
  onSandboxLaunch
}: LandingPageProps) {
  return (
    <div className={styles.landingContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <Sparkles size={14} className={styles.sparkle} />
            <span>AI-Native CRM Ecosystem</span>
          </div>
          <h1 className={styles.heroTitle}>
            Precision Audience <br />
            <span className={styles.highlight}>Orchestration.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Xeno leverages Gemini AI to parse shopper cohorts, generate high-converting templates, and track attribution across WhatsApp, SMS, and Email.
          </p>
          
          <div className={styles.ctaGroup}>
            <button className="btn btn-primary" onClick={onEnterConsole}>
              Open Engagement Workspace <ArrowRight size={16} />
            </button>
            <button className="btn btn-secondary" onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}>
              View Workflow
            </button>
          </div>
        </div>

        {/* System Health Card - Asymmetric Floating */}
        <div className={styles.healthCardWrapper}>
          <div className="glass-panel p-24 animated-fade-in">
            <div className={styles.healthHeader}>
              <Cpu size={20} className={styles.indigo} />
              <h3>System Diagnostics</h3>
            </div>
            
            <div className={styles.healthGrid}>
              <div className={styles.healthItem}>
                <span className={styles.healthLabel}>Database Engine</span>
                <div className={styles.healthStatus}>
                  <div className={`${styles.dot} ${crmOnline ? styles.online : ''}`} />
                  <span>SQLite {crmOnline ? 'Active' : 'Offline'}</span>
                </div>
              </div>
              <div className={styles.healthItem}>
                <span className={styles.healthLabel}>Delivery Gateway</span>
                <div className={styles.healthStatus}>
                  <div className={`${styles.dot} ${channelOnline ? styles.online : ''}`} />
                  <span>Port 3001 {channelOnline ? 'Live' : 'Offline'}</span>
                </div>
              </div>
              <div className={styles.healthItem}>
                <span className={styles.healthLabel}>Knowledge Records</span>
                <div className={styles.healthValue}>{dbStats.customers} Shoppers</div>
              </div>
              <div className={styles.healthItem}>
                <span className={styles.healthLabel}>Transactional Depth</span>
                <div className={styles.healthValue}>{dbStats.orders} Orders</div>
              </div>
            </div>

            <button 
              className={`btn btn-secondary w-full ${styles.seedBtn}`}
              onClick={onSeedDatabase}
              disabled={seedingInProgress}
            >
              {seedingInProgress ? 'Populating Records...' : 'Seed Environment with Mock Data'}
            </button>
          </div>
        </div>
      </section>

      {/* Sandbox Section */}
      <section className={styles.sandboxSection}>
        <div className="container-max">
          <div className="glass-panel p-32">
            <div className={styles.sandboxGrid}>
              <div className={styles.sandboxInfo}>
                <h2 className={styles.sectionTitle}>Cohort Sandbox</h2>
                <p className={styles.sectionText}>
                  Test the AI segment compiler without entering the workspace. Describe your ideal audience in plain natural language.
                </p>
              </div>
              <div className={styles.sandboxInputBox}>
                <input 
                  type="text"
                  className="input-field"
                  placeholder="e.g., Lapsed buyers who spent over $500 last quarter..."
                  value={aiSegmentPrompt}
                  onChange={(e) => setAiSegmentPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onSandboxLaunch()}
                />
                <button className="btn btn-primary" onClick={onSandboxLaunch}>
                  Analyze Segment
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className={styles.processSection}>
        <div className="container-max">
          <h2 className={styles.centeredTitle}>The Closed-Loop Workflow</h2>
          <div className={styles.processGrid}>
            {[
              { icon: Database, title: 'Data Ingest', desc: 'Sync customer & order history batches.' },
              { icon: Users, title: 'Segmentation', desc: 'Define cohorts visually or via AI.' },
              { icon: Sparkles, title: 'AI Copywriting', desc: 'Draft personalized templates with Gemini.' },
              { icon: Send, title: 'Delivery', desc: 'Staggered dispatch across messaging APIs.' },
              { icon: RefreshCw, title: 'Feedback', desc: 'Real-time webhook delivery tracking.' },
              { icon: TrendingUp, title: 'Attribution', desc: 'Auto-calculate revenue impact & ROI.' }
            ].map((step, i) => (
              <div key={i} className={styles.processStep}>
                <div className={styles.stepIconBox}>
                  <step.icon size={24} className={styles.indigo} />
                </div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className="container-max">
          <div className={styles.footerContent}>
            <span>© 2026 Xeno AI CRM Redesign Assignment</span>
            <div className={styles.footerLinks}>
              <button className={styles.footerLink} onClick={onEnterConsole}>Console</button>
              <a href="#" className={styles.footerLink}>Documentation</a>
              <a href="#" className={styles.footerLink}>API Status</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
