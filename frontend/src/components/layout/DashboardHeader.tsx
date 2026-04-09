"use client";

import { Plus, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardHeaderProps {
  domain?: string;
}

export default function DashboardHeader({ domain }: DashboardHeaderProps) {
  return (
    <header 
      style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--panel-border)',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        height: '64px',
        gap: '16px'
      }}
    >
      <div className="flex items-center gap-8">
        <div style={{ background: 'var(--color-primary)', color: 'white', padding: '6px', borderRadius: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '-0.02em' }}>StyleSync</span>
      </div>

      <div className="flex items-center gap-16">
        {domain && (
          <>
            <div className="flex items-center gap-6 px-10 py-4 bg-black/[0.03] border border-black/5 rounded-full" style={{ fontSize: '11px' }}>
              <motion.div 
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: '6px', height: '6px', background: 'var(--color-success)', borderRadius: '50%' }}
              />
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Dashboard</span>
            </div>
            <span style={{ 
              fontSize: '15px', 
              fontWeight: 600, 
              letterSpacing: '-0.01em', 
              color: 'var(--foreground)',
              maxWidth: '200px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>{domain}</span>
          </>
        )}
      </div>

      <div className="flex justify-end">
        <button 
          className="btn btn-primary flex items-center gap-8"
          onClick={() => window.location.href = '/'}
          style={{ padding: '8px 16px', borderRadius: '20px' }}
        >
          <Plus size={16} /> <span className="hide-mobile">Scrape Another</span>
        </button>
      </div>
    </header>
  );
}
