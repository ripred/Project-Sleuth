
import type { ProjectSummaryOutput } from "@/ai/flows/project-summary";
import type { FetchWebDocumentationOutput } from "@/ai/flows/web-documentation";
import type { SuggestProjectTagsOutput } from "@/ai/flows/ai-tagging";

export interface Project {
  id: string;
  name: string;
  path: string;
  description?: string; // User-added or auto-generated
  lastScanned?: Date;
  lastWorkedOn?: Date; 
  dueDate?: Date; // New field for due date

  // AI Generated fields
  aiSummary?: ProjectSummaryOutput;
  aiTags?: SuggestProjectTagsOutput["tags"];
  aiDocumentationUrls?: FetchWebDocumentationOutput["documentationUrls"];

  // Detected properties
  mainLanguage?: string;
  otherLanguages?: string[];
  projectSize?: string; // e.g., "1.2 MB", "1024 files"
  complexity?: 'Low' | 'Medium' | 'High' | 'Unknown'; // Or a numeric score

  // Git related
  gitData?: {
    currentBranch?: string;
    lastCommit?: string; // hash or message
    hasUncommittedChanges?: boolean;
    remotes?: { name: string, url: string }[];
  };
  
  // User-specific
  userNotes?: string;
  customTags?: string[];

  // UI related
  icon?: string; // e.g., 'javascript', 'python', for custom icons per project type
  lastOpened?: Date;
}

export interface ApiKeySetting {
  id: string; // e.g., "googleAI", "openAI"
  name: string; // e.g., "Google AI API Key"
  key: string;
  serviceUrl?: string; // Optional, if the service has a configurable base URL
}

export interface AppSettings {
  apiKeys: ApiKeySetting[];
  defaultScanPaths: string[];
  // Add other app-wide settings here
  // e.g. defaultEditorPath: string;
}

// Example of specific project settings (if needed, stored per project)
export interface ProjectSettings {
  projectId: string;
  preferredEditor?: string;
  customBuildCommand?: string;
}

