import { Profile, SkillCategory, Experience, Project } from '../types';

interface PlainViewProps {
  profile: Profile | null;
  skills: SkillCategory[] | null;
  experience: Experience[] | null;
  projects: Project[] | null;
  loading: boolean;
}

export default function PlainView({ profile, skills, experience, projects, loading }: PlainViewProps) {
  return (
    <div className="plain-view-container">
      
      {/* About Section - Left 50% */}
      <section id="about" className="w-full md:w-3/4 mr-auto min-h-screen flex flex-col justify-center p-8 break-words box-border">
        <div>
          <h2 className="section-title">about</h2>
          {loading ? (
              <div>
                <div className="skeleton skeleton-text" style={{ width: '100%', height: '1.2rem', marginBottom: '1rem' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '90%', height: '1.2rem', marginBottom: '1rem' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '95%', height: '1.2rem' }}></div>
              </div>
          ) : (
            <div>
              <p className="whitespace-normal break-words" style={{ fontSize: '1.2rem', color: 'var(--text-main)', lineHeight: '1.9', letterSpacing: '0.2px', marginBottom: '2rem' }}>
                {profile?.summary}
              </p>
              
              <div style={{ padding: '2rem', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', fontFamily: 'var(--font-mono)' }}>Education Timeline</h3>
                <p className="whitespace-normal break-words" style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6' }}>{profile?.education}</p>
              </div>
              
              <div className="badge-container" style={{ gap: '1rem' }}>
                <span className="badge break-words" style={{ padding: '0.5rem 1rem', background: 'transparent', borderColor: 'var(--border-color)', fontSize: '0.9rem' }}>{profile?.email}</span>
                <span className="badge break-words" style={{ padding: '0.5rem 1rem', background: 'transparent', borderColor: 'var(--border-color)', fontSize: '0.9rem' }}>{profile?.phone}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Experience Section - Right 50% */}
      <section id="experience" className="w-full md:w-3/4 ml-auto min-h-screen flex flex-col justify-center p-8 break-words box-border">
        <div>
          <h2 className="section-title">experience</h2>
          <div className="card-grid" style={{ gridTemplateColumns: '1fr', gap: '2rem' }}>
            {loading ? (
              <>
                <div className="item-card skeleton skeleton-card"></div>
                <div className="item-card skeleton skeleton-card"></div>
              </>
            ) : experience?.map(exp => (
              <div key={exp.id} className="item-card" style={{ padding: '2rem', boxShadow: '0 6px 20px rgba(0,0,0,0.05)' }}>
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
      <section id="skills" className="w-full md:w-3/4 mr-auto min-h-screen flex flex-col justify-center p-8 break-words box-border">
        <div>
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
              <div key={idx} className="item-card break-words" style={{ padding: '1.5rem', boxShadow: '0 6px 20px rgba(0,0,0,0.05)' }}>
                <h3 className="item-title" style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>{category.category}</h3>
                <div className="badge-container" style={{ gap: '0.5rem' }}>
                  {category.items.map(item => (
                    <span key={item} className="badge break-words" style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section - Right 50% */}
      <section id="projects" className="w-full md:w-3/4 ml-auto min-h-screen flex flex-col justify-center p-8 break-words box-border">
        <div>
          <h2 className="section-title">projects</h2>
          <div className="card-grid" style={{ gap: '2rem' }}>
            {loading ? (
               <>
                 <div className="item-card skeleton skeleton-card"></div>
                 <div className="item-card skeleton skeleton-card"></div>
               </>
            ) : projects?.map(proj => (
              <div key={proj.id} className="item-card break-words" style={{ display: 'flex', flexDirection: 'column', padding: '2rem', boxShadow: '0 6px 20px rgba(0,0,0,0.05)' }}>
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
