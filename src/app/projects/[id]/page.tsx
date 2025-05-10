
"use client"

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; 
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from '@/components/ui/separator';
import { toast } from "@/hooks/use-toast";
import { projectSummary } from '@/ai/flows/project-summary';
import { fetchWebDocumentation } from '@/ai/flows/web-documentation';
import { suggestProjectTags } from '@/ai/flows/ai-tagging';
import type { Project, ProjectSummaryOutput, FetchWebDocumentationOutput, SuggestProjectTagsOutput } from '@/lib/types';
import { mockProjects } from '@/lib/mock-data';
import {
  ArrowLeft, Info, FileCode, GitMerge, StickyNote, BookOpen, ExternalLink, Cpu, Tags, Rocket, PlayCircle, Eye, AlertCircle, Loader2, CalendarClock
} from 'lucide-react';
import Image from 'next/image';

// Mock server actions (replace with actual server actions later)
async function handleAnalyzeProjectServer(projectPath: string, fileContents: string): Promise<ProjectSummaryOutput> {
  toast({ title: "AI Analysis Started", description: "Summarizing project content..." });
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  // Call the actual AI flow
  try {
    const summary = await projectSummary({ projectPath, fileContents });
    toast({ title: "AI Analysis Complete", description: "Project summary generated." });
    return summary;
  } catch (error) {
    console.error("Error in AI Project Summary:", error);
    toast({ title: "AI Analysis Failed", description: (error as Error).message || "Could not generate summary.", variant: "destructive" });
    throw error;
  }
}

async function handleFetchDocumentationServer(projectName: string, technologies: string): Promise<FetchWebDocumentationOutput> {
  toast({ title: "Fetching Documentation", description: `Searching for docs for ${technologies}...` });
  await new Promise(resolve => setTimeout(resolve, 2000));
  try {
    const docs = await fetchWebDocumentation({ projectName, technologies });
    toast({ title: "Documentation Found", description: `Found ${docs.documentationUrls.length} URLs.` });
    return docs;
  } catch (error) {
    console.error("Error in Fetch Web Documentation:", error);
    toast({ title: "Documentation Fetch Failed", description: (error as Error).message || "Could not fetch documentation.", variant: "destructive" });
    throw error;
  }
}

async function handleSuggestTagsServer(projectDescription: string, fileList: string, language: string): Promise<SuggestProjectTagsOutput> {
  toast({ title: "Generating Tags", description: "Suggesting relevant tags..." });
  await new Promise(resolve => setTimeout(resolve, 2000));
  try {
    const tags = await suggestProjectTags({ projectDescription, fileList, language });
    toast({ title: "Tags Suggested", description: `Generated ${tags.tags.length} tags.` });
    return tags;
  } catch (error) {
    console.error("Error in AI Tagging:", error);
    toast({ title: "Tag Suggestion Failed", description: (error as Error).message || "Could not suggest tags.", variant: "destructive" });
    throw error;
  }
}


