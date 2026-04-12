export interface Profile {
  name: string;
  title: string;
  email: string;
  phone: string;
  summary: string;
  education: string;
  github: string;
  linkedin: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  highlights: string[];
}

export interface Project {
  id: string;
  title: string;
  date?: string;
  description: string;
  architectureDecisions: string[];
  techStack: string[];
  githubLink?: string;
  liveLink?: string;
}

export type ViewMode = 'plain' | 'client' | 'docs';
