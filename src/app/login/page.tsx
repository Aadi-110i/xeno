'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Cpu, Mail, Lock, ArrowRight, Code, Globe, Loader2 } from 'lucide-react';
import styles from '../auth.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Immersive Background */}
      <div className={styles.background}>
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className={`${styles.orb} ${styles.orb1}`} 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
            x: [0, -60, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className={`${styles.orb} ${styles.orb2}`} 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.15, 0.05],
            x: [0, 30, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className={`${styles.orb} ${styles.orb3}`} 
        />
      </div>

      <motion.div 
        className={styles.authCard}
        initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.logoWrapper}>
          <motion.div
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Cpu className={styles.logoIcon} size={40} />
          </motion.div>
          <span className={styles.logoText}>Xeno Intelligence</span>
        </div>

        <div className={styles.header}>
          <h1>Welcome Back</h1>
          <p>Access your autonomous orchestration console</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Registry Email</label>
            <div className={styles.inputContainer}>
              <input 
                type="email" 
                className={styles.inputField} 
                placeholder="name@company.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail className={styles.inputIcon} size={18} />
            </div>
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Access Key</label>
            <div className={styles.inputContainer}>
              <input 
                type="password" 
                className={styles.inputField} 
                placeholder="••••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock className={styles.inputIcon} size={18} />
            </div>
          </div>

          <button 
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <>Continue to Console <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className={styles.divider}>
          <span>External Auth</span>
        </div>

        <div className={styles.socialGrid}>
          <button className={styles.socialBtn}>
            <Globe size={18} /> Google
          </button>
          <button className={styles.socialBtn}>
            <Code size={18} /> GitHub
          </button>
        </div>

        <div className={styles.footer}>
          <span>First time here?</span>
          <Link href="/signup" className={styles.footerLink}>Request access</Link>
        </div>
      </motion.div>
    </div>
  );
}
