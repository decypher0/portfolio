import { useState } from 'react';
import { api } from '../api/client';
import '../styles/docs.css';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface Parameter {
  name: string;
  in: string;
  description: string;
  required: boolean;
  type: string;
}

interface EndpointConfig {
  id: string;
  path: string;
  method: HttpMethod;
  summary: string;
  description: string;
  parameters: Parameter[];
  schema: Record<string, any>;
  fetcher: () => Promise<any>;
}

const endpoints: EndpointConfig[] = [
  {
    id: 'profile',
    path: '/v1/profile',
    method: 'GET',
    summary: 'Get developer profile details',
    description: 'Returns the core biographical overview and professional identity.',
    parameters: [],
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Gaurav Habad' },
        title: { type: 'string', example: 'Senior Backend Developer' },
        email: { type: 'string', format: 'email' },
        phone: { type: 'string', example: '+91-8999949130' },
        summary: { type: 'string', example: 'Senior Backend Developer with 4+ years...' },
        education: { type: 'string' },
        github: { type: 'string', format: 'uri' },
        linkedin: { type: 'string', format: 'uri' }
      }
    },
    fetcher: api.getProfile
  },
  {
    id: 'skills',
    path: '/v1/skills',
    method: 'GET',
    summary: 'List technical skill categories',
    description: 'Returns a categorized array of technical proficiencies including languages, frameworks, and devops tooling.',
    parameters: [],
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          category: { type: 'string', example: 'Languages' },
          items: { type: 'array', items: { type: 'string' } }
        }
      }
    },
    fetcher: api.getSkills
  },
  {
    id: 'experience',
    path: '/v1/experience',
    method: 'GET',
    summary: 'Get professional experience timeline',
    description: 'Fetches the structured timeline of professional roles and responsibilities.',
    parameters: [
      { name: 'sort', in: 'query', description: 'Sort order (asc/desc)', required: false, type: 'string' }
    ],
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          role: { type: 'string' },
          company: { type: 'string' },
          period: { type: 'string' },
          highlights: { type: 'array', items: { type: 'string' } }
        }
      }
    },
    fetcher: api.getExperience
  },
  {
    id: 'projects',
    path: '/v1/projects',
    method: 'GET',
    summary: 'Retrieve project portfolio',
    description: 'Exposes detailed project metadata, explicitly documenting architectural decisions and system design implementations.',
    parameters: [
      { name: 'limit', in: 'query', description: 'Maximum number of projects to return', required: false, type: 'integer' },
      { name: 'tech', in: 'query', description: 'Filter by specific technology', required: false, type: 'string' }
    ],
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          date: { type: 'string' },
          description: { type: 'string' },
          architectureDecisions: { type: 'array', items: { type: 'string' } },
          techStack: { type: 'array', items: { type: 'string' } },
          githubLink: { type: 'string', format: 'uri' },
          liveLink: { type: 'string', format: 'uri' }
        }
      }
    },
    fetcher: api.getProjects
  }
];

