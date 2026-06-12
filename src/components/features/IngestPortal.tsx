'use client';

import { Download, CheckCircle2, Database } from 'lucide-react';
import styles from './IngestPortal.module.css';

interface IngestPortalProps {
  json: string;
  setJson: (val: string) => void;
  onApplyPreset: (preset: string) => void;
  onIngest: () => void;
  ingesting: boolean;
  result: string;
  onSeed: () => void;
  seeding: boolean;
}

export default function IngestPortal({
  json,
  setJson,
  onApplyPreset,
  onIngest,
  ingesting,
  result,
  onSeed,
  seeding
}: IngestPortalProps) {
  return (
    <div className={`${styles.container} animated-fade-in`}>
      <div className="bento-grid">
        {/* JSON Ingestion */}
        <div className="glass-panel p-24" style={{ gridColumn: 'span 7' }}>
          <div className={styles.sectionHeader}>
            <Download size={18} className="text-indigo" />
            <h3>JSON Ingestion Portal</h3>
          </div>

          <div className={styles.presets}>
            <button className="btn btn-secondary py-6" onClick={() => onApplyPreset('highrollers')}>High Rollers</button>
            <button className="btn btn-secondary py-6" onClick={() => onApplyPreset('lapsed')}>Lapsed Buyers</button>
            <button className="btn btn-secondary py-6" onClick={() => onApplyPreset('subscribers')}>Subscribers</button>
          </div>

          <div className={styles.inputGroup}>
            <label>Raw Ingestion Payload (Batch JSON)</label>
            <textarea 
              className={`${styles.textarea} input-field font-mono`}
              value={json}
              onChange={(e) => setJson(e.target.value)}
              placeholder='{ "customers": [...] }'
            />
          </div>

          <button 
            className="btn btn-primary w-full" 
            onClick={onIngest} 
            disabled={ingesting || !json.trim()}
          >
            {ingesting ? 'Transmitting Batch...' : 'Execute Ingestion'}
          </button>
        </div>

        {/* Database Management */}
        <div className="glass-panel p-24" style={{ gridColumn: 'span 5' }}>
          <div className={styles.sectionHeader}>
            <Database size={18} className="text-indigo" />
            <h3>State Management</h3>
          </div>

          <p className={styles.helpText}>
            Reset the SQLite environment and populate a fresh high-fidelity dataset for testing.
          </p>

          <button 
            className="btn btn-secondary w-full mb-16" 
            onClick={onSeed}
            disabled={seeding}
          >
            {seeding ? 'Seeding Tables...' : 'Seed Mock Dataset'}
          </button>

          {result && (
            <div className={styles.resultBox}>
              <div className={styles.resultHeader}>
                <CheckCircle2 size={12} className="text-green" />
                <span>Execution Result</span>
              </div>
              <pre>{result}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
