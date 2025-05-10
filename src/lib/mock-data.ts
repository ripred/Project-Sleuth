
import type { Project } from "./types";

export const mockProjects: Project[] = [
  {
    id: "project-sleuth-app",
    name: "Project Sleuth App",
    path: "/Users/dev/apps/project-sleuth",
    description: "The very application you are using now. An intelligent tool for project discovery, analysis, and management.",
    mainLanguage: "TypeScript",
    otherLanguages: ["CSS", "HTML"],
    projectSize: "Large",
    complexity: "High",
    lastScanned: new Date("2024-07-28T10:00:00Z"),
    lastWorkedOn: new Date("2024-07-28T18:30:00Z"),
    dueDate: new Date("2024-08-31T23:59:59Z"),
    gitData: {
      currentBranch: "main",
      lastCommit: "feat: initial dashboard setup",
      hasUncommittedChanges: false,
      remotes: [{name: "origin", url: "git@github.com:user/project-sleuth.git"}]
    },
    aiSummary: {
        purpose: "To provide developers with an intelligent tool for discovering, analyzing, and managing software projects.",
        completeness: "Core features implemented, ongoing development for advanced analysis.",
        technologies: "Next.js, React, TypeScript, Tailwind CSS, Shadcn/UI, Genkit",
        languages: "TypeScript, CSS"
    },
    aiTags: ["nextjs", "react", "typescript", "developer-tool", "ai-powered"],
    aiDocumentationUrls: ["https://nextjs.org/docs", "https://react.dev/", "https://www.typescriptlang.org/docs/"],
    icon: "typescript",
    userNotes: "This is the main application. Focus on GenAI integrations next.",
    customTags: ["priority-high", "in-development"]
  },
  {
    id: "legacy-api-service",
    name: "Legacy API Service",
    path: "/Users/dev/work/legacy-api",
    description: "A critical backend service written in Java, powering older mobile applications.",
    mainLanguage: "Java",
    otherLanguages: ["XML", "Groovy"],
    projectSize: "Very Large",
    complexity: "High",
    lastScanned: new Date("2024-07-27T14:30:00Z"),
    lastWorkedOn: new Date("2024-07-26T10:15:00Z"),
    // No dueDate for this project to demonstrate optional display
    gitData: {
      currentBranch: "release/2.3.1",
      lastCommit: "fix: memory leak in caching module",
      hasUncommittedChanges: true,
      remotes: [{name: "origin", url: "git@internal-git.company.com:backend/legacy-api.git"}]
    },
    aiSummary: {
        purpose: "To serve as a backend for older mobile applications, providing data and business logic.",
        completeness: "Feature complete, but in maintenance mode. Known performance bottlenecks.",
        technologies: "Java, Spring Boot, Hibernate, Oracle DB",
        languages: "Java, SQL, XML"
    },
    icon: "java",
    customTags: ["legacy", "maintenance-mode", "critical"]
  },
  {
    id: "personal-blog-v2",
    name: "Personal Blog v2",
    path: "/Users/dev/personal/my-blog-nextjs",
    description: "Rewriting my personal blog using Next.js and MDX for better performance and developer experience.",
    mainLanguage: "JavaScript",
    otherLanguages: ["Markdown", "CSS"],
    projectSize: "Small",
    complexity: "Low",
    lastScanned: new Date("2024-07-28T09:15:00Z"),
    lastWorkedOn: new Date("2024-07-29T11:00:00Z"),
    dueDate: new Date("2024-09-15T23:59:59Z"),
    gitData: {
      currentBranch: "feat/new-theme",
      hasUncommittedChanges: false
    },
    aiTags: ["blog", "nextjs", "mdx", "personal-project"],
    icon: "javascript",
    userNotes: "Experimenting with server components and new Next.js 14 features."
  },
  {
    id: "data-analysis-scripts",
    name: "Data Analysis Scripts",
    path: "/Users/dev/research/python-scripts",
    description: "A collection of Python scripts for various data processing and visualization tasks.",
    mainLanguage: "Python",
    otherLanguages: [],
    projectSize: "Medium",
    complexity: "Medium",
    lastScanned: new Date("2024-07-25T18:00:00Z"),
    lastWorkedOn: new Date("2024-07-25T17:00:00Z"),
    // No due date
    gitData: {
        currentBranch: "main",
        hasUncommittedChanges: true,
    },
    aiSummary: {
        purpose: "To automate data cleaning, transformation, analysis, and visualization for research projects.",
        completeness: "A growing collection of independent scripts, some more polished than others.",
        technologies: "Python, Pandas, NumPy, Matplotlib, Scikit-learn",
        languages: "Python"
    },
    icon: "python",
    aiDocumentationUrls: ["https://pandas.pydata.org/docs/", "https://numpy.org/doc/", "https://matplotlib.org/stable/contents.html"],
    customTags: ["data-science", "research", "automation"]
  }
];

export const mockSettings: import("./types").AppSettings = {
    apiKeys: [
        { id: "googleAI", name: "Google AI API Key", key: "" },
        { id: "openAI", name: "OpenAI API Key", key: "" },
    ],
    defaultScanPaths: ["/Users/dev/apps", "/Users/dev/work", "/Users/dev/personal"]
};

