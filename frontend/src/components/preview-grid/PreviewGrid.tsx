"use client";

import { useTokenStore } from '@/stores/tokenStore';

export default function PreviewGrid() {
  const { tokens } = useTokenStore();

  return (
    <div className="flex flex-col gap-32 h-full w-full" style={{ padding: '32px' }}>
      
      <div className="card flex flex-col gap-16">
        <h1 style={{ color: 'var(--color-primary)' }}>Typography & Hierarchy</h1>
        <p style={{ color: 'var(--text-secondary)' }}>This is a paragraph demonstrating the body text. Our live preview injects CSS variables to dynamically update the view based on the scraped design tokens.</p>
        
        <div className="flex flex-col gap-8 mt-16" style={{ padding: '16px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid var(--panel-border)' }}>
            <h1 style={{ fontSize: '24px', margin: 0, color: 'var(--foreground)' }}>H1 Heading (24px)</h1>
            <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--foreground)' }}>H2 Subheading (18px)</h2>
            <p style={{ fontSize: '14px', margin: 0, color: 'var(--text-secondary)' }}>Body paragraph (14px)</p>
            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Caption (12px)</span>
        </div>
      </div>

      <div className="card flex flex-col gap-16">
        <h2 style={{ color: 'var(--foreground)', fontSize: '16px' }}>Interactive Elements</h2>
        
        <div className="flex gap-16 items-center">
            <button className="btn btn-primary">Primary Action</button>
            <button className="btn btn-secondary">Secondary Action</button>
            <button className="btn" style={{ background: 'transparent', color: 'var(--color-primary)' }}>Ghost Button</button>
        </div>

        <div className="flex gap-16 mt-8">
            <input type="text" className="input" placeholder="Default Input" style={{ flex: 1 }} />
            <input type="text" className="input" placeholder="Error Input" style={{ flex: 1, borderColor: 'var(--color-warning)' }} />
        </div>
      </div>
      
      <div className="flex gap-16">
        <div className="card flex-col gap-8" style={{ flex: 1, borderTop: '3px solid var(--color-primary)' }}>
            <h3 style={{ fontSize: '14px', margin: 0, color: 'var(--foreground)' }}>Themed Card 1</h3>
            <p style={{ fontSize: '13px' }}>Using primary accent.</p>
        </div>
        <div className="card flex-col gap-8" style={{ flex: 1, borderTop: '3px solid var(--color-secondary)' }}>
            <h3 style={{ fontSize: '14px', margin: 0, color: 'var(--foreground)' }}>Themed Card 2</h3>
            <p style={{ fontSize: '13px' }}>Using secondary accent.</p>
        </div>
      </div>

    </div>
  );
}
