"use server";

import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

import type { Project, GitData } from '@/lib/types'; // Import the Project type

const SCAN_DEPTH_LIMIT = 5; // Limit scan depth initially

export async function scanProjects(dirsToScan: string[], currentDepth = 0): Promise<Project[]> {
  if (currentDepth > SCAN_DEPTH_LIMIT) {
    return [];
  }

  let discoveredProjects: Project[] = [];

  for (const dir of dirsToScan) {
    try {
      // Check if the directory is accessible before reading
      try {
        await fs.access(dir);
      } catch (accessError) {
        console.warn(`Skipping inaccessible directory ${dir}:`, accessError);
        continue; // Skip this directory if not accessible
      }

      const entries = await fs.readdir(dir, { withFileTypes: true });

      // Check if this directory is a project root (contains .git)
      const isProjectRoot = entries.some(entry => entry.isDirectory() && entry.name === '.git');

      if (isProjectRoot) {
        let projectName = path.basename(dir);
        let packageJson: any = null;

        // Attempt to read package.json for a better name and info
        const packageJsonPath = path.join(dir, 'package.json');
        try {
          const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
          packageJson = JSON.parse(packageJsonContent);
          if (packageJson.name) {
            projectName = packageJson.name;
          }
          // TODO: Extract language/dependencies from package.json or other manifest files

        } catch (jsonError: any) {
          if (jsonError.code !== 'ENOENT') {
             console.warn(`Could not read or parse package.json in ${dir}:`, jsonError);
          }
           // Continue without package.json data if it doesn't exist or has errors
        }

        const project: Project = {
          id: dir, // Using path as a unique ID for now
          name: projectName,
          path: dir,
          gitData: {}, // Initialize gitData
          // Initialize other fields as undefined or defaults
        };

        // Attempt to get Git data
        try {
            const { stdout: branchOutput } = await execAsync('git rev-parse --abbrev-ref HEAD', { cwd: dir });
            const { stdout: commitOutput } = await execAsync('git log -1 --pretty=format:"%h %s"', { cwd: dir });
            const { stdout: statusOutput } = await execAsync('git status --porcelain', { cwd: dir });

            project.gitData.currentBranch = branchOutput.trim();
            project.gitData.lastCommit = commitOutput.trim();
            project.gitData.hasUncommittedChanges = statusOutput.trim().length > 0;

        } catch (gitError) {
            console.warn(`Could not get Git data for ${dir}:`, gitError);
            // project.gitData will remain empty/incomplete
        }

      if (isProjectRoot) {
        discoveredProjects.push({
          name: path.basename(dir),
          path: dir,
        });
      } else {
        // If not a project root, recursively scan subdirectories
        const subDirs = entries
          .filter(entry => entry.isDirectory() && entry.name !== 'node_modules' && !entry.name.startsWith('.')) // Avoid node_modules and hidden dirs (except .git check above)
          .map(entry => path.join(dir, entry.name)); // Use path.join to create full path
        
        // Recursively call scanProjects for subdirectories
        discoveredProjects = discoveredProjects.concat(await scanProjects(subDirs, currentDepth + 1));
      }

    } catch (error) {
      console.error(`Error reading directory ${dir}:`, error);
      // Continue scanning other directories even if one fails
    }
  }

  return discoveredProjects;
}
