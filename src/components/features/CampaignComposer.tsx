'use client';

import { 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  Play, 
  Smartphone,
  MessageCircle,
  Mail,
  Zap
} from 'lucide-react';
import styles from './CampaignComposer.module.css';

interface Segment {
  id: string;
  name: string;
  size?: number;
}

interface CampaignComposerProps {
  step: number;
  setStep: (step: number) => void;
  name: string;
  setName: (val: string) => void;
  desc: string;
  setDesc: (val: string) => void;
  channel: 'whatsapp' | 'sms' | 'email' | 'rcs';
  setChannel: (val: any) => void;
  segmentId: string;
  setSegmentId: (val: string) => void;
  template: string;
  setTemplate: (val: string) => void;
  aiObjective: string;
  setAiObjective: (val: string) => void;
  onAiCopywrite: () => void;
  generatingCopy: boolean;
  onCreate: () => void;
  segments: Segment[];
}

export default function CampaignComposer({
  step,
  setStep,
  name,
  setName,
  channel,
  setChannel,
  segmentId,
  setSegmentId,
  template,
  setTemplate,
  aiObjective,
  setAiObjective,
  onAiCopywrite,
  generatingCopy,
  onCreate,
  segments
}: CampaignComposerProps) {
  const activeSegment = segments.find(s => s.id === segmentId);

  return (
    <div className={`${styles.composerGrid} animated-fade-in`}>
      {/* Wizard Panel */}
      <div className="card overflow-hidden">
        <div className={styles.wizardSteps}>
          {[1, 2, 3].map(i => (
            <div key={i} className={`${styles.wizardStep} ${step >= i ? styles.activeStep : ''}`}>
              <div className={styles.stepNum}>{i}</div>
              <span>{i === 1 ? 'Configure' : i === 2 ? 'Craft' : 'Review'}</span>
              {i < 3 && <ChevronRight size={14} className={styles.chevron} />}
            </div>
          ))}
        </div>

        <div className={styles.wizardForm}>
          {step === 1 && (
            <div className={styles.formContent}>
              <div className={styles.formGroup}>
                <label>Campaign Name</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="e.g. Q4 Loyalty Boost"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Target Channel</label>
                <div className={styles.channelGrid}>
                  {[
                    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
                    { id: 'sms', label: 'SMS', icon: Smartphone },
                    { id: 'email', label: 'Email', icon: Mail },
                    { id: 'rcs', label: 'RCS', icon: Zap }
                  ].map(ch => (
                    <button
                      key={ch.id}
                      className={`${styles.channelBtn} ${channel === ch.id ? styles.activeChannel : ''}`}
                      onClick={() => setChannel(ch.id as any)}
                    >
                      <ch.icon size={16} />
                      <span>{ch.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Audience Cohort</label>
                <select 
                  className={styles.select}
                  value={segmentId}
                  onChange={(e) => setSegmentId(e.target.value)}
                >
                  <option value="">-- Select Target Audience --</option>
                  {segments.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.size ?? 0} shoppers)</option>
                  ))}
                </select>
              </div>

              <button 
                className="btn btn-primary mt-16" 
                disabled={!name || !segmentId}
                onClick={() => setStep(2)}
              >
                Continue to Content <ArrowRight size={14} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className={styles.formContent}>
              <div className={styles.aiCopyBox}>
                <div className={styles.aiHeader}>
                  <Zap size={14} strokeWidth={1} className="text-silver" />
                  <span>AI Objective Compiler</span>
                </div>
                <div className={styles.aiInputRow}>
                  <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="e.g. Write a friendly promo..." 
                    value={aiObjective}
                    onChange={(e) => setAiObjective(e.target.value)}
                  />
                  <button 
                    className="btn btn-primary" 
                    disabled={generatingCopy || !aiObjective.trim()}
                    onClick={onAiCopywrite}
                  >
                    {generatingCopy ? 'Drafting...' : 'Generate'}
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Message Template</label>
                <textarea 
                  className={styles.templateArea}
                  placeholder="Hello [Name], we noticed you liked [Category]..."
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                />
                <span className={styles.varsHint}>Vars: [Name], [Spent]</span>
              </div>

              <div className={styles.btnRow}>
                <button className="btn btn-secondary flex-1" onClick={() => setStep(1)}>Back</button>
                <button 
                  className="btn btn-primary flex-1" 
                  disabled={!template}
                  onClick={() => setStep(3)}
                >
                  Review Summary <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.formContent}>
              <div className={styles.reviewCard}>
                <h4 className={styles.reviewTitle}>Execution Manifest</h4>
                <div className={styles.reviewGrid}>
                  <div className={styles.reviewItem}>
                    <label>Identity</label>
                    <span>{name}</span>
                  </div>
                  <div className={styles.reviewItem}>
                    <label>Channel</label>
                    <span className={styles.channelLabel}>{channel}</span>
                  </div>
                  <div className={styles.reviewItem}>
                    <label>Target Audience</label>
                    <span>{activeSegment?.name} ({activeSegment?.size || 0} matches)</span>
                  </div>
                </div>
              </div>

              <div className={styles.btnRow}>
                <button className="btn btn-secondary flex-1" onClick={() => setStep(2)}>Back</button>
                <button className="btn btn-primary flex-1" onClick={onCreate}>
                  Dispatch Campaign <Play size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Simulator Panel */}
      <div className={styles.simulatorPanel}>
        <div className={styles.simulatorTitle}>
          <Smartphone size={14} />
          <span>Real-time Deliverability Simulator</span>
        </div>
        
        <div className={styles.phoneFrame}>
          <div className={styles.phoneNotch} />
          <div className={styles.phoneScreen}>
            <div className={styles.appHeader}>
              <div className={styles.avatar}>X</div>
              <div className={styles.appInfo}>
                <div className={styles.appName}>
                  {channel === 'whatsapp' ? 'WhatsApp Business' : channel === 'sms' ? 'iMessage' : channel === 'email' ? 'Outlook' : 'RCS Messaging'}
                </div>
                <div className={styles.appStatus}>Encrypted Node</div>
              </div>
            </div>
            
            <div className={styles.chatArea}>
              <div className={styles.systemBubble}>
                Welcome to Xeno Preview. Craft your message on the left to see live rendering.
              </div>
              
              {template && (
                <div className={styles.outgoingBubble}>
                  {template
                    .replace(/\[Name\]/g, 'Maximilian')
                    .replace(/\[Spent\]/g, '$1,250.00')
                  }
                  <div className={styles.bubbleTime}>9:41 AM</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
