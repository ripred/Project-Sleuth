# Project Sleuth - TODO List

This document outlines the features and functionalities that are not yet fully implemented in Project Sleuth, broken down into actionable steps.

## Core Functionality

*   **Detailed Project Data Gathering:** Enhance the scanning logic (`src/server/actions.ts`) to collect more comprehensive data during the scan:
    *   [ ] Implement detailed language detection by analyzing file extensions and potentially file contents.
    *   [ ] Detect and list main and other languages used in a project.
    *   [ ] Calculate and store project size (e.g., total file size, number of files).
    *   [ ] Implement logic to estimate project complexity (e.g., based on file count, directory depth, language mix).
    *   [ ] Gather more comprehensive Git data:
        *   [ ] List all remotes with their URLs.
        *   [ ] Fetch basic commit history (e.g., last N commits).
        *   [ ] Get information about stashed changes.
    *   [ ] Identify and list project dependencies by parsing manifest files (e.g., `package.json`, `pom.xml`, `requirements.txt`).
    *   [ ] Handle different project types and their respective manifest files.
    *   [ ] Update the `Project` interface in `src/lib/types.ts` as needed to accommodate new data points.
    *   [ ] Refine error handling during data gathering to be non-blocking where possible.

*   **Project Detail Page:** Implement the page (`src/app/projects/[id]/page.tsx`) to display all the detailed information gathered for a specific project.
    *   [ ] Create the `src/app/projects/[id]/page.tsx` file.
    *   [ ] Implement logic to fetch the detailed data for a specific project ID (likely requires a new Server Action or modifying `scanProjects` to fetch by ID).
    *   [ ] Design and build the UI components to display:
        *   [ ] Project name, path, description.
        *   [ ] Languages, size, complexity.
        *   [ ] Git data (branch, commits, remotes, status).
        *   [ ] Dependencies.
        *   [ ] AI-generated data (summary, tags, docs - once implemented).
        *   [ ] User-added notes and custom tags.
        *   [ ] Last scanned and last worked on dates.
        *   [ ] Due date.
    *   [ ] Implement loading states and error handling for fetching project details.

*   **Project Actions Implementation:** Implement the backend/local logic for the project actions available in the dropdown menu on the projects list and detail pages.
    *   [ ] **Analyze (AI):**
        *   [ ] Create a new Server Action or API route to trigger AI analysis for a project.
        *   [ ] In the Server Action, read relevant project files and prepare input for the `projectSummary` Genkit flow.
        *   [ ] Call the `projectSummary` Genkit flow.
        *   [ ] Update the project data (in storage) with the AI summary result.
        *   [ ] Return the updated project data to the frontend.
        *   [ ] Update the frontend `handleProjectAction` to call this new action and update state.
    *   [ ] **Suggest Tags (AI):**
        *   [ ] Create a new Server Action or API route to trigger AI tagging for a project.
        *   [ ] In the Server Action, prepare input for the `suggestProjectTags` Genkit flow (potentially using the summary or code snippets).
        *   [ ] Call the `suggestProjectTags` Genkit flow.
        *   [ ] Update the project data (in storage) with the suggested tags.
        *   [ ] Return the updated project data to the frontend.
        *   [ ] Update the frontend `handleProjectAction` to call this new action and update state.
    *   [ ] **Fetch Docs (AI):**
        *   [ ] Create a new Server Action or API route to trigger AI documentation fetching for a project.
        *   [ ] In the Server Action, prepare input for the `fetchWebDocumentation` Genkit flow (using identified technologies).
        *   [ ] Call the `fetchWebDocumentation` Genkit flow.
        *   [ ] Update the project data (in storage) with the documentation URLs.
        *   [ ] Return the updated project data to the frontend.
        *   [ ] Update the frontend `handleProjectAction` to call this new action and update state.
    *   [ ] **Open in Editor:**
        *   [ ] Create a new Server Action or API route to handle opening a project path.
        *   [ ] In the Server Action, get the configured editor path/command from settings.
        *   [ ] Use `child_process.exec` or `spawn` to execute the editor command with the project path.
        *   [ ] Implement error handling if the command fails or the editor path is invalid.
        *   [ ] Update the frontend `handleProjectAction` to call this action.
    *   [ ] **Delete Project:**
        *   [ ] Create a new Server Action or API route to handle project deletion.
        *   [ ] In the Server Action, remove the project from any persistent storage.
        *   [ ] **(Optional/Careful):** Implement logic to *offer* to delete the project directory from the file system, with clear user confirmation and safeguards.
        *   [ ] Update the frontend `handleProjectAction` to call this action and remove the project from the state upon success.

*   **Manual Project Addition:** Implement the UI and backend logic to allow users to manually add projects.
    *   [ ] Enable the "Add Project Manually" button.
    *   [ ] Create a form or modal for the user to enter the project path.
    *   [ ] Create a Server Action or API route to handle manual project addition.
    *   [ ] In the Server Action, validate the provided path.
    *   [ ] If valid, run the project data gathering logic (similar to scan) on the single provided path.
    *   [ ] Add the newly gathered project data to the main project list (in storage).
    *   [ ] Update the frontend project list after successful addition.

*   **Advanced Project Filtering:** Implement the functionality for advanced filtering of the project list.
    *   [ ] Design the filter options (e.g., by language, tag, last worked on date, due date, complexity, size).
    *   [ ] Implement UI elements (e.g., dropdowns, date pickers) for selecting filter criteria.
    *   [ ] Implement frontend logic to apply selected filters to the `filteredProjects` state.

## Settings and Persistence

*   **Full Settings Persistence:** Ensure all application settings (API keys, editors, default editor, scan paths) are reliably saved and loaded.
    *   [ ] Implement robust saving and loading of all settings to and from `localStorage`.
    *   [ ] Load settings when the application initializes.
    *   [ ] Update settings in `localStorage` whenever they are changed on the settings page.
    *   [ ] (Future Consideration): Explore more robust local storage solutions if needed, but `localStorage` is sufficient for a local-first app initially.

## User Interface and Experience

*   **Dashboard Overview:** Implement the main dashboard page to provide a summary of projects, recent activity, and quick links.
    *   [ ] Create the dashboard page component (`src/app/page.tsx`).
    *   [ ] Design the layout to display:
        *   [ ] Number of projects by language/type.
        *   [ ] Recently scanned or worked on projects.
        *   [ ] Projects nearing their due date.
        *   [ ] Quick links to scan, settings, etc.
    *   [ ] Implement logic to fetch and aggregate data for the dashboard display from the project list.