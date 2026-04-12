import { useEffect } from 'react';
import { Profile, SkillCategory, Experience, Project } from '../types';
import { FaJava, FaDocker, FaAws, FaReact, FaNodeJs, FaGit, FaPython, FaLinux, FaCode } from 'react-icons/fa';
import { SiSpringboot, SiTypescript, SiJavascript, SiPostgresql, SiMongodb, SiRedis, SiKubernetes, SiApachekafka, SiGraphql, SiDotnet } from 'react-icons/si';

interface PlainViewProps {
  profile: Profile | null;
  skills: SkillCategory[] | null;
  experience: Experience[] | null;
  projects: Project[] | null;
  loading: boolean;
}

const getIconForSkill = (skill: string) => {
  const norm = skill.toLowerCase();
  if (norm.includes('java') && !norm.includes('script')) return <FaJava style={{ fontSize: '1.2rem', color: '#e32c2e' }} />;
  if (norm.includes('spring')) return <SiSpringboot style={{ fontSize: '1.2rem', color: '#6db33f' }} />;
  if (norm.includes('aws')) return <FaAws style={{ fontSize: '1.2rem', color: '#ff9900' }} />;
  if (norm.includes('docker')) return <FaDocker style={{ fontSize: '1.2rem', color: '#2496ed' }} />;
  if (norm.includes('kubernetes') || norm.includes('k8s')) return <SiKubernetes style={{ fontSize: '1.2rem', color: '#326ce5' }} />;
  if (norm.includes('react')) return <FaReact style={{ fontSize: '1.2rem', color: '#61dafb' }} />;
  if (norm.includes('node')) return <FaNodeJs style={{ fontSize: '1.2rem', color: '#339933' }} />;
  if (norm.includes('git')) return <FaGit style={{ fontSize: '1.2rem', color: '#f05032' }} />;
  if (norm.includes('python')) return <FaPython style={{ fontSize: '1.2rem', color: '#3776ab' }} />;
  if (norm.includes('linux')) return <FaLinux style={{ fontSize: '1.2rem' }} />;
  if (norm.includes('type')) return <SiTypescript style={{ fontSize: '1.2rem', color: '#3178c6' }} />;
  if (norm.includes('js') || norm.includes('javascript')) return <SiJavascript style={{ fontSize: '1.2rem', color: '#f7df1e' }} />;
  if (norm.includes('postgre') || norm.includes('sql')) return <SiPostgresql style={{ fontSize: '1.2rem', color: '#336791' }} />;
  if (norm.includes('mongo')) return <SiMongodb style={{ fontSize: '1.2rem', color: '#47a248' }} />;
  if (norm.includes('redis')) return <SiRedis style={{ fontSize: '1.2rem', color: '#dc382d' }} />;
  if (norm.includes('kafka')) return <SiApachekafka style={{ fontSize: '1.2rem' }} />;
  if (norm.includes('graphql')) return <SiGraphql style={{ fontSize: '1.2rem', color: '#e10098' }} />;
  if (norm.includes('net') || norm.includes('c#')) return <SiDotnet style={{ fontSize: '1.2rem', color: '#512bd4' }} />;
  return <FaCode style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }} />;
};

