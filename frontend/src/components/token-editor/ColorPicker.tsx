"use client";

import { useTokenStore } from '@/stores/tokenStore';
import { Lock, Unlock } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

// Basic utility to extract RGB from hex or rgb string to compute luminance
function parseColor(color: string) {
    if (!color) return null;
    let r=0, g=0, b=0;
    if (color.startsWith('#')) {
        let hex = color.replace('#', '');
        if (hex.length === 3) hex = hex.split('').map(c => c+c).join('');
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
    } else if (color.startsWith('rgb')) {
        const parts = color.match(/\d+/g);
        if (parts && parts.length >= 3) {
            r = parseInt(parts[0]);
            g = parseInt(parts[1]);
            b = parseInt(parts[2]);
        }
    }
    return [r, g, b];
}

function getLuminance(r: number, g: number, b: number) {
    const rs = r / 255;
    const gs = g / 255;
    const bs = b / 255;
    return 0.2126 * (rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4)) +
           0.7152 * (gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4)) +
           0.0722 * (bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4));
}

function getContrast(bg: string, fg: string) {
    const bgRGB = parseColor(bg);
    const fgRGB = parseColor(fg);
    if (!bgRGB || !fgRGB) return 0;
    
    const lum1 = getLuminance(bgRGB[0], bgRGB[1], bgRGB[2]);
    const lum2 = getLuminance(fgRGB[0], fgRGB[1], fgRGB[2]);
    const lightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (lightest + 0.05) / (darkest + 0.05);
}

export default function ColorPicker({ siteId }: { siteId: string }) {
  const { tokens, updateTokenPath, toggleLock, lockedPaths } = useTokenStore();
  
  if (!tokens) return null;
  const colors = tokens.colors || {};
  const bg = colors.background || '#ffffff';

  return (
    <div className="flex flex-col gap-16">
      <h4 style={{ color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Colors</h4>
      
      {Object.entries(colors).map(([key, value]) => {
        const isLocked = lockedPaths[`colors.${key}`];
        const contrast = key !== 'background' ? getContrast(bg as string, value as string) : null;
        let badge = null;
        if (contrast !== null) {
            if (contrast >= 7) badge = { text: 'AAA', color: 'var(--color-success)' };
            else if (contrast >= 4.5) badge = { text: 'AA', color: 'var(--color-primary)' };
            else badge = { text: 'Fail', color: 'var(--color-warning)' };
        }

        return (
          <div key={key} className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <input 
                type="color" 
                value={value as string} 
                onInput={(e: any) => updateTokenPath('colors', key, e.target.value, false)}
                onChange={(e) => updateTokenPath('colors', key, e.target.value, true)}
                style={{ width: '28px', height: '28px', border: '1px solid var(--panel-border)', borderRadius: '14px', cursor: 'pointer', padding: 0, overflow: 'hidden' }}
              />
              <div className="flex flex-col">
                <span style={{ fontSize: '13px', textTransform: 'capitalize', fontWeight: 500, color: 'var(--foreground)' }}>{key}</span>
                {badge && (
                  <span style={{ fontSize: '10px', color: badge.color, fontWeight: 600 }}>
                    {badge.text} Contrast ({contrast.toFixed(1)}:1)
                  </span>
                )}
              </div>
            </div>
            
            <button 
              onClick={() => toggleLock(siteId, 'colors', key, value)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isLocked ? 'var(--color-primary)' : 'var(--text-secondary)', outline: 'none', transition: 'all 0.15s', position: 'relative', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isLocked ? 0 : 0, scale: isLocked ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {isLocked ? (
                  <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
                    <Lock size={14} />
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
                    <Unlock size={14} />
                  </motion.div>
                )}
              </motion.div>
            </button>
          </div>
        );
      })}
    </div>
  );
}
