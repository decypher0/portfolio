import { Profile, SkillCategory, Experience, Project } from '../types';

export const profileData: Profile = {
  name: "Gaurav Habad",
  title: "Senior Backend Developer",
  email: "gauravhabad113@gmail.com",
  phone: "+91-8999949130",
  summary: "Senior Backend Developer with 4+ years of experience designing scalable distributed systems using Java 17, Spring Boot 3, and microservices architecture. Experienced in building high-performance REST APIs, integrating third-party platforms (Zoom, DocuSign, Vertex Tax), and developing event-driven backend systems using Kafka and webhook processing. Proven track record of achieving 40% latency reduction and 99.8% login success at Sakha Global while supporting applications serving 5K+ concurrent users. Currently upskilling in AI/ML to build intelligent backend solutions.",
  education: "Bachelor of Technology in Computer Science and Engineering from Dr. Babasaheb Ambedkar Technological University (July 2017 - September 2021), Nagpur, Maharashtra.",
  github: "https://github.com/gauravhabad",
  linkedin: "https://linkedin.com/in/gauravhabad"
};

export const skillsData: SkillCategory[] = [
  {
    category: "Languages",
    items: ["Java", "SQL", "JavaScript", "Python"]
  },
  {
    category: "Frameworks",
    items: ["Spring Boot 3", "Spring Cloud", "Spring Security", "Hibernate/JPA", "REST APIs"]
  },
  {
    category: "Architecture",
    items: ["Microservices", "Event-Driven Architecture", "Distributed Systems", "Multi-Tenant Systems"]
  },
  {
    category: "API & Integrations",
    items: ["REST APIs", "Webhooks", "Third-Party API Integration", "OAuth2", "SAML"]
  },
  {
    category: "Messaging & Caching",
    items: ["Kafka", "Redis"]
  },
  {
    category: "Cloud & DevOps",
    items: ["AWS (EC2, S3, RDS, Lambda)", "Docker", "Jenkins", "GitHub Actions", "CI/CD"]
  },
  {
    category: "Databases",
    items: ["MySQL", "PostgreSQL", "DynamoDB", "Database Migration"]
  },
  {
    category: "Tools",
    items: ["IntelliJ", "JUnit", "Postman", "Swagger", "Linux", "Liquibase"]
  }
];

export const experienceData: Experience[] = [
  {
    id: "exp-1",
    role: "Senior Software Engineer",
    company: "Sakha Global",
    period: "February 2022 - Present",
    highlights: [
      "Engineered scalable microservices handling 5K+ concurrent users using Spring Boot 3, reducing server costs by 25% through optimized resource allocation.",
      "Designed OAuth 2.0/SAML authentication for 3+ Identity Providers (Okta, Azure AD), achieving 99.8% login success rate and zero security breaches in 2 years.",
      "Optimized MySQL performance by 40% via query tuning and indexing, reducing API latency from 1200ms to 720ms for core endpoints.",
      "Integrated third-party platforms including Zoom, DocuSign, Vertex Tax, Survey Sparrow, and Verisk using REST APIs and webhook-based event processing.",
      "Automated regional tax calculation workflows by integrating Vertex Tax APIs, dynamically computing tax based on customer location.",
      "Developed webhook event handlers for external systems to process real-time updates such as document signing status, survey responses, and claim lifecycle events.",
      "Implemented asynchronous processing pipelines using Kafka and background schedulers to support high-volume insurance processing workflows across 8 microservices.",
      "Containerized backend services using Docker and implemented CI/CD pipelines with Jenkins and GitHub Actions for automated deployment."
    ]
  }
];

export const projectsData: Project[] = [
  {
    id: "proj-1",
    title: "Student Management System",
    date: "January 2023",
    description: "Architected cloud-native solution on AWS EC2/Docker serving 5,000+ monthly users across 3 institutions.",
    architectureDecisions: [
      "Automated 7+ academic workflows (admissions, payments, attendance) reducing manual work by 60 hours/week.",
      "Integrated Zoom APIs for automated meeting scheduling, recording management, attendance tracking, and session lifecycle management.",
      "Implemented CI/CD pipeline using GitHub Actions enabling 50% faster deployment cycles."
    ],
    techStack: ["Java", "Spring Boot", "MySQL", "AWS", "Docker"],
    githubLink: "#",
    liveLink: "#"
  },
  {
    id: "proj-2",
    title: "Insurance Streamline Application",
    date: "February 2022",
    description: "Developed multi-tenant SaaS platform processing 10,000+ monthly claims with 99.95% uptime.",
    architectureDecisions: [
      "Implemented RBAC system onboarding 15+ external vendors and reducing setup time by 50%.",
      "Automated claim lifecycle reducing processing time by 40% through Spring Batch scheduling.",
      "Integrated 3+ third-party systems using REST APIs with 100% data consistency."
    ],
    techStack: ["Java", "Spring MVC", "MySQL", "Microservices"],
    githubLink: "#",
    liveLink: "#"
  },
  {
    id: "proj-3",
    title: "Car Resale Platform",
    description: "Architected a comprehensive automotive marketplace platform.",
    architectureDecisions: [
      "Developed the backend utilizing Java 8 for core services, including dynamic email construction and template rendering.",
      "Built the admin portal for inventory management and oversaw the UI/UX design integration with the backend architecture."
    ],
    techStack: ["Java", "REST APIs", "SQL"],
    githubLink: "#",
    liveLink: "#"
  }
];
