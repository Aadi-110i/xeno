'use client';

import { Plus, Trash2, Sparkles, Layers } from 'lucide-react';
import styles from './SegmentBuilder.module.css';

interface VisualRule {
  field: 'totalSpent' | 'lastPurchaseDays' | 'preferredCategory' | 'newsletterSubscribed' | 'orderCount';
  operator: 'gte' | 'lte' | 'equals' | 'not_equals';
  value: string;
}

interface Segment {
  id: string;
  name: string;
  description: string;
  definition: string;
  size?: number;
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  totalSpent: number;
}

interface SegmentBuilderProps {
  visualRules: VisualRule[];
  onAddRule: () => void;
  onRemoveRule: (idx: number) => void;
  onRuleChange: (idx: number, field: string, value: any) => void;
  sqlPreview: string;
  segmentName: string;
  setSegmentName: (val: string) => void;
  onSaveVisual: () => void;
  
  aiPrompt: string;
  setAiPrompt: (val: string) => void;
  onAiBuild: () => void;
  generatingAi: boolean;
  aiGeneratedRules: any;
  newAiName: string;
  setNewAiName: (val: string) => void;
  onSaveAi: () => void;

  segments: Segment[];
  selectedId: string;
  onSelect: (id: string) => void;
  matchedCustomers: Customer[];
  loadingMatches: boolean;
}

export default function SegmentBuilder({
  visualRules,
  onAddRule,
  onRemoveRule,
  onRuleChange,
  sqlPreview,
  segmentName,
  setSegmentName,
  onSaveVisual,
  aiPrompt,
  setAiPrompt,
  onAiBuild,
  generatingAi,
  aiGeneratedRules,
  newAiName,
  setNewAiName,
  onSaveAi,
  segments,
  selectedId,
  onSelect,
  matchedCustomers,
  loadingMatches
}: SegmentBuilderProps) {
  return (
    <div className={`${styles.container} animated-fade-in`}>
      <div className="bento-grid">
        {/* Visual Rule Builder */}
        <div className="glass-panel p-24" style={{ gridColumn: 'span 7' }}>
          <div className={styles.sectionHeader}>
            <div className={styles.headerTitle}>
              <Layers size={18} className="text-indigo" />
              <h3>Visual Rule Orchestrator</h3>
            </div>
            <span className={styles.helperText}>Structured query builder</span>
          </div>

          <div className={styles.ruleList}>
            {visualRules.map((rule, idx) => (
              <div key={idx} className={styles.ruleRow}>
                <select 
                  className="select-field"
                  value={rule.field}
                  onChange={(e) => onRuleChange(idx, 'field', e.target.value)}
                >
                  <option value="totalSpent">Total Spent ($)</option>
                  <option value="lastPurchaseDays">Days Since Last Purchase</option>
                  <option value="preferredCategory">Preferred Category</option>
                  <option value="newsletterSubscribed">Newsletter Subscribed</option>
                  <option value="orderCount">Total Orders</option>
                </select>

                <select 
                  className="select-field"
                  value={rule.operator}
                  onChange={(e) => onRuleChange(idx, 'operator', e.target.value)}
                >
                  <option value="gte">Greater Than (&gt;=)</option>
                  <option value="lte">Less Than (&lt;=)</option>
                  <option value="equals">Equals (=)</option>
                  <option value="not_equals">Does Not Equal (!=)</option>
                </select>

                <input 
                  type="text"
                  className="input-field"
                  value={rule.value}
                  onChange={(e) => onRuleChange(idx, 'value', e.target.value)}
                  placeholder="Value"
                />

                <button 
                  className={styles.removeBtn}
                  onClick={() => onRemoveRule(idx)}
                  disabled={visualRules.length === 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <button className="btn btn-secondary py-8 mb-24" onClick={onAddRule}>
            <Plus size={14} /> Add Rule Logic
          </button>

          <div className={styles.sqlBox}>
            <label>SQLite Query Manifest</label>
            <code>{sqlPreview}</code>
          </div>

          <div className={styles.saveForm}>
            <div className={styles.inputGroup}>
              <label>Cohort Identity</label>
              <input 
                type="text"
                className="input-field"
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
                placeholder="e.g. High Value Shoppers"
              />
            </div>
            <button className="btn btn-primary" onClick={onSaveVisual}>
              Save Target Cohort
            </button>
          </div>
        </div>

        {/* AI Cohort Parser */}
        <div className="glass-panel p-24" style={{ gridColumn: 'span 5' }}>
          <div className={styles.sectionHeader}>
            <div className={styles.headerTitle}>
              <Sparkles size={18} className="text-indigo" />
              <h3>AI Natural Language Parser</h3>
            </div>
          </div>

          <p className={styles.aiHelp}>Describe your audience in plain English. Gemini will compile the query logic.</p>

          <textarea 
            className={`${styles.aiTextarea} input-field`}
            placeholder="e.g. Target users who spent more than $200 and shopped in the last 30 days..."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
          />

          <button 
            className="btn btn-primary w-full mt-16" 
            onClick={onAiBuild}
            disabled={generatingAi || !aiPrompt.trim()}
          >
            {generatingAi ? 'Compiling Manifest...' : 'Compile AI Segment'}
          </button>

          {aiGeneratedRules && (
            <div className={`${styles.aiResult} animated-fade-in`}>
              <div className={styles.resultHeader}>
                <span>Proposed Cohort Spec</span>
                <span className="badge badge-completed">{aiGeneratedRules.size} Matches</span>
              </div>
              
              <div className={styles.aiFields}>
                <input 
                  type="text"
                  className="input-field"
                  value={newAiName}
                  onChange={(e) => setNewAiName(e.target.value)}
                  placeholder="Segment Name"
                />
                <button className="btn btn-primary btn-sm" onClick={onSaveAi}>
                  Save AI Segment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Segments Library & Preview */}
      <div className="glass-panel p-24 mt-24">
        <h3 className={styles.libraryTitle}>Saved Segments Library</h3>
        <div className={styles.chipCloud}>
          {segments.map((seg) => (
            <button 
              key={seg.id} 
              className={`${styles.segmentChip} ${selectedId === seg.id ? styles.activeChip : ''}`}
              onClick={() => onSelect(seg.id)}
            >
              {seg.name} <span className={styles.chipSize}>{seg.size ?? 0}</span>
            </button>
          ))}
        </div>

        {selectedId && (
          <div className={`${styles.previewSection} animated-fade-in`}>
            <div className={styles.previewHeader}>
              <span>Matched Identity Preview ({matchedCustomers.length})</span>
            </div>
            {loadingMatches ? (
              <div className={styles.previewLoader}>Loading cohort profiles...</div>
            ) : (
              <div className={styles.previewList}>
                {matchedCustomers.slice(0, 8).map(sc => (
                  <div key={sc.id} className={styles.previewItem}>
                    <span>{sc.firstName} {sc.lastName}</span>
                    <span className="text-green font-mono">${sc.totalSpent.toFixed(2)}</span>
                  </div>
                ))}
                {matchedCustomers.length > 8 && <div className={styles.moreIndicator}>+ {matchedCustomers.length - 8} more identities</div>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
