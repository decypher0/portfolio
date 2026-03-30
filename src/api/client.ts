import { profileData, skillsData, experienceData, projectsData } from './data';
import { Profile, SkillCategory, Experience, Project } from '../types';

const NETWORK_LATENCY = 300;

export const api = {
  getProfile: (): Promise<Profile> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(profileData), NETWORK_LATENCY);
    });
  },
  
  getSkills: (): Promise<SkillCategory[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(skillsData), NETWORK_LATENCY + 50);
    });
  },
  
  getExperience: (): Promise<Experience[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(experienceData), NETWORK_LATENCY + 100);
    });
  },
  
  getProjects: (): Promise<Project[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(projectsData), NETWORK_LATENCY + 150);
    });
  }
};