export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params ? params.id as string : undefined;
  const [project, setProject] = useState<Project | null>(null);
  const [userNotes, setUserNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState<'summary' | 'docs' | 'tags' | null>(null);

  useEffect(() => {
    if (id) {
      const foundProject = mockProjects.find(p => p.id === id);
      setProject(foundProject || null);
      setUserNotes(foundProject?.userNotes || "");
    }
  }, [id]);

  const handleAnalyze = async () => {
    if (!project) return;
    setIsLoading('summary');
    try {
      // For demo, using project description as fileContents and path as projectPath
      const summary = await handleAnalyzeProjectServer(project.path, project.description || "No description available.");
      setProject(prev => prev ? { ...prev, aiSummary: summary } : null);
    } catch (e) { /* error handled by toast in server action */ }
    setIsLoading(null);
  };

  const handleFetchDocs = async () => {
    if (!project || !project.aiSummary?.technologies) {
        toast({ title: "Cannot Fetch Docs", description: "Project technologies not available. Run AI summary first.", variant: "destructive" });
        return;
    }
    setIsLoading('docs');
    try {
      const docs = await handleFetchDocumentationServer(project.name, project.aiSummary.technologies);
      setProject(prev => prev ? { ...prev, aiDocumentationUrls: docs.documentationUrls } : null);
    } catch (e) { /* error handled by toast in server action */ }
    setIsLoading(null);
  };

  const handleSuggestTagsAI = async () => {
    if (!project || !project.aiSummary) {
      toast({ title: "Cannot Suggest Tags", description: "Project summary not available. Run AI summary first.", variant: "destructive" });
      return;
    }
    setIsLoading('tags');
    try {
      // Using simplified inputs for demo
      const tags = await handleSuggestTagsServer(
        project.aiSummary.purpose || project.description || "Project Details", 
        "main.ts, package.json, README.md", // Mock file list
        project.mainLanguage || "unknown"
      );
      setProject(prev => prev ? { ...prev, aiTags: tags.tags } : null);
    } catch (e) { /* error handled by toast in server action */ }
    setIsLoading(null);
  };


  const handleSaveNotes = () => {
    if (!project) return;
    // In a real app, save notes to a DB or file
    setProject(prev => prev ? { ...prev, userNotes } : null);
    // Update mockProjects (for demo persistence across navigation)
    const projectIndex = mockProjects.findIndex(p => p.id === project.id);
    if (projectIndex !== -1) {
      mockProjects[projectIndex].userNotes = userNotes;
    }
    toast({ title: "Notes Saved", description: "Your notes for this project have been saved." });
  };
  
  const handleOpenEditor = () => {
    toast({ title: "Open in Editor", description: "This feature would open the project in your configured IDE (not implemented in web demo)." });
  };
  
  const handleGitAction = (action: string) => {
      toast({ title: `Git Action: ${action}`, description: `Simulating Git ${action} operation. This would interact with local Git CLI in a desktop app.` });
  }


  if (!project) {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <AlertCircle className="w-16 h-16 text-destructive mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Project Not Found</h2>
            <p className="text-muted-foreground mb-4">The project you are looking for does not exist or could not be loaded.</p>
            <Button asChild>
                <Link href="/projects">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Projects
                </Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.push('/projects')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
      </Button>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <CardTitle className="text-3xl font-bold flex items-center">
              {project.name}
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">{project.path}</CardDescription>
            {project.mainLanguage && <Badge variant="secondary" className="mt-2">{project.mainLanguage}</Badge>}
          </div>
          <Button onClick={handleOpenEditor} variant="default" size="lg">
            <ExternalLink className="mr-2 h-5 w-5" /> Open in Editor
          </Button>
        </CardHeader>
        <CardContent>
          <p>{project.description || "No description available for this project."}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="overview"><Info className="mr-1 h-4 w-4 sm:mr-2" />Overview</TabsTrigger>
          <TabsTrigger value="files"><FileCode className="mr-1 h-4 w-4 sm:mr-2" />Files</TabsTrigger>
          <TabsTrigger value="git"><GitMerge className="mr-1 h-4 w-4 sm:mr-2" />Git</TabsTrigger>
          <TabsTrigger value="notes"><StickyNote className="mr-1 h-4 w-4 sm:mr-2" />Notes</TabsTrigger>
          <TabsTrigger value="docs"><BookOpen className="mr-1 h-4 w-4 sm:mr-2" />Docs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Overview & AI Analysis</CardTitle>
              <CardDescription>Details about the project, including AI-generated insights.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Project Details</h3>
                  <p><strong>Size:</strong> {project.projectSize || 'N/A'}</p>
                  <p><strong>Complexity:</strong> {project.complexity || 'N/A'}</p>
                  <p><strong>Languages:</strong> {project.mainLanguage}{project.otherLanguages && project.otherLanguages.length > 0 ? `, ${project.otherLanguages.join(', ')}` : ''}</p>
                  <p><strong>Last Scanned:</strong> {project.lastScanned ? new Date(project.lastScanned).toLocaleString() : 'N/A'}</p>
                  <p><strong>Last Worked On:</strong> {project.lastWorkedOn ? new Date(project.lastWorkedOn).toLocaleString() : 'N/A'}</p>
                  <p><strong>Due Date:</strong> {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">AI Actions</h3>
                  <div className="space-y-2">
                    <Button onClick={handleAnalyze} disabled={isLoading === 'summary'} className="w-full justify-start">
                      {isLoading === 'summary' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Cpu className="mr-2 h-4 w-4" />}
                      Generate AI Summary
                    </Button>
                    <Button onClick={handleSuggestTagsAI} disabled={isLoading === 'tags' || !project.aiSummary} className="w-full justify-start">
                      {isLoading === 'tags' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Tags className="mr-2 h-4 w-4" />}
                      Suggest AI Tags
                    </Button>
                     <Button onClick={handleFetchDocs} disabled={isLoading === 'docs' || !project.aiSummary?.technologies} className="w-full justify-start">
                      {isLoading === 'docs' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookOpen className="mr-2 h-4 w-4" />}
                      Fetch Web Documentation
                    </Button>
                  </div>
                </div>
              </div>
              
              {project.aiSummary && (
                <Card className="bg-muted/30 dark:bg-muted/50">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center"><Cpu className="mr-2 h-5 w-5 text-primary" />AI Generated Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p><strong>Purpose:</strong> {project.aiSummary.purpose}</p>
                        <p><strong>Completeness:</strong> {project.aiSummary.completeness}</p>
                        <p><strong>Technologies:</strong> {project.aiSummary.technologies}</p>
                        <p><strong>Languages:</strong> {project.aiSummary.languages}</p>
                    </CardContent>
                </Card>
              )}
              {project.aiTags && project.aiTags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center"><Tags className="mr-2 h-5 w-5 text-primary"/>Suggested AI Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.aiTags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Project Files</CardTitle></CardHeader>
            <CardContent>
              <Alert>
                <FileCode className="h-4 w-4" />
                <AlertTitle>File Viewer</AlertTitle>
                <AlertDescription>
                  This area would display project contents (e.g., tree view). This functionality requires local file system access, typically available in a desktop application.
                  <Image src="https://picsum.photos/seed/filetree/600/300" alt="Placeholder file tree" data-ai-hint="file tree" width={600} height={300} className="mt-4 rounded-md shadow-md" />
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="git" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Git Integration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {project.gitData ? (
                <div>
                  <p><strong>Current Branch:</strong> {project.gitData.currentBranch || 'N/A'}</p>
                  <p><strong>Last Commit:</strong> {project.gitData.lastCommit || 'N/A'}</p>
                  <p><strong>Uncommitted Changes:</strong> {project.gitData.hasUncommittedChanges ? 'Yes' : 'No'}</p>
                </div>
              ) : (
                <p>No Git data available for this project. It might not be a Git repository or hasn't been scanned for Git info.</p>
              )}
              <Separator />
              <h3 className="text-md font-semibold">Common Git Operations:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {["Add All & Commit", "Push", "Pull", "Fetch", "Stash", "Discard Changes"].map(action => (
                    <Button key={action} variant="outline" onClick={() => handleGitAction(action.toLowerCase().replace(/\s+/g, '-'))}>
                        {action}
                    </Button>
                ))}
              </div>
              <Alert variant="default" className="mt-4">
                <Rocket className="h-4 w-4" />
                <AlertTitle>Desktop Feature</AlertTitle>
                <AlertDescription>
                  Full Git integration requires local system access and Git CLI, typically part of a desktop application version of Project Sleuth. Operations here are simulated.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Project Notes</CardTitle></CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write your notes about this project here..."
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                rows={10}
                className="mb-4"
              />
              <Button onClick={handleSaveNotes}>Save Notes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="docs" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><BookOpen className="mr-2 h-5 w-5 text-primary"/>Web Documentation</CardTitle>
                    <CardDescription>AI-fetched documentation URLs for project technologies.</CardDescription>
                </CardHeader>
                <CardContent>
                    {(!project.aiDocumentationUrls || project.aiDocumentationUrls.length === 0) && !isLoading && (
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>No Documentation URLs</AlertTitle>
                            <AlertDescription>
                                No documentation URLs have been fetched for this project yet. Click the button below to try.
                                Ensure project technologies are identified (run AI Summary first if needed).
                            </AlertDescription>
                        </Alert>
                    )}
                    {project.aiDocumentationUrls && project.aiDocumentationUrls.length > 0 && (
                        <ul className="space-y-2">
                            {project.aiDocumentationUrls.map((url, index) => (
                                <li key={index} className="flex items-center">
                                    <Link href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center">
                                        <ExternalLink className="mr-2 h-4 w-4" /> {url}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                     <Button onClick={handleFetchDocs} disabled={isLoading === 'docs' || !project.aiSummary?.technologies} className="mt-4">
                      {isLoading === 'docs' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                      Fetch/Refresh Documentation
                    </Button>
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}

