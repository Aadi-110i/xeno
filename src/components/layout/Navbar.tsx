'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Cpu, LogOut } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar({ user, onEnterConsole }: { user?: any; onEnterConsole?: () => void }) {
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <motion.nav 
      className={styles.navbar}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.navContainer}>
        <div className={styles.logoGroup}>
          <Cpu className={styles.logoIcon} size={24} strokeWidth={1.5} />
          <span className={styles.logoText}>XENO</span>
        </div>
        
        <div className={styles.navLinks}>
          <a href="#product" className={styles.navLink}>Product</a>
          <a href="#workflow" className={styles.navLink}>Workflow</a>
          <a href="#system" className={styles.navLink}>System</a>
        </div>

        <div className={styles.authGroup}>
          {user ? (
            <div className={styles.userProfile}>
              <button className={styles.loginBtn} onClick={handleLogout} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <LogOut size={14} strokeWidth={2} /> Sign Out
              </button>
              <button className={styles.consoleBtn} onClick={onEnterConsole}>
                Console
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className={styles.loginBtn}>Login</Link>
              <Link href="/signup" className={styles.signupBtn}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
