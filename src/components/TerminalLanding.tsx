import { useState, useEffect, useRef } from 'react';
import { useViewMode } from '../context/ViewModeContext';

interface TerminalLine {
  id: string;
  text: string;
  isCommand?: boolean;
}

export default function TerminalLanding() {
  const { setMode } = useViewMode();
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [typingText, setTypingText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const welcomeMessage = "> Hey, I am Gaurav. Thanks for visiting. Type 'help' or 'Hi' for options.";

  // Syntax highlighting logic
  const formatTerminalText = (text: string) => {
    if (!text) return null;
    
    // Split text by matching exactly our target keywords while capturing them
    const parts = text.split(/(Gaurav|'help'|'Hi'|>)/g);
    
    return parts.map((part, index) => {
      if (!part) return null;
      if (part === 'Gaurav') return <span key={index} style={{ color: 'var(--accent-color)' }}>{part}</span>;
      if (part === "'help'" || part === "'Hi'") return <span key={index} style={{ color: 'var(--term-keyword)' }}>{part}</span>;
      if (part === '>') return <span key={index} style={{ color: 'var(--term-prompt)' }}>{part}</span>;
      return <span key={index} style={{ color: 'var(--term-text)' }}>{part}</span>;
    });
  };

  // Initial typing effect
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypingText(welcomeMessage.substring(0, i));
      i++;
      if (i > welcomeMessage.length) {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history, typingText]);

  // Keep focus on input when clicking terminal
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      if (!cmd) return;

      const newCommand: TerminalLine = { 
        id: Date.now().toString(), 
        text: `> ${cmd}`, 
        isCommand: true 
      };
      
      const newHistory = [...history, newCommand];
      const lowerCmd = cmd.toLowerCase();

      if (lowerCmd === 'help' || lowerCmd === 'hi') {
        newHistory.push({ id: Date.now() + '1', text: "1. About" });
        newHistory.push({ id: Date.now() + '2', text: "2. Experience" });
        newHistory.push({ id: Date.now() + '3', text: "3. Skills" });
        newHistory.push({ id: Date.now() + '4', text: "4. Projects" });
        newHistory.push({ id: Date.now() + '5', text: "> Enter a number to navigate:" });
      } else if (['1', '2', '3', '4'].includes(cmd)) {
        // Handle navigation
        setMode('plain');
        const sectionMap: Record<string, string> = {
          '1': 'about',
          '2': 'experience',
          '3': 'skills',
          '4': 'projects'
        };
        
        setTimeout(() => {
          document.getElementById(sectionMap[cmd])?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return;
      } else {
        newHistory.push({ 
          id: Date.now() + 'err', 
          text: "> Command not found. Type 'help' for options." 
        });
      }

      setHistory(newHistory);
      setInput('');
    }
  };

  return (
    <div 
      className="terminal-landing-container" 
      onClick={handleTerminalClick}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem'
      }}
    >
      <div 
        className="terminal-window"
        style={{
          width: '100%',
          maxWidth: '800px',
          height: '60vh',
          background: 'var(--term-bg)',
          borderRadius: '10px',
          boxShadow: 'var(--shadow-terminal)',
          border: '2px solid var(--term-border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: 'var(--font-mono)'
        }}
      >
        {/* Terminal Header */}
        <div 
          className="terminal-header"
          style={{
            background: 'var(--term-header)',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: '1px solid var(--term-border)'
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }}></div>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }}></div>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }}></div>
          <div style={{ flex: 1, textAlign: 'center', color: 'var(--term-text)', fontSize: '0.8rem', letterSpacing: '0.5px', opacity: 0.7 }}>
            bash - gaurav_habad
          </div>
        </div>

        {/* Terminal Body */}
        <div 
          ref={containerRef}
          className="terminal-body"
          style={{
            padding: '1.5rem',
            flex: 1,
            overflowY: 'auto',
            color: 'var(--term-text)',
            fontSize: '1rem',
            lineHeight: 1.6
          }}
        >
          <div style={{ marginBottom: '1rem' }}>
            {formatTerminalText(typingText)}
            {typingText.length < welcomeMessage.length && (
              <span className="logo-cursor" style={{ background: 'var(--term-text)' }}></span>
            )}
          </div>

          {/* History Output */}
          {history.map(line => (
            <div 
              key={line.id} 
              style={{ 
                marginBottom: line.isCommand ? '1rem' : '0.2rem',
                color: line.isCommand ? 'var(--term-command)' : 'var(--term-text)',
                marginTop: line.isCommand ? '1.5rem' : '0',
                fontWeight: line.isCommand ? 500 : 400
              }}
            >
              {line.isCommand ? (
                <>
                  <span style={{ color: 'var(--term-prompt)', marginRight: '0.5rem' }}>{'>'}</span>
                  {line.text.replace('> ', '')}
                </>
              ) : formatTerminalText(line.text)}
            </div>
          ))}

          {/* Active Input Line */}
          {typingText.length === welcomeMessage.length && (
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
              <span style={{ color: 'var(--term-prompt)', marginRight: '0.5rem' }}>$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                autoComplete="off"
                spellCheck="false"
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--term-text)',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  flex: 1
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
