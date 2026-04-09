import { useTokenStore } from '@/stores/tokenStore';
import { Undo2, Redo2, Download, Save, Loader2, Plus, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import * as api from '@/lib/api';

export default function ExportPanel({ siteId }: { siteId: string }) {
  const { tokens, saveChanges, isLoading, undo, redo, versions, currentVersionIndex, isUndoRedoing } = useTokenStore();
  const [format, setFormat] = useState<'css'|'json'|'tailwind'>('css');
  const [exportData, setExportData] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
        const t = setTimeout(() => setCopied(false), 2000);
        return () => clearTimeout(t);
    }
  }, [copied]);

  const handleExport = async () => {
    try {
        const data = await api.getSiteTokens(siteId);
        let content = '';
        if (format === 'css') {
            content = `:root {\n  --color-primary: ${data.colors?.primary};\n  --color-secondary: ${data.colors?.secondary};\n  --font-body: ${data.typography?.fontFamilies?.body};\n}`;
        } else if (format === 'tailwind') {
            const config = {
                theme: {
                    extend: {
                        colors: {
                            primary: data.colors?.primary,
                            secondary: data.colors?.secondary,
                        },
                        fontFamily: {
                            body: data.typography?.fontFamilies?.body?.split(','),
                            heading: data.typography?.fontFamilies?.heading?.split(','),
                        }
                    }
                }
            };
            content = `/** @type {import('tailwindcss').Config} */\nmodule.exports = ${JSON.stringify(config, null, 2)}`;
        } else {
            content = JSON.stringify(data, null, 2);
        }
        
        setExportData(content);
        await navigator.clipboard.writeText(content);
        setCopied(true);
    } catch(e) {
        console.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-24 h-full">
      <div className="flex flex-col gap-8">
        <h4 style={{ color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Actions</h4>
        

        <button 
           className="btn btn-primary flex items-center justify-center gap-8 w-full" 
           onClick={() => saveChanges(siteId)}
           disabled={isLoading}
        >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {isLoading ? 'Saving...' : 'Save Tokens'}
        </button>
        
        <div className="flex gap-8 w-full">
           <button 
               className="btn btn-secondary flex items-center justify-center gap-4 flex-1" 
               onClick={() => undo(siteId)}
               disabled={currentVersionIndex >= versions.length - 1 || isUndoRedoing || versions.length === 0}
            >
               {isUndoRedoing ? <Loader2 size={12} className="animate-spin" /> : <Undo2 size={12} />} Undo
           </button>
           <button 
               className="btn btn-secondary flex items-center justify-center gap-4 flex-1" 
               onClick={() => redo(siteId)}
               disabled={currentVersionIndex <= 0 || isUndoRedoing}
            >
               {isUndoRedoing ? <Loader2 size={12} className="animate-spin" /> : <Redo2 size={12} />} Redo
           </button>
        </div>
      </div>

      <div className="flex flex-col gap-16">
          <h4 style={{ color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Export Setup</h4>
          <div className="flex gap-8">
              <button 
                  className={`btn ${format === 'css' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1 }}
                  onClick={() => setFormat('css')}
              >CSS</button>
              <button 
                  className={`btn ${format === 'json' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1 }}
                  onClick={() => setFormat('json')}
              >JSON</button>
              <button 
                  className={`btn ${format === 'tailwind' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1 }}
                  onClick={() => setFormat('tailwind')}
              >Tailwind</button>
          </div>
          
          <button 
              className={`btn ${copied ? 'btn-primary' : 'btn-secondary'} flex items-center justify-center gap-8 w-full`} 
              onClick={handleExport}
              style={{ transition: 'all 0.2s ease-in-out' }}
          >
              {copied ? <Check size={14} /> : <Download size={14} />} 
              {copied ? 'Copied to Clipboard!' : 'Copy Tokens'}
          </button>

          {exportData && (
              <pre style={{ background: '#F9FAFB', border: '1px solid var(--panel-border)', padding: '16px', borderRadius: '8px', overflowX: 'auto', fontSize: '12px', color: 'var(--foreground)' }}>
                  {exportData}
              </pre>
          )}
      </div>
    </div>
  );
}
