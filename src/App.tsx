import { useEffect, useState } from 'react';
import { useViewMode } from './context/ViewModeContext';
import { api } from './api/client';
import { Profile, SkillCategory, Experience, Project } from './types';
import PlainView from './components/PlainView';
import ClientView from './components/ClientView';
import DocsView from './components/DocsView';
import TerminalLanding from './components/TerminalLanding';
import portfolioImg from './assets/portfolio1.png';
import './index.css';

function App() {
  const { mode, setMode } = useViewMode();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<SkillCategory[] | null>(null);
  const [experience, setExperience] = useState<Experience[] | null>(null);
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeHash, setActiveHash] = useState('terminal-view-section');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profData, skillsData, expData, projData] = await Promise.all([
          api.getProfile(),
          api.getSkills(),
          api.getExperience(),
          api.getProjects()
        ]);
        setProfile(profData);
        setSkills(skillsData);
        setExperience(expData);
        setProjects(projData);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Intersection Observer for the floating Card layout mapping
  useEffect(() => {
    if (mode !== 'terminal' && mode !== 'plain') return;

    // A small timeout ensures the DOM has actually painted the fetched components
    const timeout = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveHash(entry.target.id);
            }
          });
        },
        { threshold: 0.3 } // Requires 30% visibility to trigger transition
      );

      const targetIDs = ['terminal-view-section', 'about', 'experience', 'skills', 'projects'];
      targetIDs.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });

      return () => observer.disconnect();
    }, 300);

    return () => clearTimeout(timeout);
  }, [mode, loading]); // Re-bind when data completes loading

  const getCardPositionClass = () => {
    if (mode === 'client' || mode === 'docs') return 'card-left'; // Static for complex modes

    switch (activeHash) {
      case 'terminal-view-section': return 'card-left';
      case 'about': return 'card-right';
      case 'experience': return 'card-left';
      case 'skills': return 'card-right';
      case 'projects': return 'card-left';
      default: return 'card-left';
    }
  };

  const isApiMode = mode === 'client' || mode === 'docs';

  const renderProfileCard = (isStatic: boolean) => (
    <aside className={isStatic ? "profile-card-static" : `floating-profile-card ${getCardPositionClass()}`}>
      <div className="profile-photo-wrapper">
        <svg className="dashed-accent" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="58" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="6 6" className="spin-slow" />
          <circle cx="15" cy="15" r="3" fill="#f97316" />
          <circle cx="100" cy="10" r="2" fill="#f97316" />
          <path d="M 100 100 L 105 105 M 105 100 L 100 105" stroke="#f97316" strokeWidth="2" />
        </svg>
        <div className="profile-photo-inner" style={{ overflow: 'hidden', borderRadius: '50%', backgroundColor: 'var(--card-bg)' }}>
          <img src={portfolioImg} alt="Gaurav Habad" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>

      <h1 className="profile-name" style={isStatic ? { fontSize: '1.5rem', textAlign: 'center' } : {}}>Gaurav Habad</h1>
      <p className="profile-summary" style={isStatic ? { fontSize: '0.9rem', textAlign: 'center', margin: '0.5rem 0 1rem' } : {}}>
        A Senior Backend Developer engineering scalable distributed systems and high-performance APIs.
      </p>

      <div className="profile-socials" style={isStatic ? { display: 'flex', gap: '1rem', justifyContent: 'center' } : {}}>
        <a href="https://linkedin.com/in/gauravhabad" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
            <rect x="2" y="9" width="4" height="12"></rect>
            <circle cx="4" cy="4" r="2"></circle>
          </svg>
        </a>
        <a href="https://github.com/gauravhabad" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        </a>
        <a href="mailto:gauravhabad113@gmail.com" aria-label="Email">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </a>
      </div>
    </aside>
  );

  return (
    <div className="app-container">
      {!isApiMode && renderProfileCard(false)}

      {/* Center Unified Content Container */}
      <main className={!isApiMode ? "main-scroll-content" : "w-full min-h-screen flex flex-col items-stretch max-w-[100vw] overflow-x-hidden"}>
        <header className="workspace-header">
          <div className="logo-area">
            <span className="logo-prompt">❯</span>
            <span>GAURAV_HABAD</span>
            <span className="logo-cursor"></span>
          </div>
          <nav className="mode-switcher">
            <button
              className={mode === 'terminal' || mode === 'plain' ? 'active' : ''}
              onClick={() => {
                setMode('terminal');
                document.getElementById('terminal-view-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Web Profile
            </button>
            <button
              className={mode === 'client' ? 'active' : ''}
              onClick={() => setMode('client')}
            >
              API Client
            </button>
            <button
              className={mode === 'docs' ? 'active' : ''}
              onClick={() => setMode('docs')}
            >
              API Docs
            </button>
          </nav>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0 1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}
            title="Toggle Theme"
          >
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            )}
          </button>
        </header>

        <div className={!isApiMode ? "view-transition-wrapper" : ""} key={mode}>
          {(mode === 'terminal' || mode === 'plain') && (
            <div>
              <section id="terminal-view-section" className="w-full md:w-3/4 ml-auto min-h-screen flex flex-col justify-center p-8 box-border">
                <TerminalLanding />
              </section>
              <PlainView
                profile={profile}
                skills={skills}
                experience={experience}
                projects={projects}
                loading={loading}
              />
            </div>
          )}

          {mode === 'client' && (
            <ClientView
              profile={profile}
              skills={skills}
              experience={experience}
              projects={projects}
            />
          )}

          {mode === 'docs' && <DocsView />}
        </div>
      </main>
    </div>
  );
}

export default App;
