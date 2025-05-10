
"use client"

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; 
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from '@/components/ui/separator';
import { toast } from "@/hooks/use-toast";
import { projectSummary } from '@/ai/flows/project-summary';
import { fetchWebDocumentation } from '@/ai/flows/web-documentation';
import { suggestProjectTags } from '@/ai/flows/ai-tagging';
import type { Project, ProjectSummaryOutput, FetchWebDocumentationOutput, SuggestProjectTagsOutput, AppSettings, EditorSetting } from '@/lib/types';
import { mockProjects } from '@/lib/mock-data';
import {
  ArrowLeft, Info, FileCode, GitMerge, StickyNote, BookOpen, ExternalLink, Cpu, Tags, Rocket, PlayCircle, Eye, AlertCircle, Loader2, CalendarClock, Edit3, Settings2, CalendarIcon, HelpCircle, Save, XCircle, PlusCircle
} from 'lucide-react';
import Image from 'next/image';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from "date-fns";
import { cn } from '@/lib/utils';

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
  const [configuredEditor, setConfiguredEditor] = useState<EditorSetting | null>(null);

  // State for inline editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingNameValue, setEditingNameValue] = useState("");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editingDescriptionValue, setEditingDescriptionValue] = useState("");
  const [isEditingMainLanguage, setIsEditingMainLanguage] = useState(false);
  const [editingMainLanguageValue, setEditingMainLanguageValue] = useState("");
  const [newCustomTag, setNewCustomTag] = useState("");

  useEffect(() => {
    if (id) {
      const foundProject = mockProjects.find(p => p.id === id);
       if (foundProject) {
        const processedProject = {
            ...foundProject,
            dueDate: foundProject.dueDate ? new Date(foundProject.dueDate) : undefined,
            customTags: foundProject.customTags || [], // Ensure customTags is an array
        };
        setProject(processedProject);
        setUserNotes(processedProject.userNotes || "");
        setEditingNameValue(processedProject.name);
        setEditingDescriptionValue(processedProject.description || "");
        setEditingMainLanguageValue(processedProject.mainLanguage || "");
      } else {
        setProject(null);
      }
    }
    // Load editor settings from localStorage
    const storedSettings = localStorage.getItem('appSettings');
    if (storedSettings) {
      try {
        const appSettings: AppSettings = JSON.parse(storedSettings);
        if (appSettings.defaultEditorId && appSettings.editors && appSettings.editors.length > 0) {
          const defaultEditor = appSettings.editors.find(editor => editor.id === appSettings.defaultEditorId);
          setConfiguredEditor(defaultEditor || appSettings.editors[0]); 
        } else if (appSettings.editors && appSettings.editors.length > 0) {
           setConfiguredEditor(appSettings.editors[0]); 
        }
         else {
          setConfiguredEditor(null);
        }
      } catch (error) {
        console.error("Failed to parse appSettings from localStorage", error);
        setConfiguredEditor(null);
      }
    }
  }, [id]);

  const updateMockProject = (updatedProject: Project) => {
    const projectIndex = mockProjects.findIndex(p => p.id === updatedProject.id);
    if (projectIndex !== -1) {
      mockProjects[projectIndex] = { ...mockProjects[projectIndex], ...updatedProject };
    }
  };

  const handleSaveName = () => {
    if (!project) return;
    const updatedProject = { ...project, name: editingNameValue };
    setProject(updatedProject);
    updateMockProject(updatedProject);
    setIsEditingName(false);
    toast({ title: "Project Name Updated", description: `Name changed to "${editingNameValue}".` });
  };

  const handleSaveDescription = () => {
    if (!project) return;
    const updatedProject = { ...project, description: editingDescriptionValue };
    setProject(updatedProject);
    updateMockProject(updatedProject);
    setIsEditingDescription(false);
    toast({ title: "Project Description Updated" });
  };
  
  const handleSaveMainLanguage = () => {
    if (!project) return;
    const updatedProject = { ...project, mainLanguage: editingMainLanguageValue };
    setProject(updatedProject);
    updateMockProject(updatedProject);
    setIsEditingMainLanguage(false);
    toast({ title: "Main Language Updated", description: `Set to ${editingMainLanguageValue}.` });
  };

  const handleAddCustomTag = () => {
    if (!project || !newCustomTag.trim()) return;
    const updatedTags = [...(project.customTags || []), newCustomTag.trim()];
    const updatedProject = { ...project, customTags: updatedTags };
    setProject(updatedProject);
    updateMockProject(updatedProject);
    setNewCustomTag("");
    toast({ title: "Custom Tag Added", description: `Tag "${newCustomTag.trim()}" added.` });
  };

  const handleRemoveCustomTag = (tagToRemove: string) => {
    if (!project) return;
    const updatedTags = (project.customTags || []).filter(tag => tag !== tagToRemove);
    const updatedProject = { ...project, customTags: updatedTags };
    setProject(updatedProject);
    updateMockProject(updatedProject);
    toast({ title: "Custom Tag Removed", description: `Tag "${tagToRemove}" removed.` });
  };

  const handleAnalyze = async () => {
    if (!project) return;
    setIsLoading('summary');
    try {
      const summary = await handleAnalyzeProjectServer(project.path, project.description || "No description available.");
      const updatedProject = { ...project, aiSummary: summary };
      setProject(updatedProject);
      updateMockProject(updatedProject);
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
      const updatedProject = { ...project, aiDocumentationUrls: docs.documentationUrls };
      setProject(updatedProject);
      updateMockProject(updatedProject);
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
      const tags = await handleSuggestTagsServer(
        project.aiSummary.purpose || project.description || "Project Details", 
        "main.ts, package.json, README.md", 
        project.mainLanguage || "unknown"
      );
      const updatedProject = { ...project, aiTags: tags.tags };
      setProject(updatedProject);
      updateMockProject(updatedProject);
    } catch (e) { /* error handled by toast in server action */ }
    setIsLoading(null);
  };


  const handleSaveNotes = () => {
    if (!project) return;
    const updatedProject = { ...project, userNotes };
    setProject(updatedProject);
    updateMockProject(updatedProject);
    toast({ title: "Notes Saved", description: "Your notes for this project have been saved." });
  };
  
  const handleOpenEditor = () => {
    const editorCommand = configuredEditor?.path || configuredEditor?.name || "your editor";
    toast({ title: "Open in Editor", description: `This feature would open the project in ${editorCommand} (not implemented in web demo).` });
  };
  
  const handleGitAction = (action: string) => {
      toast({ title: `Git Action: ${action}`, description: `Simulating Git ${action} operation. This would interact with local Git CLI in a desktop app.` });
  }

  const handleDueDateChange = (date: Date | undefined) => {
    if (!project) return;
    const updatedProject = { ...project, dueDate: date };
    setProject(updatedProject);
    updateMockProject(updatedProject);
    if (date) {
      toast({ title: "Due Date Updated", description: `Due date set to ${format(date, "PPP")}.` });
    } else {
      toast({ title: "Due Date Cleared" });
    }
  };


  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Project Not Found</h2>
        <p className="text-muted-foreground mb-4">The project you are looking for does not exist or could not be loaded.</p>
        <Button asChild>
            <Link href="/projects" legacyBehavior>
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Projects
            </Link>
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Button variant="outline" onClick={() => router.push('/projects')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-grow">
              {!isEditingName ? (
                <div className="flex items-center gap-2">
                  <CardTitle className="text-3xl font-bold">{project.name}</CardTitle>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => { setIsEditingName(true); setEditingNameValue(project.name); }}>
                        <Edit3 className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Edit Project Name</p></TooltipContent>
                  </Tooltip>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input value={editingNameValue} onChange={(e) => setEditingNameValue(e.target.value)} className="text-3xl font-bold h-auto py-0" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={handleSaveName}><Save className="h-5 w-5 text-green-500" /></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Save Name</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setIsEditingName(false)}><XCircle className="h-5 w-5 text-red-500" /></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Cancel</p></TooltipContent>
                  </Tooltip>
                </div>
              )}
              <CardDescription className="text-lg text-muted-foreground">{project.path}</CardDescription>
              {project.mainLanguage && <Badge variant="secondary" className="mt-2">{project.mainLanguage}</Badge>}
            </div>
            <div className="flex flex-col items-end shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleOpenEditor} variant="default" size="lg">
                    <ExternalLink className="mr-2 h-5 w-5" /> Open in Editor
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Opens this project in your configured default editor ({configuredEditor?.name || 'Not configured'}).</p>
                  <p className="text-xs text-muted-foreground">This is simulated in the web demo.</p>
                </TooltipContent>
              </Tooltip>
              {configuredEditor && configuredEditor.name && (
                <div className="mt-2 text-sm text-muted-foreground">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/settings#editor-config"
                        className="hover:text-primary hover:underline flex items-center gap-1"
                        legacyBehavior>
                        <Edit3 className="h-4 w-4" />
                        Default: {configuredEditor.name}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to configure project editors in Settings.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
              {(!configuredEditor || !configuredEditor.name) && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href="/settings#editor-config"
                          className="hover:text-primary hover:underline flex items-center gap-1"
                          legacyBehavior>
                            <Settings2 className="h-4 w-4" />
                            Configure Default Editor
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>No default editor configured. Click to go to Settings.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!isEditingDescription ? (
              <div className="flex items-start gap-2">
                <p className="flex-grow">{project.description || "No description available for this project."}</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => { setIsEditingDescription(true); setEditingDescriptionValue(project.description || ""); }}>
                      <Edit3 className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Edit Description</p></TooltipContent>
                </Tooltip>
              </div>
            ) : (
              <div className="space-y-2">
                <Textarea value={editingDescriptionValue} onChange={(e) => setEditingDescriptionValue(e.target.value)} rows={3} />
                <div className="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button onClick={handleSaveDescription}><Save className="mr-2 h-4 w-4" />Save</Button>
                    </TooltipTrigger>
                     <TooltipContent><p>Save Description</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" onClick={() => setIsEditingDescription(false)}><XCircle className="mr-2 h-4 w-4" />Cancel</Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Cancel</p></TooltipContent>
                  </Tooltip>
                </div>
              </div>
            )}
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
                    <div className="space-y-1">
                      <p><strong>Size:</strong> {project.projectSize || 'N/A'}</p>
                      <p><strong>Complexity:</strong> {project.complexity || 'N/A'}</p>
                      <div className="flex items-center gap-2">
                        <strong>Main Language:</strong>
                        {!isEditingMainLanguage ? (
                          <>
                            <span>{project.mainLanguage || 'N/A'}</span>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => { setIsEditingMainLanguage(true); setEditingMainLanguageValue(project.mainLanguage || ""); }}>
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent><p>Edit Main Language</p></TooltipContent>
                            </Tooltip>
                          </>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Input value={editingMainLanguageValue} onChange={(e) => setEditingMainLanguageValue(e.target.value)} className="h-8" />
                            <Tooltip> <TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={handleSaveMainLanguage}><Save className="h-4 w-4 text-green-500" /></Button></TooltipTrigger><TooltipContent><p>Save Language</p></TooltipContent></Tooltip>
                            <Tooltip> <TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => setIsEditingMainLanguage(false)}><XCircle className="h-4 w-4 text-red-500" /></Button></TooltipTrigger><TooltipContent><p>Cancel</p></TooltipContent></Tooltip>
                          </div>
                        )}
                      </div>
                       <p><strong>Other Languages:</strong> {project.otherLanguages && project.otherLanguages.length > 0 ? project.otherLanguages.join(', ') : 'N/A'}</p>
                      <p><strong>Last Scanned:</strong> {project.lastScanned ? new Date(project.lastScanned).toLocaleString() : 'N/A'}</p>
                      <p><strong>Last Worked On:</strong> {project.lastWorkedOn ? new Date(project.lastWorkedOn).toLocaleString() : 'N/A'}</p>
                      <div className="flex items-baseline space-x-2 mt-1">
                        <p className="font-semibold whitespace-nowrap">Due Date:</p>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[240px] justify-start text-left font-normal",
                                    !project.dueDate && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {project.dueDate ? format(project.dueDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Select or change the project due date.</p>
                              </TooltipContent>
                            </Tooltip>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={project.dueDate}
                              onSelect={handleDueDateChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">AI Actions</h3>
                    <div className="space-y-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button onClick={handleAnalyze} disabled={isLoading === 'summary'} className="w-full justify-start">
                            {isLoading === 'summary' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Cpu className="mr-2 h-4 w-4" />}
                            Generate AI Summary
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Uses AI to analyze project files and generate a summary of its purpose, completeness, technologies, and languages.</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button onClick={handleSuggestTagsAI} disabled={isLoading === 'tags' || !project.aiSummary} className="w-full justify-start">
                            {isLoading === 'tags' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Tags className="mr-2 h-4 w-4" />}
                            Suggest AI Tags
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Suggests relevant tags based on the AI project summary. Requires AI summary to be generated first.</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button onClick={handleFetchDocs} disabled={isLoading === 'docs' || !project.aiSummary?.technologies} className="w-full justify-start">
                            {isLoading === 'docs' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookOpen className="mr-2 h-4 w-4" />}
                            Fetch Web Documentation
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Searches the web for official documentation URLs for technologies identified in the AI summary. Requires AI summary first.</p>
                        </TooltipContent>
                      </Tooltip>
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

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center"><Tags className="mr-2 h-5 w-5 text-primary"/>Custom Tags</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(project.customTags || []).map(tag => (
                      <Badge key={tag} variant="outline" className="flex items-center gap-1">
                        {tag}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button onClick={() => handleRemoveCustomTag(tag)} className="ml-1 focus:outline-none">
                              <XCircle className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent><p>Remove tag: {tag}</p></TooltipContent>
                        </Tooltip>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={newCustomTag} 
                      onChange={(e) => setNewCustomTag(e.target.value)} 
                      placeholder="Add a custom tag"
                      className="h-8"
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddCustomTag();}}
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button onClick={handleAddCustomTag} size="sm" variant="outline"><PlusCircle className="mr-2 h-4 w-4" />Add Tag</Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Add this custom tag</p></TooltipContent>
                    </Tooltip>
                  </div>
                </div>

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
                    <Tooltip key={action}>
                      <TooltipTrigger asChild>
                        <Button variant="outline" onClick={() => handleGitAction(action.toLowerCase().replace(/\s+/g, '-'))}>
                            {action}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Simulates 'git {action.toLowerCase()}' command. Requires desktop app for real execution.</p>
                      </TooltipContent>
                    </Tooltip>
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
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <Button onClick={handleSaveNotes}><Save className="mr-2 h-4 w-4" />Save Notes</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Save your notes for this project (simulated persistence for demo).</p>
                    </TooltipContent>
                </Tooltip>
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
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Link
                                          href={url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-primary hover:underline flex items-center"
                                          legacyBehavior>
                                            <ExternalLink className="mr-2 h-4 w-4" /> {url}
                                        </Link>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Opens documentation link in a new tab: {url}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </li>
                              ))}
                          </ul>
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button onClick={handleFetchDocs} disabled={isLoading === 'docs' || !project.aiSummary?.technologies} className="mt-4">
                            {isLoading === 'docs' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                            Fetch/Refresh Documentation
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Use AI to find or update documentation links for the project's technologies.</p>
                          {!project.aiSummary?.technologies && <p className="text-destructive-foreground">Requires AI Summary to be generated first.</p>}
                        </TooltipContent>
                      </Tooltip>
                  </CardContent>
              </Card>
          </TabsContent>

        </Tabs>
      </div>
    </TooltipProvider>
  );
}

