'use client';

import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  Database, 
  Sparkles,
  Layers,
  Activity,
  LogOut,
  Home,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './ConsoleNavbar.module.css';

interface ConsoleNavbarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  channelOnline: boolean;
  crmOnline: boolean;
}

export default function ConsoleNavbar({ activeTab, setActiveTab, channelOnline, crmOnline }: ConsoleNavbarProps) {
  const router = useRouter();
  const [showStatus, setShowStatus] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Telemetry', icon: LayoutDashboard },
    { id: 'customers', label: 'Shoppers', icon: Users },
    { id: 'segments', label: 'Segments', icon: Layers },
    { id: 'campaigns', label: 'Campaigns', icon: Target },
    { id: 'ingest', label: 'Data Ingest', icon: Database },
    { id: 'copilot', label: 'AI Copilot', icon: Sparkles },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={`${styles.container} container-max`}>
        <div className={styles.leftSection}>
          <Link href="/" className={styles.brand}>
            <div className={styles.logo}>
              <Activity size={18} className={styles.logoIcon} />
            </div>
            <span className={styles.brandName}>XENO</span>
          </Link>

          <div className={styles.divider} />

          <div className={styles.navLinks}>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
                {activeTab === item.id && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className={styles.activeIndicator} 
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.statusWrapper} onMouseEnter={() => setShowStatus(true)} onMouseLeave={() => setShowStatus(false)}>
            <div className={styles.statusTrigger}>
              <div className={`${styles.dot} ${channelOnline && crmOnline ? styles.online : styles.offline}`} />
              <span>System Status</span>
              <ChevronDown size={14} className={styles.chevron} />
            </div>

            {showStatus && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.statusDropdown}
              >
                <div className={styles.statusItem}>
                  <div className={`${styles.dot} ${channelOnline ? styles.online : styles.offline}`} />
                  <label>Gateway</label>
                  <span>{channelOnline ? 'Online' : 'Offline'}</span>
                </div>
                <div className={styles.statusItem}>
                  <div className={`${styles.dot} ${crmOnline ? styles.online : styles.offline}`} />
                  <label>Core</label>
                  <span>{crmOnline ? 'Online' : 'Offline'}</span>
                </div>
              </motion.div>
            )}
          </div>

          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
