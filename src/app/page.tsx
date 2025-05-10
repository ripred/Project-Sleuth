
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, AlertTriangle, CheckCircle2, FolderKanban, GitFork, Cpu, Lightbulb, Tags, BookOpen } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


export default function DashboardPage() {
  // Mock data for dashboard
  const stats = [
    { title: "Projects Tracked", value: "15", icon: FolderKanban, color: "text-blue-500", tooltip: "Total number of projects discovered and tracked by Project Sleuth." },
    { title: "AI Analyses Run", value: "42", icon: Cpu, color: "text-green-500", tooltip: "Number of times AI-powered analyses (summaries, tagging, etc.) have been performed." },
    { title: "Git Commits Today", value: "8", icon: GitFork, color: "text-purple-500", tooltip: "Simulated count of Git commits across tracked projects for today." },
    { title: "Pending Actions", value: "3", icon: AlertTriangle, color: "text-yellow-500", tooltip: "Number of items or projects that may require your attention." },
  ];

  const quickActions = [
    { label: "Scan for New Projects", href: "/projects", icon: FolderKanban, tooltip: "Initiate a scan of your local drives to discover new or updated projects." },
    { label: "Configure AI Services", href: "/settings", icon: Lightbulb, tooltip: "Set up API keys and configure AI service integrations for analysis features." },
    { label: "View Recent Activity", href: "#", icon: Activity, tooltip: "Check recent activities within Project Sleuth (Feature coming soon)." },
  ];

  const features = [
    { name: "AI Project Summary", description: "Get purpose, completeness, tech, and languages.", icon: Cpu, color: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300", tooltip: "Leverage AI to automatically generate comprehensive summaries of your projects." },
    { name: "Git Integration", description: "Commit, push, pull, and manage changes easily.", icon: GitFork, color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300", tooltip: "Perform common Git operations directly within Project Sleuth for streamlined version control." },
    { name: "Web Documentation", description: "Find official docs for project technologies.", icon: BookOpen, color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300", tooltip: "AI-assisted search to quickly find official documentation for technologies used in your projects." },
    { name: "AI Tagging", description: "Auto-suggest relevant tags for your projects.", icon: Tags, color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300", tooltip: "Automatically get relevant tag suggestions for better project organization and discovery." },
  ];


  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Welcome to Project Sleuth!</CardTitle>
            <CardDescription className="text-lg">Your intelligent assistant for project discovery, analysis, and management.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Get started by scanning for projects or configuring your settings.</p>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{stat.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.title === "Pending Actions" ? "Require attention" : "+2 from last week"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            {quickActions.map((action) => (
              <Tooltip key={action.label}>
                <TooltipTrigger asChild>
                  <Button variant="outline" asChild>
                    <Link href={action.href} legacyBehavior>
                      <action.icon className="mr-2 h-4 w-4" />
                      {action.label}
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{action.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Core Features</CardTitle>
            <CardDescription>Explore the powerful capabilities of Project Sleuth.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.name} className="flex items-start space-x-4 rounded-lg border p-4 bg-card hover:shadow-md transition-shadow">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${feature.color}`}>
                      <feature.icon className="h-5 w-5" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{feature.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
                <div>
                  <h3 className="text-lg font-semibold">{feature.name}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>


        <Card className="shadow-md">
          <CardHeader>
              <CardTitle>Getting Started Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <p><span className="font-semibold">1. Configure API Keys:</span> Navigate to <Link href="/settings" className="text-primary hover:underline">Settings</Link> to add your AI service API keys for full functionality.</p>
              </div>
              <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <p><span className="font-semibold">2. Discover Projects:</span> Go to the <Link href="/projects" className="text-primary hover:underline">Projects</Link> page and initiate a scan to find projects on your local drive.</p>
              </div>
              <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <p><span className="font-semibold">3. Analyze & Manage:</span> Select a project to view details, run AI summaries, manage Git, and more.</p>
              </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}

