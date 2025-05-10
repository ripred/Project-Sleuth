<p align="center">
  <img src="Project-Sleuth-App-Icon.png" alt="Project Sleuth App Icon" width="150"/>
</p>
<p align="center"><b>Project Sleuth: Your Intelligent Assistant for Project Discovery, Analysis, and Management.</b></p>
Project Sleuth is a powerful Next.js application designed to help developers and teams efficiently manage and understand their software projects. It scans your local environment to discover projects, analyzes them using AI, integrates with Git, and provides a suite of tools to streamline your development workflow.

## Overview

In today's fast-paced development world, keeping track of numerous projects, their technologies, status, and documentation can be overwhelming. Project Sleuth aims to alleviate this by:

-   **Automated Discovery**: Recursively finding project folders on your hard drives based on configurable criteria (e.g., `.git` folders, AI residue files like `.claude*`, specific source file extensions).
-   **Centralized Database**: Maintaining an up-to-date database of all discovered projects and their attributes.
-   **AI-Powered Insights**: Leveraging remote AI services (configurable via API keys) to generate summaries, identify technologies, detect languages, assess completeness, and suggest relevant tags.
-   **Seamless Git Integration**: Performing common Git operations directly within the application.
-   **Quick Access & Organization**: Launching projects in your preferred IDE, managing project-specific notes, and easily finding documentation.

## Core Features

Project Sleuth comes packed with features to enhance your project management experience:

-   **Project Discovery**: Scans local drives for projects based on `.git` presence, AI artifact files, and common source code extensions (`.cpp`, `.java`, `.py`, `.js`, etc.).
-   **Database Management**: Stores and updates information about discovered projects with each scan.
-   **Remote AI Configuration**: Allows users to set up and store API keys for various AI services (e.g., Google AI with Genkit).
-   **AI Project Summary**: Analyzes project files to provide summaries covering:
    -   Project purpose
    -   Completeness status
    -   Technologies used
    -   Programming languages involved
-   **Git Integration**: Supports common Git operations like add, commit, push, pull, fetch, stash, and discard local changes.
-   **Editor Launch**: Quickly open projects in your configured IDEs or development applications.
-   **Theme Selection**: Choose between Dark and Light UI themes for comfortable viewing.
-   **Settings Management**: Configure application-wide and project-level settings.
-   **Web Documentation Finder**: AI-assisted search for official documentation URLs related to the technologies used in a project.
-   **Language Detection**: Automatically identifies the primary and other programming languages within a project.
-   **Project Size & Complexity Analysis**: Provides an estimate of the project's size and complexity.
-   **Project Content Viewer**: (Conceptual for web demo) Displays project file structure.
-   **Project Notes**: Attach and store notes for any project.
-   **AI Tagging**: Suggests relevant tags for projects based on their content and attributes.

## Tech Stack

-   **Frontend**: Next.js (App Router), React, TypeScript
-   **Styling**: Tailwind CSS, Shadcn/UI
-   **AI Integration**: Genkit (with Google AI and potentially others)
-   **State Management**: React Context, `useState`, `useEffect`
-   **Icons**: Lucide React

## Installation and Setup

Follow these steps to get Project Sleuth running on your local machine:

1.  **Prerequisites**:
    *   Node.js (v18 or later recommended)
    *   npm or yarn

2.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd project-sleuth
    ```

3.  **Install Dependencies**:
    Using npm:
    ```bash
    npm install
    ```
    Or using yarn:
    ```bash
    yarn install
    ```

4.  **Environment Variables**:
    Create a `.env` file in the root of the project by copying the `.env.example` file (if one is provided, otherwise create an empty one).
    ```bash
    cp .env.example .env # If .env.example exists
    # or
    touch .env
    ```
    You will need to add API keys for any AI services you wish to use. For example, to use Google AI services via Genkit, you'd typically set:
    ```env
    GOOGLE_API_KEY=your_google_ai_api_key_here
    ```
    Refer to the Genkit and Google AI documentation for obtaining API keys.

5.  **Run the Development Server**:
    This command starts the Next.js application.
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will typically be available at `http://localhost:9002` (or another port if 9002 is in use).

6.  **Run the Genkit Development Server** (in a separate terminal):
    Genkit flows (AI functionalities) are often run with their own development server for inspection and debugging.
    ```bash
    npm run genkit:dev
    # or
    yarn genkit:dev
    ```
    Alternatively, to watch for changes in AI flow files:
    ```bash
    npm run genkit:watch
    # or
    yarn genkit:watch
    ```
    The Genkit development UI will typically be available at `http://localhost:4000`.

## Usage

Once the application and Genkit server are running, you can start using Project Sleuth:

1.  **Dashboard**: The main landing page provides an overview, quick actions, and a summary of features.
2.  **Settings Page**:
    *   Navigate to **Settings** from the sidebar.
    *   **API Key Configuration**: Enter your API keys for services like Google AI. This is crucial for AI-powered features.
    *   **Default Scan Paths**: (Simulated for web demo) Specify directories where Project Sleuth should look for projects.
    *   **Project Editors**: Configure your preferred code editors/IDEs (e.g., VS Code, IntelliJ) and set a default. This allows for the "Open in Editor" functionality.
3.  **Projects Page**:
    *   Navigate to **Projects** from the sidebar.
    *   **Scan for Projects**: Click the "Scan for Projects" button. (In the web demo, this is simulated and may add mock projects). In a desktop version, this would trigger a local file system scan.
    *   **View Project List**: Discovered projects are listed in a table. You can filter and search through them.
    *   **Project Actions**: For each project, you can:
        *   View Details
        *   (Simulated) Analyze with AI, Suggest Tags, Fetch Docs, Open in Editor, Delete.
4.  **Project Detail Page**:
    *   Clicking "View Details" for a project takes you to its dedicated page.
    *   **Overview Tab**: Shows project metadata, AI-generated summary (if run), suggested AI tags, and allows managing a due date.
        *   **AI Actions**: Buttons to generate AI summary, suggest tags, and fetch web documentation.
    *   **Files Tab**: (Conceptual for web demo) Would display the project's file structure.
    *   **Git Tab**: (Simulated for web demo) Shows basic Git information (branch, last commit) and provides buttons for common Git operations.
    *   **Notes Tab**: A space to write and save project-specific notes.
    *   **Docs Tab**: Displays AI-fetched documentation URLs relevant to the project's technologies.
    *   **Open in Editor**: Button at the top to (conceptually) launch the project in your configured default editor. The configured editor is displayed below this button.

## UI Style

Project Sleuth follows a modern and professional design aesthetic:
-   **Primary Color**: Dark blue (`#2c3e50`)
-   **Secondary Color**: Light gray (`#ecf0f1`)
-   **Accent Color**: Teal (`#3498db`)
-   Minimalist icons and ample whitespace are used for clarity and readability.

## Contributing

(Details on how to contribute to the project can be added here in the future.)

## License

(Specify a license, e.g., MIT License, if applicable.)
