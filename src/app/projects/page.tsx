
"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FolderKanban, Search, PlusCircle, ListFilter, FileText, ExternalLink, MoreHorizontal, Eye, Trash2, Cpu, Tags, BookOpen } from 'lucide-react';
import type { Project } from '@/lib/types';
import { mockProjects } from '@/lib/mock-data'; // Using mock data for now
import { useRouter } from 'next/navigation'; // Corrected import

// Helper to get a language-specific icon (simplified)
const LanguageIcon = ({ lang }: { lang?: string }) => {
  if (!lang) return <FileText className="h-5 w-5 text-muted-foreground" />;
  const l = lang.toLowerCase();
  if (l === 'typescript' || l === 'javascript') return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12.01 2C6.49 2 2.02 6.48 2.02 12s4.47 10 9.99 10c5.53 0 10.01-4.48 10.01-10S17.54 2 12.01 2zM12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2.29-8.21c.44-.71 1.04-1.26 1.78-1.6.23-.1.38-.32.38-.57 0-.35-.28-.63-.63-.63-.29 0-.55.2-.61.49-.15.66-.75 1.1-1.43 1.1-.91 0-1.65-.74-1.65-1.65s.74-1.65 1.65-1.65c.47 0 .9.21 1.21.55.42.46.67.88.79 1.28.09.3.37.52.68.52.41 0 .75-.34.75-.75 0-.52-.23-1.06-.65-1.6-.59-.76-1.36-1.32-2.21-1.61-.3-.1-.63.04-.82.29-.43.56-.43 1.34 0 1.9.44.57 1.03 1.05 1.72 1.39.23.11.37.34.37.59 0 .35-.28.63-.63.63-.3 0-.56-.21-.62-.5-.17-.78-.91-1.31-1.74-1.31-.91 0-1.65.74-1.65 1.65S9.44 15 10.35 15c.49 0 .95-.23 1.26-.61.41-.51.63-.95.74-1.39.08-.3.36-.5.66-.5.41 0 .75.34.75.75-.01.53-.23 1.08-.67 1.63zm3.08.21c-.43.55-1.01 1.02-1.69 1.35-.23.11-.37.34-.37.59 0 .35.28.63.63.63.29 0 .55-.2.61-.49.17-.77.91-1.31 1.74-1.31.91 0 1.65.74 1.65-1.65S14.56 10 13.65 10c-.49 0-.94.23-1.25.6-.41.51-.64.95-.75 1.4-.08.3-.36.5-.66.5-.41 0-.75-.34-.75-.75 0-.52.23-1.05.66-1.59.59-.76 1.37-1.32 2.23-1.61.3-.1.63.05.82.3.43.56.43 1.34 0 1.9zm0 0"/></svg>;
  if (l === 'python') return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19.56 10.88c-.2-.52-.53-.99-.96-1.37-.8-.71-1.95-.9-3.03-.59-.81.22-1.5.79-1.93 1.48-.08.13-.02.3.12.35.08.03.17 0 .22-.06.31-.4.78-.67 1.27-.77.85-.17 1.72.15 2.23.83.38.5.49 1.17.29 1.77-.17.52-.5.98-.94 1.36-.8.71-1.95.9-3.03.59-.81-.22-1.5-.79-1.93-1.48-.08-.13-.02-.3.12-.35.08-.03.17 0 .22-.06.31-.4.78-.67 1.27-.77.85-.17 1.72.15 2.23.83.38.5.49 1.17.29 1.77v.01zm-10.9.27c.08.13.02.3-.12.35-.08.03-.17 0-.22-.06-.31-.4-.78-.67-1.27-.77-.85-.17-1.72.15-2.23.83-.38.5-.49 1.17-.29 1.77.17.52.5.98.94 1.36.8.71 1.95.9 3.03.59.81-.22 1.5-.79 1.93-1.48.08-.13.02-.3-.12-.35-.08-.03-.17 0-.22-.06-.31-.4-.78-.67-1.27-.77-.85-.17-1.72.15-2.23.83-.38-.5-.49-1.17-.29-1.77.2-.52.53-.99.96-1.37.8-.71 1.95-.9 3.03-.59.81.22 1.5.79 1.93 1.48zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>;
  if (l === 'java') return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-orange-600"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 15h-3.18c-.55 0-1-.45-1-1v-2.27c0-.24.1-.47.29-.63L16 12l-2.89-1.1c-.19-.16-.29-.39-.29-.63V8c0-.55.45-1 1-1H18v11zM7.5 12.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5S9.83 11 9 11s-1.5.67-1.5 1.5zM12 18H6c-.55 0-1-.45-1-1v-1.5c0-.42.27-.8.66-.94.74-.28 1.34-1.01 1.34-1.81v-.5c0-.47-.29-.89-.72-1.06C5.86 10.99 5.5 10.58 5.5 10V8c0-.55.45-1 1-1h5.38c.21 0 .41.1.54.28L15 9.87l-2.81 2.98c-.35.35-.54.81-.54 1.3V17c0 .55-.45 1-1 1z"/></svg>;
  return <FileText className="h-5 w-5 text-muted-foreground" />;
};


export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For scan simulation

  useEffect(() => {
    // Simulate fetching projects
    setProjects(mockProjects);
  }, []);

  const handleScanProjects = () => {
    setIsLoading(true);
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
      setProjects(prev => [newProject, ...prev]);
      setIsLoading(false);
      console.log("Scan complete (simulated).");
    }, 2000);
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.mainLanguage && project.mainLanguage.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleProjectAction = (projectId: string, action: string) => {
    console.log(`Action: ${action} on project ${projectId}`);
    if (action === 'view') {
      router.push(`/projects/${projectId}`);
    }
    // Implement other actions like delete, analyze, etc.
  };

  return (
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
            <Button onClick={handleScanProjects} disabled={isLoading}>
              <Search className="mr-2 h-4 w-4" />
              {isLoading ? "Scanning..." : "Scan for Projects"}
            </Button>
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
              <Button variant="outline">
                <ListFilter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Project Manually
              </Button>
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
                  <TableRow key={project.id}>
                    <TableCell className="hidden sm:table-cell">
                      <LanguageIcon lang={project.mainLanguage} />
                    </TableCell>
                    <TableCell>
                      <Link href={`/projects/${project.id}`} className="font-medium text-primary hover:underline">
                        {project.name}
                      </Link>
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
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleProjectAction(project.id, 'view')}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleProjectAction(project.id, 'analyze')}>
                            <Cpu className="mr-2 h-4 w-4" /> Analyze (AI)
                          </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => handleProjectAction(project.id, 'tags')}>
                            <Tags className="mr-2 h-4 w-4" /> Suggest Tags (AI)
                          </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => handleProjectAction(project.id, 'docs')}>
                            <BookOpen className="mr-2 h-4 w-4" /> Fetch Docs (AI)
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleProjectAction(project.id, 'open')}>
                            <ExternalLink className="mr-2 h-4 w-4" /> Open in Editor
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleProjectAction(project.id, 'delete')}>
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
  );
}
