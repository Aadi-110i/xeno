'use client';

import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Cpu, Database, Users, RefreshCw, Send, TrendingUp, ChevronRight, Check, Zap, Globe, Activity, ShieldCheck, Clock } from 'lucide-react';
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
    <div className={`${styles.landingContainer} mesh-gradient`}>
      <Navbar user={user} onEnterConsole={onEnterConsole} />
      
      {/* Hero Section */}
      <section className={styles.heroSection} id="product">
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            className={styles.heroBadge}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles size={14} />
            <span>AI-Native CRM Ecosystem</span>
          </motion.div>
          <h1 className={styles.heroTitle}>
            Precision Audience <br />
            <span className={styles.indigoText}>Orchestration.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Xeno leverages Gemini AI to parse shopper cohorts, generate high-converting templates, and track attribution across WhatsApp, SMS, and Email.
          </p>
          
          <div className={styles.ctaGroup}>
            <motion.button 
              className="btn btn-primary" 
              onClick={onEnterConsole}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Open Workspace <ArrowRight size={16} />
            </motion.button>
            <motion.button 
              className="btn btn-secondary" 
              onClick={() => document.getElementById('workflow')?.scrollIntoView()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Workflow
            </motion.button>
          </div>
        </motion.div>

        {/* System Health Card with Integrated Widget */}
        <motion.div 
          className={styles.healthCardWrapper}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <motion.div 
            className={`card p-32 ${styles.healthCard}`}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.healthHeader}>
              <Cpu size={20} className="text-indigo" />
              <h3>System Node Status</h3>
            </div>
            
            <div className={styles.healthGrid}>
              <div className={styles.healthItem}>
                <span className={styles.healthLabel}>Database</span>
                <div className={styles.healthStatus}>
                  <div className={`${styles.dot} ${crmOnline ? styles.online : ''}`} />
                  <span>{crmOnline ? 'Active' : 'Offline'}</span>
                </div>
              </div>
              <div className={styles.healthItem}>
                <span className={styles.healthLabel}>Gateway</span>
                <div className={styles.healthStatus}>
                  <div className={`${styles.dot} ${channelOnline ? styles.online : ''}`} />
                  <span>{channelOnline ? 'Live' : 'Offline'}</span>
                </div>
              </div>
              <div className={styles.healthItem}>
                <span className={styles.healthLabel}>Customers</span>
                <div className={styles.healthValue}>{dbStats.customers}</div>
              </div>
              <div className={styles.healthItem}>
                <span className={styles.healthLabel}>Transactions</span>
                <div className={styles.healthValue}>{dbStats.orders}</div>
              </div>
            </div>

            <button 
              className={`btn btn-secondary w-full ${styles.seedBtn}`}
              onClick={onSeedDatabase}
              disabled={seedingInProgress}
            >
              {seedingInProgress ? 'Syncing...' : 'Initialize Mock Data'}
            </button>
          </motion.div>

          {/* Inline AI Activity Stream */}
          <motion.div 
            className={styles.aiWidget}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className={styles.aiWidgetIcon}>
              <Zap size={14} />
            </div>
            <div className={styles.aiWidgetText}>
              <h4>Active Core</h4>
              <p>Predicting churn risk...</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Platform Intelligence Section */}
      <section className={styles.intelligenceSection}>
        <div className="container-max">
          <motion.div 
            className={styles.intelligenceCard}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            viewport={{ once: true }}
          >
            <div className={styles.intelligenceContent}>
              <span className={styles.intelligenceTag}>Advanced Core</span>
              <h2 className={styles.sectionTitle}>Platform <span className="text-indigo">Intelligence</span></h2>
              <p className={styles.sectionText}>
                Our neural network processes millions of data points to identify hidden patterns in customer behavior before they even manifest.
              </p>
              <div style={{ marginTop: '32px' }}>
                <div className={styles.featureItem}>
                  <Check size={16} className={styles.checkIcon} />
                  <span>Real-time cohort migration tracking</span>
                </div>
                <div className={styles.featureItem}>
                  <Check size={16} className={styles.checkIcon} />
                  <span>Predictive lifetime value modeling</span>
                </div>
                <div className={styles.featureItem}>
                  <Check size={16} className={styles.checkIcon} />
                  <span>Autonomous campaign optimization</span>
                </div>
              </div>
            </div>
            <div className={styles.intelligenceVisual}>
              <svg className={styles.nodeMap} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <motion.path 
                  d="M50 250 L150 150 L250 200 L350 50" 
                  stroke="var(--accent-indigo)" 
                  strokeWidth="3" 
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
                    r="6" 
                    fill="var(--bg-deep)" 
                    stroke="var(--accent-indigo)" 
                    strokeWidth="2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.2 }}
                  />
                ))}
                <motion.path 
                  d="M50 280 L150 220 L250 260 L350 180" 
                  stroke="var(--color-muted)" 
                  strokeWidth="1" 
                  strokeDasharray="4 4" 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sandbox Section */}
      <section className={styles.sandboxSection} id="system">
        <div className="container-max">
          <motion.div 
            className="card p-40"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            viewport={{ once: true }}
          >
            <div className={styles.sandboxGrid}>
              <div className={styles.sandboxInfo}>
                <h2 className={styles.sectionTitle}>Cohort <span className="text-indigo">Sandbox</span></h2>
                <p className={styles.sectionText}>
                  Describe your ideal audience in plain natural language.
                </p>
              </div>
              <div className={styles.sandboxInputBox}>
                <input 
                  type="text"
                  className={styles.input}
                  placeholder="e.g., Lapsed buyers who spent over $500 last quarter..."
                  value={aiSegmentPrompt}
                  onChange={(e) => setAiSegmentPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onSandboxLaunch()}
                />
                <motion.button 
                  className="btn btn-primary" 
                  onClick={onSandboxLaunch}
                  whileHover={{ gap: '12px' }}
                >
                  Analyze <ChevronRight size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Global Scale Redesign - Bento Grid */}
      <section className={styles.scaleSection}>
        <div className="container-max">
          <div className={styles.sectionHeaderCentered}>
            <span className={styles.intelligenceTag}>Performance Architecture</span>
            <h2 className={styles.sectionTitle}>Global Scale. <span className="text-indigo">Local Impact.</span></h2>
          </div>
          
          <div className={styles.bentoGrid}>
            {/* Primary Stat */}
            <motion.div 
              className={`${styles.bentoCard} ${styles.largeBento}`}
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.95 }}
              viewport={{ once: true }}
            >
              <div className={styles.bentoIconBox}>
                <Globe size={24} className="text-indigo" />
              </div>
              <div className={styles.bentoValue}>1.2M+</div>
              <div className={styles.bentoLabel}>Signals Processed Daily</div>
              <p className={styles.bentoDesc}>Orchestrating high-velocity data points across global node clusters.</p>
              <div className={styles.bentoNodes}>
                {[1, 2, 3, 4, 5].map(i => (
                  <motion.div 
                    key={i} 
                    className={styles.miniNode}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Secondary Stats */}
            <div className={styles.smallBentoCol}>
              <motion.div 
                className={styles.bentoCard}
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: 20 }}
                viewport={{ once: true }}
              >
                <div className={styles.bentoHeader}>
                  <Activity size={18} className="text-indigo" />
                  <span>Uptime</span>
                </div>
                <div className={styles.bentoValueSmall}>99.9%</div>
                <div className={styles.bentoLabelSmall}>Guaranteed availability</div>
              </motion.div>
              
              <motion.div 
                className={styles.bentoCard}
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className={styles.bentoHeader}>
                  <Clock size={18} className="text-indigo" />
                  <span>Latency</span>
                </div>
                <div className={styles.bentoValueSmall}>&lt;50ms</div>
                <div className={styles.bentoLabelSmall}>Average response time</div>
              </motion.div>

              <motion.div 
                className={styles.bentoCard}
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className={styles.bentoHeader}>
                  <ShieldCheck size={18} className="text-indigo" />
                  <span>Security</span>
                </div>
                <div className={styles.bentoValueSmall}>SOC2</div>
                <div className={styles.bentoLabelSmall}>Enterprise compliance</div>
              </motion.div>
            </div>
          </div>

          {/* Scrolling Marquee */}
          <div className={styles.marqueeContainer}>
            <div className={styles.marqueeContent}>
              {[...Array(2)].map((_, i) => (
                <div key={i} className={styles.marqueeRow}>
                  <div className={styles.brandLogo}>FORBES</div>
                  <div className={styles.brandLogo}>TECHCRUNCH</div>
                  <div className={styles.brandLogo}>WIRED</div>
                  <div className={styles.brandLogo}>VERGE</div>
                  <div className={styles.brandLogo}>BLOOMBERG</div>
                  <div className={styles.brandLogo}>QUARTZ</div>
                  <div className={styles.brandLogo}>NEXT</div>
                </div>
              ))}
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
            Automated <span className="text-indigo">Lifecycle</span>
          </motion.h2>
          <div className={styles.processGrid}>
            {[
              { icon: Database, title: 'Ingest', desc: 'Batch sync customer history.' },
              { icon: Users, title: 'Segment', desc: 'Define cohorts via AI.' },
              { icon: Sparkles, title: 'Craft', desc: 'AI personalized templates.' },
              { icon: Send, title: 'Dispatch', desc: 'Multi-channel staggered delivery.' },
              { icon: RefreshCw, title: 'Track', desc: 'Real-time webhook receipts.' },
              { icon: TrendingUp, title: 'ROI', desc: 'Automated attribution.' }
            ].map((step, i) => (
              <motion.div 
                key={i} 
                className={styles.processStep}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className={styles.stepIconBox}>
                  <step.icon size={20} className="text-indigo" />
                </div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className={styles.pricingSection} id="pricing">
        <div className="container-max">
          <div style={{ textAlign: 'center' }}>
            <span className={styles.intelligenceTag}>Flexible Plans</span>
            <h2 className={styles.sectionTitle}>Built for <span className="text-indigo">Growth</span></h2>
          </div>
          <div className={styles.pricingGrid}>
            {/* Starter */}
            <motion.div className={`card ${styles.pricingCard}`} whileHover={{ y: -10 }}>
              <div className={styles.pricingHeader}>
                <h4>Starter</h4>
                <div className={styles.price}>$0<span>/mo</span></div>
              </div>
              <ul className={styles.featureList}>
                <li className={styles.featureItem}><Check size={16} className={styles.checkIcon} /> 1,000 Customers</li>
                <li className={styles.featureItem}><Check size={16} className={styles.checkIcon} /> Basic Segmentation</li>
                <li className={styles.featureItem}><Check size={16} className={styles.checkIcon} /> Email Only</li>
              </ul>
              <button className="btn btn-secondary w-full">Start Free</button>
            </motion.div>

            {/* Pro */}
            <motion.div className={`card ${styles.pricingCard} ${styles.proCard}`} whileHover={{ y: -10 }}>
              <div className={styles.pricingHeader}>
                <h4>Professional <span className={styles.proTag}>MOST POPULAR</span></h4>
                <div className={styles.price}>$49<span>/mo</span></div>
              </div>
              <ul className={styles.featureList}>
                <li className={styles.featureItem}><Check size={16} className={styles.checkIcon} /> 50,000 Customers</li>
                <li className={styles.featureItem}><Check size={16} className={styles.checkIcon} /> AI Cohort Discovery</li>
                <li className={styles.featureItem}><Check size={16} className={styles.checkIcon} /> WhatsApp & SMS</li>
                <li className={styles.featureItem}><Check size={16} className={styles.checkIcon} /> Advanced Analytics</li>
              </ul>
              <button className="btn btn-primary w-full">Get Started</button>
            </motion.div>

            {/* Enterprise */}
            <motion.div className={`card ${styles.pricingCard}`} whileHover={{ y: -10 }}>
              <div className={styles.pricingHeader}>
                <h4>Enterprise</h4>
                <div className={styles.price}>Custom</div>
              </div>
              <ul className={styles.featureList}>
                <li className={styles.featureItem}><Check size={16} className={styles.checkIcon} /> Unlimited Customers</li>
                <li className={styles.featureItem}><Check size={16} className={styles.checkIcon} /> Custom AI Training</li>
                <li className={styles.featureItem}><Check size={16} className={styles.checkIcon} /> Dedicated Manager</li>
                <li className={styles.featureItem}><Check size={16} className={styles.checkIcon} /> 24/7 Priority Support</li>
              </ul>
              <button className="btn btn-secondary w-full">Contact Sales</button>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className="container-max">
          <div className={styles.footerContent}>
            <span>© 2026 Xeno CRM</span>
            <div className={styles.footerLinks}>
              <button className={styles.footerLink} onClick={onEnterConsole}>
                {user ? 'Dashboard' : 'Console'}
              </button>
              <a href="#" className={styles.footerLink}>API Status</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
