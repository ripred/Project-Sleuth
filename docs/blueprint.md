# **App Name**: Project Sleuth

## Core Features:

- Project Discovery: Recursively scan local hard drives for project folders based on criteria like .git folders, AI residue files (.claude*, .windsurfrules, CLAUDE.md), and source file extensions (.cpp, .java, .py, .js).
- Database Management: Maintain and update a database of discovered project folders and their attributes upon each scan.
- Remote API Configuration: Provide settings to configure and store API keys for remote AI services for project analysis.
- AI Project Summary: Analyze project files and contents via remote API calls to provide a summary including the project's purpose, completeness, technologies used, and languages involved. This tool will leverage the remote API to make informed decisions and produce useful summaries.
- Git Integration: Integrate with Git for common operations such as add, commit, push, pull, fetch, stash, and discard local changes.
- Editor Launch: Ability to launch any of the known editors, IDE's, or development applications on the folder in order to work on it.
- Theme Selection: Dark/Light UI selection will be among its many application wide settings choices
- Settings Management: There will be application as well as project level settings that can be viewed edited and stored
- Web Documentation: Among the many many attributes stored and available to be modified about each project will be the ability to have the AI (if a key is available and selected) search the web for all of the main documentation for the tech used in the project and store those URL's with the project and make them available for perusing. Mush like what is offered by Context 7.
- Language Detection: Automatically determine the main language of the project and any other languages found in the project
- Project Size and Complexity Analysis: Automatically determine the size and complexity of the project
- Project Content Viewer: Display the contents of the project in various formats, such as a tree view or a file list.
- Project Notes: Allow the user to write notes about any project and store those notes in the project
- AI Tagging: Suggest project tags to the user based on project contents and attributes.

## Style Guidelines:

- Primary color: Dark blue (#2c3e50) to convey professionalism and stability.
- Secondary color: Light gray (#ecf0f1) for backgrounds and subtle contrast.
- Accent: Teal (#3498db) for interactive elements and highlights, providing a modern and clean feel.
- Consistent use of whitespace to avoid clutter and improve readability.
- Use minimalist icons to represent project types, file statuses, and Git operations.
- Subtle transitions and feedback animations for actions like scanning, committing, and pushing.