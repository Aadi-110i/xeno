'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';

// Layout Components
import LandingPage from '@/components/features/LandingPage';

// Interfaces
interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalSpent: number;
  customFields: string;
  createdAt: string;
}

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  // Diagnostics & Status
  const [channelOnline, setChannelOnline] = useState<boolean>(false);
  const [crmOnline] = useState<boolean>(true);
  const [seedingInProgress, setSeedingInProgress] = useState<boolean>(false);

  // Loaded Data States
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [aiSegmentPrompt, setAiSegmentPrompt] = useState<string>('');

  // Derived DB Stats
  const dbStats = useMemo(() => {
    if (customers.length > 0) {
      const totalSpentOrders = customers.reduce((acc, c) => acc + ((c as any).orders?.length || 0), 0);
      return {
        customers: customers.length,
        orders: totalSpentOrders || customers.length * 2
      };
    }
    return { customers: 0, orders: 0 };
  }, [customers]);

  const checkChannelServiceStatus = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:3001/status');
      if (res.ok) {
        setChannelOnline(true);
      } else {
        setChannelOnline(false);
      }
    } catch (e) {
      setChannelOnline(false);
    }
  }, []);

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await fetch('/api/customers');
      const data = await res.json();
      if (Array.isArray(data)) setCustomers(data);
    } catch (e) {
      console.error('Error fetching customers', e);
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        setUser(data.user);
      } catch (e) {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };
    checkUser();
    fetchCustomers();
    checkChannelServiceStatus();
  }, [fetchCustomers, checkChannelServiceStatus]);

  const handleSeedDatabase = async () => {
    setSeedingInProgress(true);
    try {
      const res = await fetch('/api/customers/seed', {
        method: 'POST'
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      await fetchCustomers();
    } catch (e: any) {
      alert(`Database seed failed: ${e.message}`);
    } finally {
      setSeedingInProgress(false);
    }
  };

  const handleEnterConsole = () => {
    if (!user) {
      router.push('/login');
    } else {
      router.push('/dashboard');
    }
  };

  const handleSandboxLaunch = () => {
    if (!aiSegmentPrompt.trim()) return;
    if (!user) {
      router.push('/login');
      return;
    }
    // In a real app, we'd pass the prompt via state or query param
    router.push('/dashboard');
  };

  if (loadingUser) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="text-indigo animate-pulse">Initializing Xeno...</div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="landing"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <LandingPage 
          user={user}
          onEnterConsole={handleEnterConsole}
          channelOnline={channelOnline}
          crmOnline={crmOnline}
          dbStats={dbStats}
          onSeedDatabase={handleSeedDatabase}
          seedingInProgress={seedingInProgress}
          aiSegmentPrompt={aiSegmentPrompt}
          setAiSegmentPrompt={setAiSegmentPrompt}
          onSandboxLaunch={handleSandboxLaunch}
        />
      </motion.div>
    </AnimatePresence>
  );
}
