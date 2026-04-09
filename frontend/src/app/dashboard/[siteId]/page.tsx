"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTokenStore } from '@/stores/tokenStore';
import { getSiteTokens, getSite } from '@/lib/api';
import ColorPicker from '@/components/token-editor/ColorPicker';
import TypographyInspector from '@/components/token-editor/TypographyInspector';
import SpacingVisualizer from '@/components/token-editor/SpacingVisualizer';
import PreviewGrid from '@/components/preview-grid/PreviewGrid';
import ExportPanel from '@/components/export-panel/ExportPanel';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { motion } from 'framer-motion';
import { Loader2, Globe } from 'lucide-react';

export default function Dashboard() {
  const params = useParams();
  const siteId = params.siteId as string;
  const { setTokens, tokens, isUndoRedoing, fetchLocks, fetchSiteVersions, undo, redo } = useTokenStore();
  const [errorMSG, setErrorMSG] = useState('');
  const [siteDomain, setSiteDomain] = useState('');
  const [progress, setProgress] = useState(0);

  // 1. Database Polling Logic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmd = e.metaKey || e.ctrlKey;
      if (isCmd && e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo(siteId);
      } else if (isCmd && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
          e.preventDefault();
          redo(siteId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, siteId]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchTokens = async () => {
      if (!isMounted) return;
      try {
        const site = await getSite(siteId);
        if (site.status === 'completed') {
             setProgress(100);
             setTimeout(async () => {
                 if (!isMounted) return;
                 const data = await getSiteTokens(siteId);
                 setTokens(data);
                 fetchLocks(siteId);
                 fetchSiteVersions(siteId);
                 setSiteDomain(site.domain);
                 document.title = `StyleSync | ${site.domain}`;
             }, 500); 
        } else if (site.status === 'failed') {
             setErrorMSG('Scraping failed for this site.');
             setProgress(0);
        } else {
             setTimeout(fetchTokens, 2500);
        }
      } catch (err: any) {
         if (err.response?.status === 429) {
              setTimeout(fetchTokens, 5000); // Backoff for rate limit
         } else {
             console.error(err);
         }
      }
    };
    
    fetchTokens();
    return () => { isMounted = false; };
  }, [siteId, setTokens]);

  // 2. Progress Bar visual animation
  useEffect(() => {
    if (tokens || errorMSG) return;
    
    const progressInterval = setInterval(() => {
        setProgress(p => p < 90 ? p + (Math.random() * 15) : p);
    }, 800);
    
    return () => clearInterval(progressInterval);
  }, [tokens, errorMSG]);

  // Error is now handled inline with the beautiful "Extraction Blocked" UI below

  // Inject CSS variables locally for the preview grid
  const cssVars = tokens ? {
    '--color-primary': tokens.colors.primary,
    '--color-secondary': tokens.colors.secondary,
    '--color-accent': tokens.colors.accent,
    '--color-background': tokens.colors.background,
    '--color-text': tokens.colors.text,
    '--font-heading': tokens.typography.fontFamilies?.heading,
    '--font-body': tokens.typography.fontFamilies?.body,
    '--spacing-base': `${tokens.spacing.base}px`,
  } as React.CSSProperties : {};

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader domain={siteDomain} />
      
      {!tokens && !errorMSG && (
          <div style={{ position: 'fixed', top: '64px', left: 0, width: '100%', height: '4px', background: 'var(--panel-border)', zIndex: 50 }}>
              <motion.div 
                 initial={{ width: '0%' }}
                 animate={{ width: `${progress}%` }}
                 transition={{ ease: "easeInOut", duration: 0.8 }}
                 style={{ height: '100%', background: 'var(--color-primary)' }}
              />
          </div>
      )}

      {errorMSG && (
        <div className="flex-1 flex items-center justify-center p-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="panel flex flex-col items-center text-center gap-24"
            style={{ maxWidth: '480px', padding: '48px' }}
          >
            <div style={{ background: '#FEF2F2', border: '1px solid #FEE2E2', padding: '16px', borderRadius: '50%', color: '#EF4444' }}>
              <Globe size={32} />
            </div>
            <div className="flex flex-col gap-8">
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--foreground)' }}>Extraction Blocked</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {errorMSG === 'Scraping failed for this site.' 
                  ? "This site likely blocks automated scanners or requires authentication. StyleSync couldn't penetrate their design layer."
                  : errorMSG}
              </p>
            </div>
            
            <div className="flex flex-col gap-12 w-full">
               <h4 style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Suggested Actions</h4>
               <div className="flex flex-col gap-8">
                  <button 
                    className="btn btn-secondary w-full flex items-center justify-center gap-8"
                    onClick={() => window.location.href = '/'}
                  >
                    Try a different URL
                  </button>
                  <button 
                    className="btn btn-primary w-full flex items-center justify-center gap-8"
                    onClick={() => setTokens({
                        colors: { primary: '#6366f1', secondary: '#1e293b', accent: '#f59e0b', neutral: '#f1f5f9' },
                        typography: { fontFamilies: { heading: 'Inter', body: 'Inter' }, fontSizes: { base: '16px', h1: '48px', h2: '36px', h3: '24px' }, weights: { normal: 400, bold: 700 } },
                        spacing: { baseUnit: 8, scales: [0.5, 1, 2, 4] }
                    })}
                  >
                    Enter Tokens Manually
                  </button>
               </div>
            </div>
          </motion.div>
        </div>
      )}

      {!tokens && !errorMSG && (
        <div className="dashboard-grid">
          <aside className="panel flex-col gap-8 flex">
             <div className="skeleton" style={{ height: '24px', width: '120px' }} />
             <div className="skeleton" style={{ height: '200px', width: '100%', marginTop: '32px' }} />
             <div className="skeleton" style={{ height: '100px', width: '100%' }} />
          </aside>
          <main className="panel flex flex-col gap-16">
             <div className="skeleton" style={{ height: '40px', width: '40%' }} />
             <div className="skeleton" style={{ height: '100px', width: '100%' }} />
             <div className="skeleton" style={{ height: '100px', width: '100%' }} />
          </main>
          <aside className="panel flex-col gap-8 flex">
             <div className="skeleton" style={{ height: '40px', width: '100%' }} />
             <div className="skeleton" style={{ height: '150px', width: '100%', marginTop: '32px' }} />
          </aside>
        </div>
      )}
      {tokens && (
        <motion.div 
           initial={{ opacity: 0 }} 
           animate={{ opacity: 1 }} 
           className="dashboard-grid" 
           style={cssVars}
        >
          {/* Left Sidebar: Token Editor */}
          <aside className="panel flex-col gap-24 flex">
            <h2 style={{ fontSize: '16px' }}>Design Tokens</h2>
            <ColorPicker siteId={siteId} />
            <TypographyInspector siteId={siteId} />
            <SpacingVisualizer siteId={siteId} />
          </aside>

          {/* Center: Component Preview */}
          <main className="panel flex" style={{ background: '#F9FAFB' }}>
            <PreviewGrid />
          </main>

          {/* Right Sidebar: Export & History */}
          <aside className="panel flex-col gap-8 flex">
            <ExportPanel siteId={siteId} />
          </aside>
        </motion.div>
      )}

      {/* Undo/Redo Processing Overlay */}
      {isUndoRedoing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ 
                position: 'fixed', 
                inset: 0, 
                background: 'rgba(255, 255, 255, 0.4)', 
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}
          >
              <div className="card flex items-center gap-16" style={{ padding: '16px 32px' }}>
                  <Loader2 className="animate-spin" size={24} style={{ color: 'var(--color-primary)' }} />
                  <span style={{ fontWeight: 600 }}>Restoring previous version...</span>
              </div>
          </motion.div>
      )}
    </div>
  );
}
