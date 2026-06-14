'use client';

import { motion } from 'motion/react';
import { 
  ArrowRight, 
  ChevronRight, 
  Check, 
  Globe, 
  Activity, 
  ShieldCheck, 
  Clock,
  Database,
  Users,
  Terminal,
  Layers,
  Zap,
  Maximize,
  Radio
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import styles from './LandingPage.module.css';

interface LandingPageProps {
  user: any;
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

const DrawingLine = () => (
  <motion.div 
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
    style={{ height: '1px', background: 'var(--border-silver)', width: '100%', originX: 0, marginTop: '12px' }}
  />
);

export default function LandingPage({
  user,
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
      <Navbar user={user} onEnterConsole={onEnterConsole} />
      
      {/* Hero Section: The Monolith */}
      <section className={styles.heroSection} id="product">
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div 
            className={styles.heroBadge}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Radio size={12} className="text-silver" />
            <span>Industrial Intelligence v2.6</span>
          </motion.div>
          <h1 className={styles.heroTitle}>
            Precision <br />
            Audience <br />
            <span className={styles.chromeText}>Orchestration.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Xeno leverages large-scale neural parsing to identify shopper cohorts and execute multi-channel campaigns with architectural precision.
          </p>
          
          <div className={styles.ctaGroup}>
            <motion.button 
              className="btn btn-primary" 
              onClick={onEnterConsole}
              whileTap={{ scale: 0.98 }}
            >
              Open Workspace <ArrowRight size={16} strokeWidth={2.5} />
            </motion.button>
            <motion.button 
              className="btn btn-secondary" 
              onClick={() => document.getElementById('workflow')?.scrollIntoView()}
              whileTap={{ scale: 0.98 }}
            >
              View Spec
            </motion.button>
          </div>
        </motion.div>

        {/* The Monolith Visual */}
        <motion.div 
          className={styles.monolithWrapper}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.monolith}>
            <div className={styles.monolithLines} />
            {/* Etched decorative lines */}
            <div className={styles.etchedLine} style={{ top: '20%', left: 0, width: '100%', height: '1px' }} />
            <div className={styles.etchedLine} style={{ top: '80%', left: 0, width: '100%', height: '1px' }} />
            <div className={styles.etchedLine} style={{ top: 0, left: '30%', width: '1px', height: '100%' }} />
            
            {/* Technical Labels */}
            <div style={{ position: 'absolute', top: '10%', right: '10%' }} className="text-mono">Node_Alpha_7</div>
            <div style={{ position: 'absolute', bottom: '10%', left: '10%' }} className="text-mono">Core_System_Online</div>
            
            {/* Status Indicators */}
            <div style={{ position: 'absolute', top: '40%', left: '40%' }}>
              <motion.div 
                animate={{ opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="badge badge-outline"
              >
                Syncing_Nodes...
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trust Strip */}
      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeContent}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className={styles.marqueeRow}>
              <div className={styles.brandLogo}>FORBES.TECH</div>
              <div className={styles.brandLogo}>WIRED_CORE</div>
              <div className={styles.brandLogo}>VERGE_SYSTEMS</div>
              <div className={styles.brandLogo}>BLOOMBERG.AI</div>
              <div className={styles.brandLogo}>QUARTZ_TECH</div>
              <div className={styles.brandLogo}>NEXT_NODES</div>
            </div>
          ))}
        </div>
      </div>

      {/* Intelligence Section */}
      <section className={styles.intelligenceSection}>
        <div className="container-max">
          <motion.div 
            className={styles.intelligenceCard}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            viewport={{ once: true }}
          >
            <div className={styles.intelligenceContent}>
              <span className={styles.sectionTag}>Core Logic</span>
              <h2 className={styles.sectionTitle}>
                Architectural <br />
                <span className="text-silver">Intelligence</span>
                <DrawingLine />
              </h2>
              <p className={styles.sectionText}>
                Our neural architecture processes high-velocity data points to identify patterns in customer behavior before they manifest.
              </p>
              <div style={{ marginTop: '48px' }}>
                <div className={styles.featureItem}>
                  <Maximize size={16} strokeWidth={1} className={styles.checkIcon} />
                  <span>Real-time cohort migration tracking</span>
                </div>
                <div className={styles.featureItem}>
                  <Layers size={16} strokeWidth={1} className={styles.checkIcon} />
                  <span>Predictive lifetime value modeling</span>
                </div>
                <div className={styles.featureItem}>
                  <Terminal size={16} strokeWidth={1} className={styles.checkIcon} />
                  <span>Autonomous campaign execution</span>
                </div>
              </div>
            </div>
            <div className={styles.intelligenceVisual}>
              <svg className={styles.nodeMap} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <motion.path 
                  d="M50 250 L150 150 L250 200 L350 50" 
                  stroke="var(--border-silver)" 
                  strokeWidth="1" 
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                {[
                  { x: 50, y: 250 },
                  { x: 150, y: 150 },
                  { x: 250, y: 200 },
                  { x: 350, y: 50 }
                ].map((node, i) => (
                  <motion.circle 
                    key={i} 
                    cx={node.x} 
                    cy={node.y} 
                    r="4" 
                    fill="var(--bg-deep)" 
                    stroke="var(--border-chrome)" 
                    strokeWidth="1"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.2 }}
                  />
                ))}
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Global Scale Section */}
      <section className={styles.scaleSection}>
        <div className="container-max">
          <div className={styles.sectionHeaderCentered}>
            <span className={styles.sectionTag}>Network Metrics</span>
            <h2 className={styles.sectionTitle}>
              Global Scale. <br />
              <span className="text-silver">Local Impact.</span>
              <div style={{ maxWidth: '400px', margin: '12px auto' }}><DrawingLine /></div>
            </h2>
          </div>
          
          <div className={styles.bentoGrid}>
            <motion.div 
              className={styles.bentoCard}
              whileInView={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              viewport={{ once: true }}
            >
              <div className={styles.bentoIconBox}>
                <Globe size={24} strokeWidth={1} className="text-silver" />
              </div>
              <div className={styles.bentoValue}>1.2M</div>
              <div className={styles.bentoLabel}>Daily Signals</div>
              <p className={styles.bentoDesc}>Orchestrating data across global node clusters.</p>
            </motion.div>

            <div className={styles.smallBentoCol}>
              <motion.div className={styles.bentoCard}>
                <div className={styles.bentoValueSmall}>99.9%</div>
                <div className={styles.textMono}>UPTIME_STATUS</div>
              </motion.div>
              
              <motion.div className={styles.bentoCard}>
                <div className={styles.bentoValueSmall}>50ms</div>
                <div className={styles.textMono}>LATENCY_CORE</div>
              </motion.div>

              <motion.div className={styles.bentoCard}>
                <div className={styles.bentoValueSmall}>SOC2</div>
                <div className={styles.textMono}>SECURITY_LOCK</div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Sandbox Section */}
      <section className={styles.sandboxSection} id="system">
        <div className="container-max">
          <div className={styles.sandboxGrid}>
            <div className={styles.sandboxInfo}>
              <span className={styles.sectionTag}>Sandbox Console</span>
              <h2 className={styles.sectionTitle}>
                Cohort <br />
                Orchestration
                <DrawingLine />
              </h2>
              <p className={styles.sectionText}>
                Execute natural language queries against your customer node clusters.
              </p>
            </div>
            <div className={styles.sandboxInputBox}>
              <input 
                type="text"
                className={styles.input}
                placeholder="PROMPT_ID: lapse_shoppers_q4"
                value={aiSegmentPrompt}
                onChange={(e) => setAiSegmentPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSandboxLaunch()}
              />
              <motion.button 
                className="btn btn-primary" 
                onClick={onSandboxLaunch}
              >
                EXECUTE <ChevronRight size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className={styles.processSection} id="workflow">
        <div className="container-max">
          <motion.h2 
            className={styles.centeredTitle}
            whileInView={{ opacity: 1 }}
            initial={{ opacity: 0 }}
          >
            Lifecycle <span className="text-silver">Gates</span>
            <div style={{ maxWidth: '600px', margin: '24px auto' }}><DrawingLine /></div>
          </motion.h2>
          <div className={styles.processGrid}>
            {[
              { icon: Database, title: 'Ingest', desc: 'Batch sync customer history.' },
              { icon: Users, title: 'Segment', desc: 'Define cohorts via logic.' },
              { icon: Zap, title: 'Craft', desc: 'Dynamic template synthesis.' },
              { icon: ArrowRight, title: 'Dispatch', desc: 'Multi-channel delivery.' },
              { icon: Activity, title: 'Track', desc: 'Real-time node telemetry.' },
              { icon: ShieldCheck, title: 'ROI', desc: 'Attribution lock.' }
            ].map((step, i) => (
              <motion.div 
                key={i} 
                className={styles.processStep}
                whileInView={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={styles.stepIconBox}>
                  <step.icon size={20} strokeWidth={1} className="text-silver" />
                </div>
                <h4>{step.title}</h4>
                <p className="text-caption">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className={styles.pricingSection} id="pricing">
        <div className="container-max">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <span className={styles.sectionTag}>Node Capacity</span>
            <h2 className={styles.sectionTitle}>
              Scale <span className="text-silver">Architecture</span>
              <div style={{ maxWidth: '400px', margin: '12px auto' }}><DrawingLine /></div>
            </h2>
          </div>
          <div className={styles.pricingGrid}>
            {/* Starter */}
            <div className={styles.pricingCard}>
              <span className="text-mono">v1.0_STARTER</span>
              <div className={styles.price}>$0</div>
              <div className="featureList">
                <div className={styles.featureItem}><Check size={14} /> 1,000 Customers</div>
                <div className={styles.featureItem}><Check size={14} /> Basic Segmentation</div>
              </div>
              <button className="btn btn-secondary w-full">Initialize</button>
            </div>

            {/* Pro */}
            <div className={`${styles.pricingCard} ${styles.proCard}`}>
              <span className="text-mono">v2.0_PROFESSIONAL</span>
              <div className={styles.price}>$49</div>
              <div className="featureList">
                <div className={styles.featureItem}><Check size={14} /> 50,000 Customers</div>
                <div className={styles.featureItem}><Check size={14} /> AI Cohort Discovery</div>
                <div className={styles.featureItem}><Check size={14} /> WhatsApp & SMS</div>
              </div>
              <button className="btn btn-primary w-full">Upgrade_Core</button>
            </div>

            {/* Enterprise */}
            <div className={styles.pricingCard}>
              <span className="text-mono">v3.0_ENTERPRISE</span>
              <div className={styles.price}>CUSTOM</div>
              <div className="featureList">
                <div className={styles.featureItem}><Check size={14} /> Unlimited Scale</div>
                <div className={styles.featureItem}><Check size={14} /> Dedicated Node Cluster</div>
              </div>
              <button className="btn btn-secondary w-full">Request_Quote</button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
