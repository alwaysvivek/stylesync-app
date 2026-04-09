"use client";

import { useTokenStore } from '@/stores/tokenStore';

export default function TypographyInspector({ siteId }: { siteId: string }) {
  const { tokens, updateTokenPath } = useTokenStore();
  
  if (!tokens || !tokens.typography) return null;
  const { fontFamilies = {}, sizes = {}, weights = {}, lineHeights = {} } = tokens.typography;

  const updateTypo = (key: string, value: any, commit = false) => {
    updateTokenPath('typography', key, value, commit);
  };

  return (
    <div className="flex flex-col gap-16">
      <h4 style={{ color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Typography</h4>
      
      {/* Font Families */}
      <div className="flex flex-col gap-4">
        <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--foreground)' }}>Heading Font</label>
        <input 
          className="input" 
          value={fontFamilies.heading || ''} 
          onChange={(e) => updateTypo('fontFamilies', { ...fontFamilies, heading: e.target.value }, false)}
          onBlur={(e) => updateTypo('fontFamilies', { ...fontFamilies, heading: e.target.value }, true)}
          style={{ width: '100%' }}
        />
      </div>

      <div className="flex flex-col gap-4">
        <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--foreground)' }}>Body Font</label>
        <input 
          className="input" 
          value={fontFamilies.body || ''} 
          onChange={(e) => updateTypo('fontFamilies', { ...fontFamilies, body: e.target.value }, false)}
          onBlur={(e) => updateTypo('fontFamilies', { ...fontFamilies, body: e.target.value }, true)}
          style={{ width: '100%' }}
        />
      </div>

      {/* Font Sizes */}
      <div className="flex gap-8">
        <div className="flex flex-col gap-4" style={{ flex: 1 }}>
          <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--foreground)' }}>H1 Size</label>
          <input 
            className="input" 
            value={sizes.h1 || '2.5rem'} 
            onChange={(e) => updateTypo('sizes', { ...sizes, h1: e.target.value }, false)}
            onBlur={(e) => updateTypo('sizes', { ...sizes, h1: e.target.value }, true)}
            style={{ width: '100%' }}
          />
        </div>
        <div className="flex flex-col gap-4" style={{ flex: 1 }}>
          <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--foreground)' }}>Body Size</label>
          <input 
            className="input" 
            value={sizes.p || '1rem'} 
            onChange={(e) => updateTypo('sizes', { ...sizes, p: e.target.value }, false)}
            onBlur={(e) => updateTypo('sizes', { ...sizes, p: e.target.value }, true)}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Font Weights */}
      <div className="flex gap-8">
        <div className="flex flex-col gap-4" style={{ flex: 1 }}>
          <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--foreground)' }}>Bold</label>
          <input 
            className="input" 
            type="number"
            min="100" max="900" step="100"
            value={weights.bold || '700'} 
            onChange={(e) => updateTypo('weights', { ...weights, bold: e.target.value }, true)}
            style={{ width: '100%' }}
          />
        </div>
        <div className="flex flex-col gap-4" style={{ flex: 1 }}>
          <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--foreground)' }}>Normal</label>
          <input 
            className="input" 
            type="number"
            min="100" max="900" step="100"
            value={weights.normal || '400'} 
            onChange={(e) => updateTypo('weights', { ...weights, normal: e.target.value }, true)}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Line Heights */}
      <div className="flex gap-8">
        <div className="flex flex-col gap-4" style={{ flex: 1 }}>
          <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--foreground)' }}>Tight</label>
          <input 
            className="input" 
            value={lineHeights.tight || '1.2'} 
            onChange={(e) => updateTypo('lineHeights', { ...lineHeights, tight: e.target.value }, false)}
            onBlur={(e) => updateTypo('lineHeights', { ...lineHeights, tight: e.target.value }, true)}
            style={{ width: '100%' }}
          />
        </div>
        <div className="flex flex-col gap-4" style={{ flex: 1 }}>
          <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--foreground)' }}>Relaxed</label>
          <input 
            className="input" 
            value={lineHeights.relaxed || '1.6'} 
            onChange={(e) => updateTypo('lineHeights', { ...lineHeights, relaxed: e.target.value }, false)}
            onBlur={(e) => updateTypo('lineHeights', { ...lineHeights, relaxed: e.target.value }, true)}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Live Specimen */}
      <div style={{ padding: '12px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid var(--panel-border)' }}>
        <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Live Specimen</p>
        <p style={{ 
          fontFamily: fontFamilies.heading || 'inherit', 
          fontSize: sizes.h1 || '2.5rem', 
          fontWeight: weights.bold || 700, 
          lineHeight: lineHeights.tight || 1.2,
          color: 'var(--foreground)',
          margin: 0
        }}>Heading</p>
        <p style={{ 
          fontFamily: fontFamilies.body || 'inherit', 
          fontSize: sizes.p || '1rem', 
          fontWeight: weights.normal || 400, 
          lineHeight: lineHeights.relaxed || 1.6,
          color: 'var(--text-secondary)',
          margin: '4px 0 0 0'
        }}>Body text specimen with the current settings applied live.</p>
      </div>
    </div>
  );
}