export default function PlainView({ profile, skills, experience, projects, loading }: PlainViewProps) {
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [loading]);

  return (
    <div className="plain-view-container">
      
      {/* About Section - Left 50% */}
      <section id="about" className="w-full min-h-screen flex flex-col justify-center bg-transparent">
        <div className="w-full md:w-3/4 mr-auto p-8 rounded-r-xl md:rounded-xl relative z-10 break-words box-border" style={{ backgroundColor: 'var(--bg-color)' }}>
          <h2 className="section-title">about</h2>
          {loading ? (
              <div>
                <div className="skeleton skeleton-text" style={{ width: '100%', height: '1.2rem', marginBottom: '1rem' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '90%', height: '1.2rem', marginBottom: '1rem' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '95%', height: '1.2rem' }}></div>
              </div>
          ) : (
            <div className="animate-on-scroll">
              <p className="whitespace-normal break-words" style={{ fontSize: '1.2rem', color: 'var(--text-main)', lineHeight: '1.9', letterSpacing: '0.2px', marginBottom: '2rem' }}>
                {profile?.summary}
              </p>
              
              <div style={{ padding: '2rem', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', fontFamily: 'var(--font-mono)' }}>Education Timeline</h3>
                <p className="whitespace-normal break-words" style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6' }}>{profile?.education}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Experience Section - Right 50% */}
      <section id="experience" className="w-full min-h-screen flex flex-col justify-center bg-transparent">
        <div className="w-full md:w-3/4 ml-auto p-8 rounded-l-xl md:rounded-xl relative z-10 break-words box-border" style={{ backgroundColor: 'var(--bg-color)' }}>
          <h2 className="section-title">experience</h2>
          <div className="card-grid" style={{ gridTemplateColumns: '1fr', gap: '2rem' }}>
            {loading ? (
              <>
                <div className="item-card skeleton skeleton-card"></div>
                <div className="item-card skeleton skeleton-card"></div>
              </>
            ) : experience?.map((exp, idx) => (
              <div key={exp.id} className="item-card animate-on-scroll" style={{ padding: '2rem', boxShadow: '0 6px 20px rgba(0,0,0,0.05)', transitionDelay: `${idx * 0.1}s` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <h3 className="item-title break-words" style={{ fontSize: '1.3rem', marginBottom: 0 }}>
                    {exp.role} <span style={{ color: '#f97316' }}>@ {exp.company}</span>
                  </h3>
                  <span className="badge" style={{ padding: '0.4rem 0.8rem', background: 'rgba(249, 115, 22, 0.1)', color: '#f97316', border: 'none' }}>{exp.period}</span>
                </div>
                <ul className="highlights-list" style={{ paddingLeft: '1.5rem' }}>
                  {exp.highlights.map((hlt, idx) => (
                    <li className="whitespace-normal break-words" key={idx} style={{ marginBottom: '0.8rem', fontSize: '1rem', lineHeight: '1.6' }}>{hlt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section - Left 50% */}
      <section id="skills" className="w-full min-h-screen flex flex-col justify-center bg-transparent">
        <div className="w-full md:w-3/4 mr-auto p-8 rounded-r-xl md:rounded-xl relative z-10 break-words box-border" style={{ backgroundColor: 'var(--bg-color)' }}>
          <h2 className="section-title">skills</h2>
          <div className="card-grid" style={{ gap: '1.5rem' }}>
            {loading ? (
              <>
                <div className="item-card skeleton skeleton-card"></div>
                <div className="item-card skeleton skeleton-card"></div>
                <div className="item-card skeleton skeleton-card"></div>
                <div className="item-card skeleton skeleton-card"></div>
              </>
            ) : skills?.map((category, idx) => (
              <div key={idx} className="item-card break-words animate-on-scroll" style={{ padding: '1.5rem', boxShadow: '0 6px 20px rgba(0,0,0,0.05)', transitionDelay: `${idx * 0.1}s` }}>
                <h3 className="item-title" style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>{category.category}</h3>
                <div className="badge-container" style={{ gap: '0.75rem' }}>
                  {category.items.map(item => (
                    <div 
                      key={item} 
                      className="break-words" 
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.4rem 0.8rem', 
                        fontSize: '0.85rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: '9999px',
                        background: 'transparent',
                        transition: 'background-color 0.2s ease',
                        cursor: 'default'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--component-bg)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {getIconForSkill(item)}
                      <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section - Right 50% */}
      <section id="projects" className="w-full min-h-screen flex flex-col justify-center bg-transparent pb-32">
        <div className="w-full md:w-3/4 ml-auto p-8 rounded-l-xl md:rounded-xl relative z-10 break-words box-border" style={{ backgroundColor: 'var(--bg-color)' }}>
          <h2 className="section-title">projects</h2>
          <div className="card-grid" style={{ gap: '2rem' }}>
            {loading ? (
               <>
                 <div className="item-card skeleton skeleton-card"></div>
                 <div className="item-card skeleton skeleton-card"></div>
               </>
            ) : projects?.map((proj, idx) => (
              <div key={proj.id} className="item-card break-words animate-on-scroll" style={{ display: 'flex', flexDirection: 'column', padding: '2rem', boxShadow: '0 6px 20px rgba(0,0,0,0.05)', transitionDelay: `${idx * 0.1}s` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <h3 className="item-title break-words" style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{proj.title}</h3>
                  {proj.date && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{proj.date}</span>}
                </div>
                
                <p className="item-subtitle whitespace-normal break-words" style={{ flexGrow: 1, fontSize: '1rem', lineHeight: '1.6', color: 'var(--text-main)' }}>
                  {proj.description}
                </p>

                <div className="badge-container" style={{ marginBottom: '1.5rem', marginTop: '1.5rem', gap: '0.5rem' }}>
                  {proj.techStack.map(tech => (
                    <span key={tech} className="badge break-words" style={{ background: 'transparent', borderColor: 'var(--border-color)', fontSize: '0.8rem' }}>{tech}</span>
                  ))}
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
}
