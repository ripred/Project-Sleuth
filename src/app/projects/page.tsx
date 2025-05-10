
"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FolderKanban, Search, PlusCircle, ListFilter, FileText, ExternalLink, MoreHorizontal, Eye, Trash2, Cpu, Tags, BookOpen, Loader2 } from 'lucide-react';
import type { Project, AppSettings, EditorSetting } from '@/lib/types';
import { mockProjects } from '@/lib/mock-data'; // Using mock data for now
import { useRouter } from 'next/navigation'; 
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from "@/hooks/use-toast";
import { projectSummary } from '@/ai/flows/project-summary';
import { fetchWebDocumentation } from '@/ai/flows/web-documentation';
import { suggestProjectTags } from '@/ai/flows/ai-tagging';


// Helper to get a language-specific icon (simplified)
const LanguageIcon = ({ lang }: { lang?: string }) => {
  if (!lang) return <FileText className="h-5 w-5 text-muted-foreground" />;
  const l = lang.toLowerCase();
  if (l === 'typescript' || l === 'javascript') return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12.01 2C6.49 2 2.02 6.48 2.02 12s4.47 10 9.99 10c5.53 0 10.01-4.48 10.01-10S17.54 2 12.01 2zM12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2.29-8.21c.44-.71 1.04-1.26 1.78-1.6.23-.1.38-.32.38-.57 0-.35-.28-.63-.63-.63-.29 0-.55.2-.61.49-.15.66-.75 1.1-1.43 1.1-.91 0-1.65-.74-1.65-1.65s.74-1.65 1.65-1.65c.47 0 .9.21 1.21.55.42.46.67.88.79 1.28.09.3.37.52.68.52.41 0 .75-.34.75-.75 0-.52-.23-1.06-.65-1.6-.59-.76-1.36-1.32-2.21-1.61-.3-.1-.63.04-.82.29-.43.56-.43 1.34 0 1.9.44.57 1.03 1.05 1.72 1.39.23.11.37.34.37.59 0 .35-.28.63-.63-.63-.3 0-.56-.21-.62-.5-.17-.78-.91-1.31-1.74-1.31-.91 0-1.65.74-1.65 1.65S9.44 15 10.35 15c.49 0 .95-.23 1.26-.61.41-.51.63-.95.74-1.39.08-.3.36-.5.66-.5.41 0 .75-.34.75-.75-.01.53-.23 1.08-.67 1.63zm3.08.21c-.43.55-1.01 1.02-1.69 1.35-.23.11-.37.34-.37.59 0 .35.28.63.63.63.29 0 .55-.2.61-.49.17-.77.91-1.31 1.74-1.31.91 0 1.65.74 1.65-1.65S14.56 10 13.65 10c-.49 0-.94.23-1.25.6-.41.51-.64.95-.75 1.4-.08.3-.36.5-.66.5-.41 0-.75-.34-.75-.75 0-.52.23-1.05.66-1.59.59-.76 1.37-1.32 2.23-1.61.3-.1.63.05.82.3.43.56.43 1.34 0 1.9zm0 0"/></svg>;
  if (l === 'python') return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19.56 10.88c-.2-.52-.53-.99-.96-1.37-.8-.71-1.95-.9-3.03-.59-.81.22-1.5.79-1.93 1.48-.08.13-.02.3.12.35.08.03.17 0 .22-.06.31-.4.78-.67 1.27-.77.85-.17 1.72.15 2.23.83.38.5.49 1.17.29 1.77-.17.52-.5.98-.94 1.36-.8.71-1.95.9-3.03.59-.81-.22-1.5-.79-1.93-1.48-.08-.13-.02.3.12.35.08.03.17 0 .22-.06.31-.4.78-.67 1.27-.77.85-.17 1.72.15 2.23.83.38.5.49 1.17.29 1.77v.01zm-10.9.27c.08.13.02.3-.12.35-.08.03-.17 0-.22-.06-.31-.4-.78-.67-1.27-.77-.85-.17-1.72.15-2.23.83-.38.5-.49 1.17-.29 1.77.17.52.5.98.94 1.36.8.71 1.95.9 3.03.59.81-.22 1.5-.79 1.93-1.48.08-.13-.02-.3-.12-.35-.08.03-.17 0-.22-.06-.31-.4.78-.67-1.27-.77-.85-.17-1.72.15-2.23.83-.38-.5-.49-1.17-.29-1.77.2-.52.53-.99.96-1.37.8-.71 1.95-.9 3.03-.59.81.22 1.5.79 1.93 1.48zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>;
  if (l === 'java') return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-orange-600"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 15h-3.18c-.55 0-1-.45-1-1v-2.27c0-.24.1-.47.29-.63L16 12l-2.89-1.1c-.19-.16-.29-.39-.29-.63V8c0-.55.45-1 1-1H18v11zM7.5 12.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5S9.83 11 9 11s-1.5.67-1.5 1.5zM12 18H6c-.55 0-1-.45-1-1v-1.5c0-.42.27-.8.66-.94.74-.28 1.34-1.01 1.34-1.81v-.5c0-.47-.29-.89-.72-1.06C5.86 10.99 5.5 10.58 5.5 10V8c0-.55.45-1 1-1h5.38c.21 0 .41.1.54.28L15 9.87l-2.81 2.98c-.35.35-.54.81-.54 1.3V17c0 .55-.45 1-1 1z"/></svg>;
  return <FileText className="h-5 w-5 text-muted-foreground" />;
};