export default function DocsView() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [tryingOut, setTryingOut] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [responses, setResponses] = useState<Record<string, any>>({});
  
  // Basic input states for params (visual only for now)
  const [params, setParams] = useState<Record<string, string>>({});

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTryOut = (id: string) => {
    setTryingOut(prev => ({ ...prev, [id]: !prev[id] }));
    // Reset responses when closing try it out
    if (tryingOut[id]) {
        setResponses(prev => ({ ...prev, [id]: null }));
    }
  };

  const executeApi = async (ep: EndpointConfig) => {
    setLoading(prev => ({ ...prev, [ep.id]: true }));
    try {
      const data = await ep.fetcher();
      setResponses(prev => ({ ...prev, [ep.id]: data }));
    } catch (e) {
      setResponses(prev => ({ ...prev, [ep.id]: { error: 'Failed to fetch' } }));
    } finally {
      setLoading(prev => ({ ...prev, [ep.id]: false }));
    }
  };

  const renderSchemaNode = (schemaObj: any): JSX.Element => {
    return (
      <pre className="swagger-schema-block">
        {JSON.stringify(schemaObj, null, 2)}
      </pre>
    );
  };

  return (
    <div className="w-full min-h-screen p-6" style={{ backgroundColor: 'var(--bg-color)' }}>
      {/* 100% Main Workspace for Swagger UI */}
      <div className="max-w-5xl mx-auto w-full">
        <div className="swagger-ui w-full" style={{ marginTop: 0 }}>
      {/* Header Area */}
      <div className="swagger-header-section">
        <div>
          <h2 className="swagger-title">
            Portfolio API 
            <span className="swagger-version">1.0.0</span>
            <span className="swagger-version" style={{background: '#89bf04', color: 'white'}}>OAS3</span>
          </h2>
          <div className="swagger-baseurl">
            <strong>[ Base URL:</strong> api.myportfolio.com/v1 <strong>]</strong>
          </div>
        </div>
        <div>
          <button className="swagger-auth-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Authorize
          </button>
        </div>
      </div>

      {/* Endpoints */}
      <div>
        <h3 style={{ margin: '1rem 0' }}>default</h3>
        
        {endpoints.map(ep => {
          const isExp = expanded[ep.id];
          const isTry = tryingOut[ep.id];
          const isLoading = loading[ep.id];
          const res = responses[ep.id];

          return (
            <div key={ep.id} className={`swagger-opblock ${ep.method.toLowerCase()} ${isExp ? 'swagger-expanded' : ''} w-full`} style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--card-bg)', border: `1px solid var(--border-color)`, padding: 0 /* handled by summary */, borderRadius: '6px', marginBottom: '1rem' }}>
              
              <div className="swagger-summary w-full flex justify-between items-center" style={{ padding: '1rem' }} onClick={() => toggleExpand(ep.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <span className="swagger-method" style={{ margin: 0 }}>{ep.method}</span>
                  <span className="swagger-path">{ep.path}</span>
                </div>
                <span className="swagger-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
              </div>

              {isExp && (
                <div className="swagger-opblock-body">
                  <div style={{ marginBottom: '1.5rem' }}>
                    <strong>{ep.description}</strong>
                  </div>

                  {/* Parameters */}
                  {ep.parameters.length > 0 ? (
                    <div style={{ marginBottom: '2rem' }}>
                      <div className="swagger-section-header">
                        Parameters
                        {!isTry && (
                          <button className="swagger-try-out-btn" onClick={() => toggleTryOut(ep.id)}>
                            Try it out
                          </button>
                        )}
                      </div>
                      <table className="swagger-params-table">
                        <thead>
                          <tr>
                            <th width="20%">Name</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ep.parameters.map(param => (
                            <tr key={param.name}>
                              <td>
                                <div className="swagger-param-name">
                                  {param.name}
                                  {param.required && <span className="swagger-param-required">* required</span>}
                                </div>
                                <div className="swagger-param-type">{param.type}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({param.in})</div>
                              </td>
                              <td>
                                <div style={{ marginBottom: '0.5rem' }}>{param.description}</div>
                                {isTry && (
                                  <input 
                                    className="swagger-input" 
                                    placeholder={param.name}
                                    value={params[`${ep.id}-${param.name}`] || ''}
                                    onChange={(e) => setParams(prev => ({ ...prev, [`${ep.id}-${param.name}`]: e.target.value }))}
                                  />
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="swagger-section-header">
                        No parameters
                        {!isTry && (
                          <button className="swagger-try-out-btn" onClick={() => toggleTryOut(ep.id)}>
                            Try it out
                          </button>
                        )}
                    </div>
                  )}

                  {/* Action Buttons for Try Out */}
                  {isTry && (
                    <div style={{ marginBottom: '2rem' }}>
                      <button className="swagger-execute-btn" onClick={() => executeApi(ep)} disabled={isLoading}>
                        {isLoading ? 'Executing...' : 'Execute'}
                      </button>
                      <button className="swagger-clear-btn" style={{ marginTop: '0.5rem' }} onClick={() => toggleTryOut(ep.id)}>
                        Cancel
                      </button>
                    </div>
                  )}

                  {/* Responses block - Live or Documentation */}
                  {res ? (
                    <div className="swagger-response-wrapper">
                      <h4>Server Response</h4>
                      <table className="swagger-params-table" style={{ marginTop: '1rem' }}>
                         <thead>
                           <tr>
                              <th style={{ width: '15%' }}>Code</th>
                              <th>Details</th>
                           </tr>
                         </thead>
                         <tbody>
                            <tr>
                               <td>
                                 <span className="swagger-status success">200</span>
                               </td>
                               <td>
                                 <div className="swagger-response-header">Response body</div>
                                 <pre className="swagger-response-body">
                                   {JSON.stringify(res, null, 2)}
                                 </pre>
                               </td>
                            </tr>
                         </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="swagger-response-wrapper">
                      <h4>Responses</h4>
                      <table className="swagger-params-table" style={{ marginTop: '1rem' }}>
                         <thead>
                           <tr>
                              <th style={{ width: '15%' }}>Code</th>
                              <th>Description</th>
                           </tr>
                         </thead>
                         <tbody>
                            <tr>
                               <td><span className="swagger-status success">200</span></td>
                               <td>
                                 <div>Successful operation</div>
                                 <div style={{ marginTop: '1rem' }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Schema:</div>
                                    {renderSchemaNode(ep.schema)}
                                 </div>
                               </td>
                            </tr>
                         </tbody>
                      </table>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>
        </div>
      </div>
    </div>
  );
}
