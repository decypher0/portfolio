import { useState, useEffect } from 'react';
import { Profile, SkillCategory, Experience, Project } from '../types';

interface ClientViewProps {
  profile: Profile | null;
  skills: SkillCategory[] | null;
  experience: Experience[] | null;
  projects: Project[] | null;
}

type EndpointId = 'profile' | 'skills' | 'experience' | 'projects';

interface EndpointConfig {
  id: EndpointId;
  name: string;
  path: string;
}

const endpoints: EndpointConfig[] = [
  { id: 'profile', name: 'Get Profile', path: '/v1/profile' },
  { id: 'skills', name: 'Get Skills', path: '/v1/skills' },
  { id: 'experience', name: 'Get Experience', path: '/v1/experience' },
  { id: 'projects', name: 'Get Projects', path: '/v1/projects' }
];

export default function ClientView({ profile, skills, experience, projects }: ClientViewProps) {
  const [activeEndpoint, setActiveEndpoint] = useState<EndpointId>('profile');
  const [flowStep, setFlowStep] = useState<number>(0);
  const [showDiagram, setShowDiagram] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  
  const [time, setTime] = useState(0);
  const [size, setSize] = useState('0 B');

  const getDataForEndpoint = (id: EndpointId) => {
    switch (id) {
      case 'profile': return profile;
      case 'skills': return skills;
      case 'experience': return experience;
      case 'projects': return projects;
      default: return null;
    }
  };

  const handleSend = () => {
    if (flowStep !== 0) return;
    
    setShowDiagram(true);
    setHasFetched(false);
    
    // Simulate Request Lifecycle
    setFlowStep(1); // Client Processing
    
    setTimeout(() => setFlowStep(2), 500); // Wait for snake to hit Auth
    setTimeout(() => setFlowStep(3), 1000); // Controller
    setTimeout(() => setFlowStep(4), 1500); // Service
    setTimeout(() => setFlowStep(5), 2000); // Database processing
    
    // Reverse Return Trip
    setTimeout(() => setFlowStep(6), 2600); // DB responds
    setTimeout(() => setFlowStep(7), 3100);
    setTimeout(() => setFlowStep(8), 3600);
    setTimeout(() => setFlowStep(9), 4100);
    setTimeout(() => setFlowStep(10), 4600); // Client Success 200 OK
    
    setTimeout(() => {
      const data = getDataForEndpoint(activeEndpoint);
      const bytes = new TextEncoder().encode(JSON.stringify(data)).length;
      setSize(bytes > 1024 ? `${(bytes / 1024).toFixed(2)} KB` : `${bytes} B`);
      setTime(Math.floor(Math.random() * 100) + 1200); 
      
      setFlowStep(0);
      setShowDiagram(false);
      setHasFetched(true);
    }, 5400); // Hold final success state briefly
  };

  const renderHighlightedJson = (obj: unknown) => {
    const rawStr = JSON.stringify(obj, null, 2);
    const htmlStr = rawStr.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let color = 'inherit';
      let fw = 'normal';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          color = '#56b6c2';
        } else {
          color = '#98c379';
        }
      } else if (/true|false/.test(match)) {
        color = '#c678dd';
        fw = 'bold';
      } else if (/null/.test(match)) {
        color = '#e06c75';
      } else {
        color = '#d19a66';
      }
      return `<span style="color: ${color}; font-weight: ${fw}">${match}</span>`;
    });
    return (
      <pre 
        className="whitespace-pre-wrap break-words overflow-x-auto text-sm" 
        style={{ margin: 0, padding: '1rem', background: 'transparent', border: 'none', fontFamily: 'var(--font-mono)' }} 
        dangerouslySetInnerHTML={{ __html: htmlStr }} 
      />
    );
  };

  const currentData = getDataForEndpoint(activeEndpoint);
  const activeConfig = endpoints.find(e => e.id === activeEndpoint);
  const isFetching = flowStep !== 0;

  const renderNode = (label: string, fStep: number, rStep: number, themeColor: string) => {
    const isActive = flowStep >= fStep && flowStep < rStep;
    const isSuccess = flowStep >= rStep;
    
    // Success returns immediately to emerald
    const bgColor = isSuccess ? '#10b981' : (isActive ? themeColor : 'var(--pipe-node-bg)');
    const borderColor = (isSuccess || isActive) ? 'transparent' : 'var(--pipe-node-border)';
    const textColor = (isSuccess || isActive) ? 'white' : 'var(--pipe-text)';
    
    return (
      <div 
        className={`pipeline-node ${isActive ? 'active' : ''} ${isSuccess ? 'success' : ''}`}
        style={{ 
          backgroundColor: bgColor, 
          borderColor: borderColor, 
          color: textColor,
          minWidth: '80px',
          fontWeight: 700,
          '--pulse-color': isActive ? themeColor : 'transparent',
          boxShadow: isSuccess ? '0 4px 10px rgba(16, 185, 129, 0.4)' : ''
        } as React.CSSProperties}
      >
        {label}
      </div>
    );
  };

  const renderTrack = (fStep: number, rStep: number, forwardColor: string) => {
    const isForwardActive = flowStep >= fStep;
    const isReverseActive = flowStep >= rStep;
    
    return (
      <div style={{ position: 'relative', flex: 1, minWidth: '40px', height: '4px', backgroundColor: 'var(--pipe-line)', margin: '0 4px', borderRadius: '4px', overflow: 'hidden' }}>
        {/* Forward Packet */}
        <div style={{
          position: 'absolute', top: 0, left: 0, height: '100%', 
          backgroundColor: forwardColor, 
          boxShadow: `0 0 10px ${forwardColor}`,
          width: isForwardActive ? '100%' : '0%',
          opacity: isReverseActive ? 0 : 1, // Instantly vanish when reverse hits
          transition: 'width 0.5s linear',
        }}></div>
        
        {/* Reverse Packet (Green Success Route) */}
        <div style={{
          position: 'absolute', top: 0, right: 0, height: '100%', 
          backgroundColor: '#10b981', 
          boxShadow: '0 0 10px #10b981',
          width: isReverseActive ? '100%' : '0%',
          transition: 'width 0.5s linear',
        }}></div>
      </div>
    );
  };

  return (
    <div className="flex w-full overflow-hidden text-sm font-sans" style={{ height: 'calc(100vh - 80px)', backgroundColor: 'var(--pm-workspace)', color: 'var(--pm-text)' }}>
      
      {/* Left Sidebar (Collections) */}
      <aside className="w-64 flex-shrink-0 overflow-y-auto" style={{ backgroundColor: 'var(--pm-sidebar)', borderRight: '1px solid var(--pm-border)' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--pm-border)' }}>
          <h2 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', margin: 0 }}>
            Collections
          </h2>
        </div>
        <div style={{ padding: '0.5rem' }}>
          {endpoints.map(ep => {
            const isActive = activeEndpoint === ep.id;
            return (
              <button 
                key={ep.id}
                onClick={() => {
                  if (isFetching) return;
                  setActiveEndpoint(ep.id);
                  setHasFetched(false); 
                }}
                disabled={isFetching}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: isActive ? 'var(--pm-active)' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isFetching ? 'not-allowed' : 'pointer',
                  color: 'inherit',
                  textAlign: 'left',
                  transition: 'background 0.2s',
                  marginBottom: '2px',
                  opacity: isFetching && !isActive ? 0.5 : 1
                }}
                onMouseOver={(e) => { if (!isActive && !isFetching) e.currentTarget.style.backgroundColor = 'var(--pm-hover)'; }}
                onMouseOut={(e) => { if (!isActive && !isFetching) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <span style={{ color: 'var(--pm-method)', fontWeight: 700, fontSize: '0.75rem' }}>GET</span>
                <span>{ep.name}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Right Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto" style={{ backgroundColor: 'var(--pm-workspace)' }}>
        
        {/* Top Area (URL & Send) */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--pm-border)' }}>
          <div style={{ display: 'flex', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--pm-border)', height: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', backgroundColor: 'var(--pm-sidebar)', borderRight: '1px solid var(--pm-border)', fontWeight: 600, color: 'var(--pm-method)' }}>
              GET
            </div>
            <input 
               type="text" 
               readOnly 
               value={`https://api.myportfolio.com${activeConfig?.path || ''}`}
               style={{ flex: 1, border: 'none', padding: '0 1rem', backgroundColor: 'transparent', color: 'inherit', outline: 'none', fontFamily: 'var(--font-mono)' }} 
            />
            <button 
              onClick={handleSend}
              disabled={isFetching}
              style={{
                backgroundColor: 'var(--pm-btn)',
                color: 'white',
                border: 'none',
                padding: '0 2rem',
                fontWeight: 600,
                cursor: isFetching ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => { if(!isFetching) e.currentTarget.style.backgroundColor = 'var(--pm-btn-hover)'; }}
              onMouseOut={(e) => { if(!isFetching) e.currentTarget.style.backgroundColor = 'var(--pm-btn)'; }}
            >
              {isFetching ? 'Sending...' : 'Send'}
            </button>
          </div>
          
          {/* Request Pane Tabs */}
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', borderBottom: '1px solid var(--pm-border)', paddingBottom: '0.75rem' }}>
            <div style={{ paddingBottom: '0.75rem', marginBottom: '-0.75rem', borderBottom: '2px solid var(--accent-color)', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}>Params</div>
            <div style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Authorization</div>
            <div style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Headers <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--pm-active)', padding: '0 4px', borderRadius: '4px', marginLeft: '4px'}}>2</span></div>
            <div style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Body</div>
          </div>
          
          {/* Params Table */}
          <div style={{ marginTop: '1rem' }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Query Params</h3>
            <div style={{ border: '1px solid var(--pm-border)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', borderBottom: '1px solid var(--pm-border)' }}>
                <div style={{ padding: '0.5rem', borderRight: '1px solid var(--pm-border)', color: 'var(--text-muted)' }}>Key</div>
                <div style={{ padding: '0.5rem', borderRight: '1px solid var(--pm-border)', color: 'var(--text-muted)' }}>Value</div>
                <div style={{ padding: '0.5rem', color: 'var(--text-muted)' }}>Description</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr' }}>
                <div style={{ padding: '0.5rem', borderRight: '1px solid var(--pm-border)', opacity: 0.5 }}>key</div>
                <div style={{ padding: '0.5rem', borderRight: '1px solid var(--pm-border)', opacity: 0.5 }}>value</div>
                <div style={{ padding: '0.5rem', opacity: 0.5 }}>Description</div>
              </div>
            </div>
          </div>
        </div>

        {/* Response Pane / Flowchart Wrapper */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--pm-sidebar)', borderTop: '2px solid var(--pm-border)' }}>
          
          {/* Default Meta Bar (Hidden during chart) */}
          {!showDiagram && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid var(--pm-border)' }}>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <div style={{ paddingBottom: '0.2rem', borderBottom: '2px solid var(--accent-color)', fontWeight: 600, cursor: 'pointer' }}>Body</div>
                <div style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Cookies</div>
                <div style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Headers <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--pm-active)', padding: '0 4px', borderRadius: '4px', marginLeft: '4px'}}>10</span></div>
              </div>
              {hasFetched && (
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                  <span>Status: <span style={{ color: '#2ea043', fontWeight: 'bold' }}>200 OK</span></span>
                  <span>Time: <span style={{ color: '#2ea043', fontWeight: 'bold' }}>{time} ms</span></span>
                  <span>Size: <span style={{ color: '#2ea043', fontWeight: 'bold' }}>{size}</span></span>
                </div>
              )}
            </div>
          )}
          
          {/* Main Display Area (Diagram OR JSON Output) */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            
            {showDiagram ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', animation: 'fadeIn 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '900px', margin: '0 auto' }}>
                  
                  {renderNode('Client', 1, 10, '#6b7280')}
                  {renderTrack(1, 9, '#f97316')} {/* Client to Auth (Orange) */}
                  
                  {renderNode('Auth', 2, 9, '#f97316')}
                  {renderTrack(2, 8, '#3b82f6')} {/* Auth to Controller (Blue) */}
                  
                  {renderNode('Controller', 3, 8, '#3b82f6')}
                  {renderTrack(3, 7, '#a855f7')} {/* Controller to Service (Purple) */}
                  
                  {renderNode('Service', 4, 7, '#a855f7')}
                  {renderTrack(4, 6, '#10b981')} {/* Service to DB (Emerald) */}
                  
                  {renderNode('Database', 5, 6, '#10b981')}

                </div>
              </div>
            ) : hasFetched ? (
              <div style={{ backgroundColor: 'var(--pm-workspace)', borderRadius: '6px', border: '1px solid var(--pm-border)', height: '100%' }}>
                {renderHighlightedJson(currentData)}
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                No response data yet. Click Send.
              </div>
            )}
            
          </div>
        </div>
      </main>

    </div>
  );
}
