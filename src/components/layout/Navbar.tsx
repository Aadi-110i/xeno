'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Cpu } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar({ user, onEnterConsole }: { user?: any; onEnterConsole?: () => void }) {
  return (
    <motion.nav 
      className={styles.navbar}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.navContainer}>
        <div className={styles.logoGroup}>
          <Cpu className={styles.logoIcon} size={24} />
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
              <span className={styles.welcomeText}>
                Hello, <span className={styles.userName}>{user.name || user.email.split('@')[0]}</span>
              </span>
              <button className={styles.consoleBtn} onClick={onEnterConsole}>
                Go to Console
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