export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingScan, setIsLoadingScan] = useState(false); // For scan simulation
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null); // For dropdown actions, format: `${action}-${projectId}`


  useEffect(() => {
    // Simulate fetching projects
    setProjects([...mockProjects]); // Create a new array to ensure state updates
  }, []);

  const handleScanProjects = () => {
    setIsLoadingScan(true);
    // Simulate a scan operation
    console.log("Scanning for projects (simulated)...");
    setTimeout(() => {
      // Add a new mock project or update existing ones
      const newProject: Project = {
        id: `new-project-${Date.now()}`,
        name: "Newly Discovered Project",
        path: "/path/to/newly/discovered",
        mainLanguage: "Python",
        lastScanned: new Date(),
        description: "A project found during the latest scan."
      };
      // Add to both mockProjects and local state
      mockProjects.unshift(newProject); 
      setProjects(prev => [newProject, ...prev]);
      setIsLoadingScan(false);
      toast({ title: "Scan Complete", description: "Simulated scan finished and one new project added." });
    }, 2000);
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.mainLanguage && project.mainLanguage.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleProjectAction = async (projectId: string, action: string, event?: React.MouseEvent) => {
    event?.stopPropagation(); // Stop event from bubbling to row's onClick
    console.log(`Action: ${action} on project ${projectId}`);
    const currentProject = projects.find(p => p.id === projectId);
    if (!currentProject && action !== 'view' /* view will handle not found */) {
        toast({ title: "Error", description: "Project not found.", variant: "destructive" });
        return;
    }

    const actionLoadingKey = `${action}-${projectId}`;

    if (action === 'view') {
      router.push(`/projects/${projectId}`);
    } else if (action === 'delete') {
      setProjects(prev => prev.filter(p => p.id !== projectId));
      const projectIndex = mockProjects.findIndex(p => p.id === projectId);
      if (projectIndex > -1) {
        mockProjects.splice(projectIndex, 1);
      }
      toast({ title: "Project Deleted", description: `Project "${currentProject?.name}" has been removed.` });
    } else if (action === 'open') {
        let configuredEditor: EditorSetting | null = null;
        const storedSettings = localStorage.getItem('appSettings');
        if (storedSettings) {
            try {
            const appSettings: AppSettings = JSON.parse(storedSettings);
            if (appSettings.defaultEditorId && appSettings.editors && appSettings.editors.length > 0) {
                configuredEditor = appSettings.editors.find(editor => editor.id === appSettings.defaultEditorId) || appSettings.editors[0];
            } else if (appSettings.editors && appSettings.editors.length > 0) {
                configuredEditor = appSettings.editors[0];
            }
            } catch (error) {
            console.error("Failed to parse appSettings from localStorage", error);
            }
        }
        const editorCommand = configuredEditor?.name || "your editor";
        toast({ title: "Open in Editor", description: `This feature would open the project in ${editorCommand} (not implemented in web demo).` });
    } else if (action === 'analyze') {
        if (!currentProject) return;
        setIsActionLoading(actionLoadingKey);
        toast({ title: "AI Analysis Started", description: `Summarizing ${currentProject.name}...` });
        try {
            const summary = await projectSummary({ projectPath: currentProject.path, fileContents: currentProject.description || "No description." });
            const updatedProjects = projects.map(p => p.id === projectId ? { ...p, aiSummary: summary } : p);
            setProjects(updatedProjects);
            const mockProjectIndex = mockProjects.findIndex(p => p.id === projectId);
            if (mockProjectIndex > -1) {
            mockProjects[mockProjectIndex].aiSummary = summary;
            }
            toast({ title: "AI Analysis Complete", description: `Summary generated for ${currentProject.name}.` });
        } catch (error) {
            console.error("Error in AI Project Summary:", error);
            toast({ title: "AI Analysis Failed", description: (error as Error).message || "Could not generate summary.", variant: "destructive" });
        } finally {
            setIsActionLoading(null);
        }
    } else if (action === 'tags') {
        if (!currentProject) return;
        if (!currentProject.aiSummary) {
            toast({ title: "Cannot Suggest Tags", description: "Project summary not available. Run AI summary first.", variant: "destructive" });
            return;
        }
        setIsActionLoading(actionLoadingKey);
        toast({ title: "Generating Tags", description: `Suggesting tags for ${currentProject.name}...` });
        try {
            const tags = await suggestProjectTags({
            projectDescription: currentProject.aiSummary.purpose || currentProject.description || "Project Details",
            fileList: "main.ts, package.json, README.md", // Placeholder
            language: currentProject.mainLanguage || "unknown"
            });
            const updatedProjects = projects.map(p => p.id === projectId ? { ...p, aiTags: tags.tags } : p);
            setProjects(updatedProjects);
            const mockProjectIndex = mockProjects.findIndex(p => p.id === projectId);
            if (mockProjectIndex > -1) {
            mockProjects[mockProjectIndex].aiTags = tags.tags;
            }
            toast({ title: "Tags Suggested", description: `Generated ${tags.tags.length} tags for ${currentProject.name}.` });
        } catch (error) {
            console.error("Error in AI Tagging:", error);
            toast({ title: "Tag Suggestion Failed", description: (error as Error).message || "Could not suggest tags.", variant: "destructive" });
        } finally {
            setIsActionLoading(null);
        }
    } else if (action === 'docs') {
        if (!currentProject) return;
        if (!currentProject.aiSummary?.technologies) {
            toast({ title: "Cannot Fetch Docs", description: "Project technologies not available. Run AI summary first.", variant: "destructive" });
            return;
        }
        setIsActionLoading(actionLoadingKey);
        toast({ title: "Fetching Documentation", description: `Searching docs for ${currentProject.name}...` });
        try {
            const docs = await fetchWebDocumentation({ projectName: currentProject.name, technologies: currentProject.aiSummary.technologies });
            const updatedProjects = projects.map(p => p.id === projectId ? { ...p, aiDocumentationUrls: docs.documentationUrls } : p);
            setProjects(updatedProjects);
            const mockProjectIndex = mockProjects.findIndex(p => p.id === projectId);
            if (mockProjectIndex > -1) {
            mockProjects[mockProjectIndex].aiDocumentationUrls = docs.documentationUrls;
            }
            toast({ title: "Documentation Found", description: `Found ${docs.documentationUrls.length} URLs for ${currentProject.name}.` });
        } catch (error) {
            console.error("Error in Fetch Web Documentation:", error);
            toast({ title: "Documentation Fetch Failed", description: (error as Error).message || "Could not fetch documentation.", variant: "destructive" });
        } finally {
            setIsActionLoading(null);
        }
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-3xl font-bold flex items-center">
                  <FolderKanban className="mr-3 h-8 w-8 text-primary" />
                  Projects
                </CardTitle>
                <CardDescription>Discover, manage, and analyze your software projects.</CardDescription>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleScanProjects} disabled={isLoadingScan}>
                    {isLoadingScan ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                    {isLoadingScan ? "Scanning..." : "Scan for Projects"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Simulate scanning local drives for new or updated projects.</p>
                  <p className="text-xs text-muted-foreground">(Full functionality in desktop app)</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Project Sleuth can recursively scan your local drives for project folders based on criteria like .git folders, AI residue files, and common source file extensions.
              Currently, this feature is simulated for web demo purposes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <Input
                placeholder="Filter projects by name, path, or language..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">
                      <ListFilter className="mr-2 h-4 w-4" />
                      Filters
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Advanced filtering options (Not yet implemented).</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Project Manually
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Manually add a project to Project Sleuth (Not yet implemented).</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] hidden sm:table-cell"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Path</TableHead>
                  <TableHead className="hidden lg:table-cell">Language</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Scanned</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <TableRow 
                      key={project.id} 
                      onClick={() => router.push(`/projects/${project.id}`)}
                      className="cursor-pointer"
                    >
                      <TableCell className="hidden sm:table-cell">
                        <Tooltip>
                          <TooltipTrigger onClick={(e) => e.stopPropagation()}>
                             <LanguageIcon lang={project.mainLanguage} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{project.mainLanguage || "Unknown Language"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-primary hover:underline">
                          <Link
                            href={`/projects/${project.id}`}
                            onClick={(e) => e.stopPropagation()}
                            legacyBehavior>
                              {project.name}
                          </Link>
                        </div>
                        <div className="block sm:hidden text-xs text-muted-foreground">{project.path}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{project.path}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {project.mainLanguage && <Badge variant="secondary">{project.mainLanguage}</Badge>}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {project.lastScanned ? new Date(project.lastScanned).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                      <DropdownMenu>
                          <Tooltip>
                              <TooltipTrigger asChild>
                                  <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" disabled={!!isActionLoading} onClick={(e) => e.stopPropagation()}>
                                          <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                  </DropdownMenuTrigger>
                              </TooltipTrigger>
                              <TooltipContent side="left">
                                  <p>More actions for {project.name}</p>
                              </TooltipContent>
                          </Tooltip>
                          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={(e) => handleProjectAction(project.id, 'view', e)} disabled={!!isActionLoading}>
                                  <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => handleProjectAction(project.id, 'analyze', e)} disabled={isActionLoading === `analyze-${project.id}` || (!!isActionLoading && isActionLoading !== `analyze-${project.id}`)}>
                                  {isActionLoading === `analyze-${project.id}` ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Cpu className="mr-2 h-4 w-4" />}
                                  Analyze (AI)
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => handleProjectAction(project.id, 'tags', e)} disabled={isActionLoading === `tags-${project.id}` || (!!isActionLoading && isActionLoading !== `tags-${project.id}`)}>
                                  {isActionLoading === `tags-${project.id}` ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Tags className="mr-2 h-4 w-4" />}
                                  Suggest Tags (AI)
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => handleProjectAction(project.id, 'docs', e)} disabled={isActionLoading === `docs-${project.id}` || (!!isActionLoading && isActionLoading !== `docs-${project.id}`)}>
                                  {isActionLoading === `docs-${project.id}` ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookOpen className="mr-2 h-4 w-4" />}
                                  Fetch Docs (AI)
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => handleProjectAction(project.id, 'open', e)} disabled={!!isActionLoading}>
                                  <ExternalLink className="mr-2 h-4 w-4" /> Open in Editor
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive" onClick={(e) => handleProjectAction(project.id, 'delete', e)} disabled={!!isActionLoading}>
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete Project
                              </DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No projects found. Try a different filter or scan for projects.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>{filteredProjects.length}</strong> of <strong>{projects.length}</strong> projects.
            </div>
          </CardFooter>
        </Card>
      </div>
    </TooltipProvider>
  );
}

