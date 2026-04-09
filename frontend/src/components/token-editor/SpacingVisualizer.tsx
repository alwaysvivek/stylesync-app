"use client";

import { useTokenStore } from '@/stores/tokenStore';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SpacingVisualizer({ siteId }: { siteId: string }) {
  const { tokens, updateTokenPath } = useTokenStore();
  
  if (!tokens || !tokens.spacing) return null;
  const base = tokens.spacing.base || 16;
  
  // Local state for dragging to ensure smooth UI before sync
  const [localBase, setLocalBase] = useState(base);

  useEffect(() => {
    setLocalBase(base);
  }, [base]);

  const handleDrag = (event: any, info: any) => {
    const newBase = Math.max(4, Math.min(128, localBase + Math.round(info.delta.x / 2)));
    setLocalBase(newBase);
  };

  const handleDragEnd = () => {
    updateTokenPath('spacing', 'base', localBase);
  };

  return (
    <div className="flex flex-col gap-16">
      <h4 style={{ color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Spacing</h4>
      
      <div className="flex items-center justify-between">
        <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--foreground)' }}>Base Unit (px)</label>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)' }}>{localBase}px</span>
      </div>

      <div className="flex flex-col gap-12 mt-8">
        <div className="flex flex-col gap-4">
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Drag to Adjust (1x Scale)</span>
            <div className="flex items-center gap-8 relative" style={{ height: '24px' }}>
                <div style={{ 
                    width: `${localBase}px`, 
                    height: '16px', 
                    background: 'var(--color-primary)', 
                    borderRadius: '4px', 
                    opacity: 0.8,
                    transition: 'width 0.05s linear'
                }}></div>
                <motion.div 
                    drag="x"
                    dragConstraints={{ left: 0, right: 300 }}
                    dragElastic={0}
                    onDrag={handleDrag}
                    onDragEnd={handleDragEnd}
                    style={{ 
                        width: '12px', 
                        height: '24px', 
                        background: 'var(--foreground)', 
                        borderRadius: '6px', 
                        cursor: 'ew-resize',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        zIndex: 10
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9, background: 'var(--color-primary)' }}
                />
            </div>
        </div>

        <div className="flex flex-col gap-8 mt-8 border-t border-dashed pt-12" style={{ borderColor: 'var(--panel-border)' }}>
            <div className="flex items-center gap-8">
                <span style={{ fontSize: '11px', width: '30px', color: 'var(--text-secondary)' }}>0.5x</span>
                <div style={{ width: `${localBase * 0.5}px`, height: '8px', background: 'var(--text-secondary)', borderRadius: '2px', opacity: 0.4 }}></div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{localBase * 0.5}</span>
            </div>
            <div className="flex items-center gap-8">
                <span style={{ fontSize: '11px', width: '30px', color: 'var(--text-secondary)' }}>2x</span>
                <div style={{ width: `${localBase * 2}px`, height: '8px', background: 'var(--text-secondary)', borderRadius: '2px', opacity: 0.4 }}></div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{localBase * 2}</span>
            </div>
        </div>
      </div>
    </div>
  );
}
