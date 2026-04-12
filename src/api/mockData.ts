import { Profile, SkillCategory, Experience, Project } from '../types';

export const profileData: Profile = {
  name: "John Doe",
  title: "Senior Full Stack Engineer",
  summary: "Architecting software solutions with a focus on scalable backends and highly interactive user interfaces. Passionate about system design, code quality, and performance monitoring.",
  email: "john.doe@example.com",
  github: "https://github.com/johndoe",
  linkedin: "https://linkedin.com/in/johndoe",
  phone: "",
  education: ""
};

export const skillsData: SkillCategory[] = [
  {
    category: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Go", "SQL"]
  },
  {
    category: "Frameworks & Libraries",
    items: ["React", "Next.js", "Node.js", "Express", "Django", "FastAPI"]
  },
  {
    category: "Databases",
    items: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch"]
  },
  {
    category: "Tools & DevOps",
    items: ["Docker", "Kubernetes", "AWS", "Git", "GitHub Actions", "Terraform"]
  }
];

export const experienceData: Experience[] = [
  {
    id: "exp-1",
    role: "Senior Software Engineer",
    company: "Tech Solutions Inc.",
    period: "2021 - Present",
    highlights: [
      "Led the migration of a legacy monolithic application to microservices using Node.js and Docker.",
      "Optimized database queries, reducing average API response times by 40%.",
      "Mentored junior developers and instituted comprehensive code review guidelines."
    ]
  },
  {
    id: "exp-2",
    role: "Full Stack Developer",
    company: "Innovate Web",
    period: "2018 - 2021",
    highlights: [
      "Developed interactive dashboards using React and D3.js.",
      "Implemented OAuth 2.0 authentication flows and integrated third-party identity providers.",
      "Maintained CI/CD pipelines for staging and production environments."
    ]
  }
];

export const projectsData: Project[] = [
  {
    id: "proj-1",
    title: "Car Resale Platform",
    description: "A comprehensive platform allowing users to buy, sell, and auction used cars. Designed for high concurrency during live auctions and robust dealer verification flows. The architecture guarantees atomicity of bids and smooth real-time updates.",
    architectureDecisions: [
      "Microservices architecture with Go and Node.js for specialized workloads.",
      "Redis Pub/Sub utilized for real-time bid broadcasting and instant notifications.",
      "PostgreSQL used as the primary database with a tailored schema for complex vehicle metadata.",
      "CQRS pattern implemented for separating heavy read loads (car search/filtering) from transactional writes (bidding)."
    ],
    techStack: ["React", "Node.js", "Go", "PostgreSQL", "Redis", "Docker", "Socket.io"],
    githubLink: "https://github.com/johndoe/car-resale-platform"
  },
  {
    id: "proj-2",
    title: "Real-time Analytics Engine",
    description: "A high-throughput analytics ingestion engine built to track user events in real-time across multiple active frontends.",
    architectureDecisions: [
      "Kafka employed for event streaming and buffering high-volume data spikes.",
      "ClickHouse used for sub-second analytical queries on millions of records.",
      "Stateless API layer horizontally scaled across Kubernetes pods."
    ],
    techStack: ["Python", "FastAPI", "Kafka", "ClickHouse", "Kubernetes"],
    githubLink: "https://github.com/johndoe/analytics-engine",
    liveLink: "https://analytics-demo.johndoe.com"
  }
];
