'use client';

import Sidebar from './Sidebar';
import styles from './ConsoleLayout.module.css';

interface ConsoleLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  channelOnline: boolean;
  crmOnline: boolean;
  title: string;
  subtitle: string;
}

export default function ConsoleLayout({
  children,
  activeTab,
  setActiveTab,
  channelOnline,
  crmOnline,
  title,
  subtitle
}: ConsoleLayoutProps) {
  return (
    <div className={styles.container}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        channelOnline={channelOnline} 
        crmOnline={crmOnline} 
      />
      
      <main className={styles.main}>
        <header className={styles.header}>
          <div className="container-max">
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
        </header>
        
        <div className={`${styles.content} container-max`}>
          {children}
        </div>
      </main>
    </div>
  );
}
