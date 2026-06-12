'use client';

import { Sparkles, Send, Cpu, MessageSquare, Target, Layers } from 'lucide-react';
import styles from './AiCopilot.module.css';

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
  action?: {
    type: string;
    payload: any;
  };
}

interface AiCopilotProps {
  chatHistory: ChatMessage[];
  chatInput: string;
  setChatInput: (val: string) => void;
  onSend: () => void;
  sending: boolean;
  onExecuteAction: (action: any) => void;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function AiCopilot({
  chatHistory,
  chatInput,
  setChatInput,
  onSend,
  sending,
  onExecuteAction,
  chatEndRef
}: AiCopilotProps) {
  return (
    <div className={`${styles.copilotContainer} animated-fade-in`}>
      <div className={styles.chatArea}>
        <div className={styles.messages}>
          {chatHistory.map((chat, idx) => (
            <div key={idx} className={`${styles.bubbleWrapper} ${chat.role === 'user' ? styles.userWrapper : styles.modelWrapper}`}>
              <div className={styles.avatar}>
                {chat.role === 'user' ? <MessageSquare size={14} /> : <Sparkles size={14} />}
              </div>
              
              <div className={styles.bubble}>
                <div className={styles.text}>{chat.parts[0].text}</div>
                
                {chat.action && (
                  <div className={styles.actionCard}>
                    <div className={styles.actionHeader}>
                      {chat.action.type === 'suggest_segment' ? <Layers size={14} /> : <Target size={14} />}
                      <span>AI Recommendation</span>
                    </div>
                    <p className={styles.actionDesc}>
                      {chat.action.type === 'suggest_segment' 
                        ? `Create target cohort: "${chat.action.payload.name}"`
                        : `Draft message template for campaign execution.`
                      }
                    </p>
                    <button className="btn btn-primary w-full py-6" style={{ fontSize: '12px' }} onClick={() => onExecuteAction(chat.action)}>
                      Execute Optimized Strategy
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {sending && (
            <div className={`${styles.bubbleWrapper} ${styles.modelWrapper}`}>
              <div className={styles.avatar}><Cpu size={14} className={styles.spin} /></div>
              <div className={styles.loadingBubble}>
                AI Agent is orchestrating a response...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <input 
            type="text" 
            className={styles.input} 
            placeholder="Describe audience goal or draft campaign copy..." 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
          />
          <button 
            className={`${styles.sendBtn} ${chatInput.trim() ? styles.sendActive : ''}`}
            onClick={onSend}
            disabled={sending || !chatInput.trim()}
          >
            <Send size={18} />
          </button>
        </div>
        <p className={styles.footerHint}>Press Enter to transmit query node to Xeno Brain</p>
      </div>
    </div>
  );
}
