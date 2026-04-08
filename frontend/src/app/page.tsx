"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitSiteScrape } from '@/lib/api';
import { Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    try {
      const site = await submitSiteScrape(url);
      router.push(`/dashboard/${site.id}`);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 429) {
          alert('Rate limit exceeded. Please wait a moment.');
      } else {
          alert('Failed to scrape site');
      }
      setLoading(false);
    }
  };

  return (
    <main className="container flex flex-col items-center justify-center" style={{ minHeight: '100vh', padding: '0 24px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card flex flex-col items-center justify-center text-center"
        style={{ 
            maxWidth: '600px', 
            width: '100%', 
            padding: '64px 48px',
            border: '1px solid var(--panel-border)',
            boxShadow: 'var(--shadow-md)'
        }}
      >
        <div style={{ background: 'var(--color-primary)', color: 'white', padding: '12px', borderRadius: '12px', marginBottom: '24px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
        </div>

        <h1 style={{ color: 'var(--foreground)', fontSize: '32px', marginBottom: '12px', letterSpacing: '-0.02em' }}>
          StyleSync
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '16px', maxWidth: '400px' }}>
          Extract, organize, and export core design tokens directly from any live website.
        </p>

        <form onSubmit={handleScrape} className="flex items-center w-full" style={{ position: 'relative' }}>
          <input 
            type="url" 
            placeholder="e.g. https://stripe.com" 
            className="input" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ 
                width: '100%', 
                height: '56px', 
                fontSize: '16px',
                paddingLeft: '24px',
                paddingRight: '140px',
                borderRadius: '28px',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
                border: '1px solid #D1D5DB'
            }}
            required
            disabled={loading}
          />
          <button 
            type="submit" 
            className="btn btn-primary flex items-center justify-center gap-8"
            style={{ 
                height: '44px', 
                position: 'absolute',
                right: '6px',
                borderRadius: '22px',
                padding: '0 24px',
                fontWeight: 600
            }}
            disabled={loading}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <>Extract <ArrowRight size={16} /></>}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
