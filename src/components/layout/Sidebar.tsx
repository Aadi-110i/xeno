'use client';

import { 
  LayoutDashboard, 
  Users, 
  Target, 
  Database, 
  Settings,
  Sparkles,
  Layers,
  Activity
} from 'lucide-react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  channelOnline: boolean;
  crmOnline: boolean;
}

export default function Sidebar({ activeTab, setActiveTab, channelOnline, crmOnline }: SidebarProps) {
  const navGroups = [
    {
      title: 'Explore',
      items: [
        { id: 'dashboard', label: 'Telemetry', icon: LayoutDashboard },
        { id: 'customers', label: 'Shoppers', icon: Users },
      ]
    },
    {
      title: 'Orchestrate',
      items: [
        { id: 'segments', label: 'Segments', icon: Layers },
        { id: 'campaigns', label: 'Campaigns', icon: Target },
      ]
    },
    {
      title: 'Manage',
      items: [
        { id: 'ingest', label: 'Data Ingest', icon: Database },
        { id: 'copilot', label: 'AI Copilot', icon: Sparkles },
      ]
    }
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <Activity size={20} className={styles.logoIcon} />
        </div>
        <span className={styles.brandName}>XENO</span>
      </div>

      <nav className={styles.nav}>
        {navGroups.map((group) => (
          <div key={group.title} className={styles.group}>
            <h4 className={styles.groupTitle}>{group.title}</h4>
            <div className={styles.groupItems}>
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                  {activeTab === item.id && <div className={styles.activeIndicator} />}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.statusGroup}>
          <div className={styles.statusItem}>
            <div className={`${styles.dot} ${channelOnline ? styles.online : styles.offline}`} />
            <span>Channel Service</span>
          </div>
          <div className={styles.statusItem}>
            <div className={`${styles.dot} ${crmOnline ? styles.online : styles.offline}`} />
            <span>CRM Core</span>
          </div>
        </div>
        
        <button className={styles.settingsBtn}>
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
