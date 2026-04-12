import { useState, useEffect, useRef } from 'react';
import { useViewMode } from '../context/ViewModeContext';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

interface TerminalLine {
  id: string;
  text: string;
  isCommand?: boolean;
  element?: React.ReactNode;
}

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

const TypewriterText = ({ text, renderElement }: { text: string, renderElement?: React.ReactNode }) => {
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone] = useState(false);
  
  useEffect(() => {
    if (!text) {
      setIsDone(true);
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.substring(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        setIsDone(true);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [text]);
  
  return (
    <span style={{ display: 'inline-block', width: '100%' }}>
      {formatTerminalText(displayed)}
      {text && !isDone && <span className="logo-cursor" style={{ background: 'var(--term-text)' }}></span>}
      {isDone && renderElement}
    </span>
  );
};

export default function TerminalLanding() {
  const { setMode } = useViewMode();
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [typingText, setTypingText] = useState('');
  const [terminalContext, setTerminalContext] = useState<'main' | 'socials'>('main');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const welcomeMessage = "> Hey, I am Gaurav. Thanks for visiting. Type 'help' or 'Hi' for options.";

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
      const parts = cmd.split(' ').filter(Boolean);
      const lowerCmd = parts.length > 0 ? parts[0].toLowerCase().trim() : '';
      const arg1 = parts.length > 1 ? parts[1].toLowerCase().trim() : '';

      if (lowerCmd === 'clear') {
        setHistory([]);
        setInput('');
        return;
      }

      if (terminalContext === 'socials') {
        if (lowerCmd === 'a') {
           window.open('https://www.linkedin.com/in/gaurav-habad-2aa064131/', '_blank');
           newHistory.push({ id: Date.now() + 'o', text: "> Opening LinkedIn..." });
           setTerminalContext('main');
        } else if (lowerCmd === 'b') {
           window.open('https://github.com/decypher0', '_blank');
           newHistory.push({ id: Date.now() + 'o', text: "> Opening GitHub..." });
           setTerminalContext('main');
        } else if (lowerCmd === 'c') {
           window.open('mailto:gauravhabad113@gmail.com', '_blank');
           newHistory.push({ id: Date.now() + 'o', text: "> Opening Email client..." });
           setTerminalContext('main');
        } else if (lowerCmd === 'back' || lowerCmd === 'exit') {
           newHistory.push({ id: Date.now() + 'o', text: "> Returning to main menu. Type 'help' for options." });
           setTerminalContext('main');
        } else {
           newHistory.push({ id: Date.now() + 'e', text: "> Invalid option. Type a, b, c, or 'back'." });
        }
        setHistory(newHistory);
        setInput('');
        return;
      }

      if (lowerCmd === 'pwd') {
        newHistory.push({ id: Date.now() + 'pwd', text: "/users/gaurav/portfolio" });
      } else if (lowerCmd === 'ls') {
        newHistory.push({ id: Date.now() + 'ls', text: '', element: (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px', color: 'var(--term-keyword)', marginTop: '8px', marginBottom: '8px' }}>
            <div>About</div>
            <div>Experience</div>
            <div>Skills</div>
            <div>Projects</div>
            <div>Socials</div>
          </div>
        )});
      } else if (lowerCmd === 'whoami') {
        newHistory.push({ id: Date.now() + 'whoami', text: "A brief professional bio: Senior Backend Developer crafting robust and distributed systems." });
      } else if (lowerCmd === 'date') {
        newHistory.push({ id: Date.now() + 'date', text: new Date().toString() });
      } else if (lowerCmd === 'help') {
        newHistory.push({ id: Date.now() + 'h1', text: "> Available commands:" });
        newHistory.push({ id: Date.now() + 'h2', text: "  ls       - Lists available sections" });
        newHistory.push({ id: Date.now() + 'h3', text: "  pwd      - Displays current path" });
        newHistory.push({ id: Date.now() + 'h4', text: "  cd [sec] - Navigates to a section" });
        newHistory.push({ id: Date.now() + 'h5', text: "  whoami   - View bio" });
        newHistory.push({ id: Date.now() + 'h6', text: "  clear    - Wipes terminal" });
        newHistory.push({ id: Date.now() + 'h7', text: "  socials  - Open socials menu" });
      } else if (lowerCmd === 'hi' || lowerCmd === 'hello') {
        newHistory.push({ id: Date.now() + 'hi', text: "> Hello there! Type 'help' to see commands." });
      } else if (['1', '2', '3', '4', 'about', 'experience', 'skills', 'projects'].includes(lowerCmd)) {
        setMode('plain');
        const sectionMap: Record<string, string> = {
          '1': 'about', 'about': 'about',
          '2': 'experience', 'experience': 'experience',
          '3': 'skills', 'skills': 'skills',
          '4': 'projects', 'projects': 'projects'
        };
        setTimeout(() => {
          document.getElementById(sectionMap[lowerCmd])?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return;
      } else if (lowerCmd === 'cd') {
        if (!arg1) {
          newHistory.push({ id: Date.now() + 'cd', text: "> cd: missing argument. Try 'cd About'" });
        } else {
          const sectionMap: Record<string, string> = {
            'about': 'about',
            'experience': 'experience',
            'skills': 'skills',
            'projects': 'projects'
          };
          if (arg1 === 'socials') {
            newHistory.push({ id: Date.now() + 's1', text: "Select a social: [a] LinkedIn, [b] GitHub, [c] Email" });
            newHistory.push({
               id: Date.now() + 's2',
               text: '',
               element: (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px', marginBottom: '8px' }}>
                   <div><span style={{ color: 'var(--term-keyword)' }}>[a]</span> <FaLinkedin style={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '1.2rem' }}/> LinkedIn</div>
                   <div><span style={{ color: 'var(--term-keyword)' }}>[b]</span> <FaGithub style={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '1.2rem' }}/> GitHub</div>
                   <div><span style={{ color: 'var(--term-keyword)' }}>[c]</span> <FaEnvelope style={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '1.2rem' }}/> Email</div>
                 </div>
               )
            });
            newHistory.push({ id: Date.now() + 's3', text: "> Enter your choice (a/b/c) or 'back' to return:" });
            setTerminalContext('socials');
          } else if (sectionMap[arg1]) {
             setMode('plain');
             setTimeout(() => {
               document.getElementById(sectionMap[arg1])?.scrollIntoView({ behavior: 'smooth' });
             }, 100);
             newHistory.push({ id: Date.now() + 'cdd', text: `> Navigated to ${arg1}` });
          } else {
             newHistory.push({ id: Date.now() + 'cde', text: `> cd: ${arg1}: No such section` });
          }
        }
      } else if (lowerCmd === '5' || lowerCmd === 'socials') {
        newHistory.push({ id: Date.now() + 's1', text: "Select a social: [a] LinkedIn, [b] GitHub, [c] Email" });
        newHistory.push({
           id: Date.now() + 's2',
           text: '',
           element: (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px', marginBottom: '8px' }}>
               <div><span style={{ color: 'var(--term-keyword)' }}>[a]</span> <FaLinkedin style={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '1.2rem' }}/> LinkedIn</div>
               <div><span style={{ color: 'var(--term-keyword)' }}>[b]</span> <FaGithub style={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '1.2rem' }}/> GitHub</div>
               <div><span style={{ color: 'var(--term-keyword)' }}>[c]</span> <FaEnvelope style={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '1.2rem' }}/> Email</div>
             </div>
           )
        });
        newHistory.push({ id: Date.now() + 's3', text: "> Enter your choice (a/b/c) or 'back' to return:" });
        setTerminalContext('socials');
      } else {
        const validCommands = ['pwd', 'ls', 'whoami', 'date', 'help', 'cd', 'about', 'experience', 'skills', 'projects', 'socials', 'clear', 'hi', 'hello'];
        let bestMatch = '';
        validCommands.forEach(vc => {
          if (vc.startsWith(lowerCmd) || lowerCmd.startsWith(vc)) {
            bestMatch = vc;
          }
        });
        if (bestMatch && bestMatch.length > 1) {
          newHistory.push({ id: Date.now() + 'err', text: `> Command not found: ${cmd}. Did you mean '${bestMatch}'?` });
        } else {
          newHistory.push({ id: Date.now() + 'err', text: `> Command not found: ${cmd}. Type 'help' for options.` });
        }
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
              ) : (
                <TypewriterText text={line.text} renderElement={line.element} />
              )}
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
