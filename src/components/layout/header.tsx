
"use client"

import React from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { usePathname } from "next/navigation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import Link from "next/link"

function getPageTitle(pathname: string): string {
  if (pathname === "/") return "Dashboard"
  if (pathname.startsWith("/projects")) {
    const parts = pathname.split("/")
    if (parts.length === 3 && parts[1] === "projects" && parts[2] !== "") return "Project Details" // e.g. /projects/my-project
    return "Projects"
  }
  if (pathname.startsWith("/settings")) return "Settings"
  return "Project Sleuth"
}

function generateBreadcrumbs(pathname: string) {
  const pathParts = pathname.split("/").filter(part => part);
  const breadcrumbs = [{ label: "Home", href: "/" }];

  pathParts.forEach((part, index) => {
    const href = "/" + pathParts.slice(0, index + 1).join("/");
    // Capitalize first letter
    let label = part.charAt(0).toUpperCase() + part.slice(1);
    // Replace URL encoded hyphens with spaces, and decode URI components
    label = decodeURIComponent(label.replace(/-/g, ' '));
    breadcrumbs.push({ label, href });
  });

  return breadcrumbs;
}


export function Header() {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
         <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((breadcrumb, index) => (
                <React.Fragment key={breadcrumb.href}>
                  <BreadcrumbItem>
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={breadcrumb.href} legacyBehavior>{breadcrumb.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}

