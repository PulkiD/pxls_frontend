# Pages

This document outlines the different pages available in the PhoenixLS application.

## 1. Landing Page (`src/pages/LandingPage/index.tsx`)

**Purpose:**
The main entry point of the application after a user logs in (conceptually, as login is not yet implemented). It displays a welcome message and provides access to the various services offered by the PhoenixLS platform.

**Key Features:**
- Displays a welcome title: "Welcome to PhoenixLS" and subtitle: "Advanced Drug Discovery & Development Platform".
- Shows a grid of available services using `Placard` components. Each placard typically has a title, description, and a "Launch Service" button.
- Clicking a "Launch Service" button opens the respective service in a new tab.
- Includes a "Coming Soon" placard for services not yet available.

**Components Used:**
- `TopNavBar`: For the top navigation bar, showing the application logo ("PhoenixLS") and user profile initials.
- `CollapsibleSidebar` & `SideNavBar`: For the left-hand navigation, which includes items like 'Home', 'Analytics', 'Documents', and 'Settings'.
- `Placard`: To display individual services in a grid format.

**User Flow:**
1. User navigates to the root URL (or is redirected after login).
2. The Landing Page is displayed.
3. User can see an overview of available services.
4. User can click on a service's "Launch Service" button to open that service.
5. User can interact with the top navigation bar (logo click navigates to `/`, profile click is a placeholder).
6. User can toggle the collapsible sidebar.

**Data Sources:**
- Service details (title, description, path) are imported from `../../router` (presumably `services` array).

## 2. Research Assistant (`src/pages/ResearchAssistant/index.tsx`)

**Purpose:**
Provides an AI-powered chat interface for research assistance. Users can interact with the assistant by sending messages and receiving responses, potentially including graph visualizations.

**Key Features:**
- **Chat Interface:** Allows users to send messages and view a conversation log.
- **Conversation Management:**
    - Displays a list of past conversation summaries in a dropdown (`ChatHistoryDropdown`).
    - Allows users to select and load a previous conversation.
    - Supports starting a new chat.
    - Enables deletion of conversations.
- **Graph Visualization:**
    - Can display graph data related to the conversation.
    - A mini-graph is shown in a right collapsible panel.
    - The graph can be expanded into a modal view (`GraphVisualization` component).
- **Responsive Layout:** Utilizes collapsible sidebars for navigation and additional content (like the mini-graph).

**Components Used:**
- `TopNavBar`: Displays "Research Assistant" as the logo text.
- `CollapsibleSidebar` & `SideNavBar`: For left-hand navigation (items: 'Documents', 'Settings').
- `CollapsibleSidebar` (right): Contains a `ChatHistoryDropdown` to select conversations and a `MiniGraphContainer` for a small graph preview.
- `Chat/Message`: Renders individual messages in the chat window.
- `Chat/ChatInput`: Provides the text input field for sending messages.
- `KGViz/GraphVisualization`: Renders the graph data, both in the mini-preview and the expanded modal.
- `Modal`: Used to display the expanded graph visualization.

**User Flow:**
1. User navigates to the Research Assistant page.
2. If no active conversation, a welcome message is shown.
3. User can type a message in `ChatInput` and send it.
4. The message appears in the `MessagesList`, followed by the assistant's response.
5. If the response includes graph data, it's displayed in the `MiniGraphContainer` and can be expanded.
6. User can start a new chat using a button (presumably in the right sidebar).
7. User can select a past conversation from the `ChatHistoryDropdown`.
8. User can delete a conversation from the dropdown.
9. User can toggle the left and right collapsible sidebars.

**Data & State Management:**
- Uses custom hooks for chat operations:
    - `useConversationSummaries`: Fetches summaries of all conversations.
    - `useConversationDetails`: Fetches messages for a selected conversation.
    - `useSendMessage`: Handles sending a new message and receiving a response.
    - `useDeleteConversation`: Handles deleting a conversation.
- Local state is used for managing UI elements like sidebar collapse state, active conversation ID, graph modal visibility, and current graph data.
- Messages are automatically scrolled into view.

**Interactions:**
- `handleSendMessage`: Called when a user sends a message.
- `handleNewChat`: Clears the active conversation to start a new one.
- `handleSelectConversation`: Loads a selected conversation.
- `handleDeleteConversation`: Deletes a selected conversation.
- `setShowGraphModal`: Toggles the visibility of the full-screen graph modal.

## 3. Drug Repurposing (`src/pages/DrugRepurposing/index.tsx`)

**Purpose:**
This page is intended for the Drug Repurposing service.

**Current Status:**
- Currently, it displays a "Coming Soon" message.
- Indicates that the "Drug Repurposing service is under development."

**Components Used:**
- None, it's a simple static display.

**User Flow:**
- User navigates to this page and sees the "Coming Soon" message.

## 4. Playground (`src/pages/Playground/index.tsx`)

**Purpose:**
Provides a drag-and-drop interface for users to construct custom workflows by arranging different predefined modules.

**Key Features:**
- **Module Library:** A panel on the left (`ModuleLibrary`) lists available modules such as 'Target Identification', 'Hit Optimization', 'Lead Discovery', and 'ADMET Prediction'.
- **Workspace:** A central area (`Workspace`) where users can drag modules from the library.
- **Drag and Drop:**
    - Modules can be dragged from the library and dropped onto the workspace.
    - Modules already on the workspace can be dragged to reposition them.
- **Workflow Construction:** The arrangement of modules on the workspace visually represents a custom workflow.

**Components Used:**
- This page uses its own layout and does not seem to incorporate the common `TopNavBar` or `CollapsibleSidebar` / `SideNavBar` used in other pages.
- `Module`: Represents a draggable item in the library.
- `WorkspaceModule`: Represents a module that has been dropped onto the workspace. It's positioned absolutely based on user interaction.

**User Flow:**
1. User navigates to the Playground page.
2. The page displays a library of modules on the left and an empty workspace on the right.
3. User can drag a module from the `ModuleLibrary`.
4. User can drop the module onto the `Workspace`.
5. The dropped module appears on the workspace at the drop location.
6. User can then drag existing modules within the `Workspace` to rearrange them.

**Data & State Management:**
- `modules`: A predefined array of available modules (id, name).
- `workspaceModules`: A state variable (`useState`) holding an array of modules that have been dropped onto the workspace, including their `id`, `name`, and `x`, `y` coordinates.
- `dragModule`: A ref (`useRef`) to store the module being dragged from the library.
- `dragOffset`: A ref to store the offset when dragging a module within the workspace.
- `draggingId`: A state variable to track the ID of the module currently being dragged within the workspace.

**Interactions:**
- `handleDragStart`: Initiated when dragging a module from the library.
- `handleDrop`: Handles dropping a module onto the workspace.
- `handleDragOver`: Prevents default behavior to allow dropping.
- `handleModuleMouseDown`: Initiated when the mouse button is pressed on a module in the workspace, to start repositioning.
- `handleMouseMove`: Updates the position of the module being dragged within the workspace.
- `handleMouseUp`: Finalizes the position of the module being dragged within the workspace.

## 5. CSR Summary (`src/pages/CSRSummary/index.tsx`)

**Purpose:**
Facilitates the generation of summaries from Clinical Study Reports (CSRs) through a guided, multi-step process. It involves uploading a document, mapping its tables to relevant sections, and then viewing the generated summaries.

**Key Features:**
- **Multi-Step Process:** A visual stepper indicates the current stage:
    1.  **Upload Document:** (Step 1)
    2.  **Map Tables to FDA Sections:** (Step 2)
    3.  **View Section Summaries:** (Step 3)
- **File Upload (Step 1):**
    - An `UploadBox` allows users to select a file.
    - Displays the name of the uploaded file.
    - An "Execute" button proceeds to the next step (presumably after backend processing of the file).
- **Table Mapping (Step 2):**
    - A `TableMappingContainer` displays a list of tables detected in the document (currently uses `mockTableMappings`).
    - Each row shows a user table and a mapped FDA section.
    - Users can select table mappings using checkboxes.
    - Buttons for "Re-execute" (presumably to re-process table extraction/mapping) and "Confirm & Proceed" to the next step.
- **View Summaries (Step 3):**
    - Displays a list of generated section summaries (currently uses `mockSectionSummaries`) in a `SummarySection`.
    - Users can select a specific summary to view its content in a `SummaryDetail` area.
    - Provides options to "Download Summary" and "Re-execute Summary Generation".
- **Navigation & Layout:**
    - `TopNavBar` with "CSR Summary" as logo text.
    - Left `CollapsibleSidebar` with `SideNavBar` (items: 'Start New Flow', 'Documents', 'Settings').
    - A `RightSidebar` which seems to include a `ChatHistoryDropdown` (perhaps for managing different CSR summary sessions) and other controls like dropdowns for 'Report Type' and 'Phase'.

**Components Used:**
- `TopNavBar`, `CollapsibleSidebar`, `SideNavBar`
- `ChatHistoryDropdown` (in the right sidebar)
- Custom styled components for steps (`StepCircle`, `StepArrow`), upload area (`UploadBox`), table mapping (`MappingTable`, `MappingRow`, etc.), summary display (`SummarySection`, `SummaryItem`, `SummaryDetail`).

**User Flow (Conceptual based on UI elements):**
1.  User navigates to the CSR Summary page. Step 1 (Upload) is active.
2.  User clicks the `UploadBox`, selects a file.
3.  File name appears. User clicks "Execute".
4.  Application processes the file. Step 2 (Map Tables) becomes active.
5.  A list of tables and their proposed FDA section mappings are shown.
6.  User reviews and selects/deselects mappings.
7.  User clicks "Confirm & Proceed".
8.  Application generates summaries. Step 3 (View Summaries) becomes active.
9.  A list of section summaries is displayed.
10. User clicks on a summary to view its detailed content.
11. User can download the summary or re-execute its generation.
12. User can navigate between completed steps using the `StepCircle` components.
13. The right sidebar might offer options to select report types, phases, or manage different summarization flows/histories.

**Data & State Management (Inferred):**
- `currentStep`: Tracks the active step in the process (1, 2, or 3).
- `uploadedFile`: Stores information about the uploaded file.
- `tableMappings`: Stores the list of table mappings, likely with selection status.
- `selectedMappingIds`: Tracks which table mappings are selected by the user.
- `sectionSummaries`: Stores the generated summaries.
- `selectedSummaryId`: Tracks which summary is currently being viewed.
- Mock data (`mockTableMappings`, `mockSectionSummaries`) is used in the current implementation for display purposes.
- Handler functions for file upload, mapping selection, proceeding to next steps, re-executing processes, and selecting summaries for viewing.

**Interactions (Examples):**
- `handleFileUpload`: When a file is selected.
- `handleExecuteUpload`: To process the uploaded file and move to table mapping.
- `handleMappingSelect`: When a user selects/deselects a table mapping.
- `handleConfirmMappings`: To finalize mappings and move to summary view.
- `handleSectionSummarySelect`: To display the content of a selected summary.
- `handleReexecute`, `handleReexecuteSummary`: To trigger re-processing steps.

## 6. KG Explorer (`src/pages/KGExplorer/index.tsx`)

**Purpose:**
Allows users to explore a knowledge graph by executing queries and visualizing the results as a graph.

**Key Features:**
- **Query Execution:**
    - A dedicated `QueryInput` component at the top of the content area allows users to type and submit queries.
    - A "Search" button triggers the query execution.
- **Graph Visualization:**
    - The main part of the page (`MainGraphArea`) displays the knowledge graph using the `GraphVisualization` component.
    - The graph is shown after a query is successfully executed.
    - If no query has been run or there's no data, a welcome message or empty state is shown.
- **Query Management (in Left Sidebar):**
    - **Save Query:** A "Save Query" button (icon) allows users to save the currently executed query and its results.
    - **Saved Queries List:** The left sidebar displays a list of previously saved queries.
        - These are presented in a collapsible dropdown section.
        - Clicking on a saved query loads it into the input, executes it, and displays the corresponding graph.
    - **Delete Query:** Users can delete saved queries from the list.
- **Layout:**
    - `TopNavBar` with "Knowledge Graph Explorer" as the logo text.
    - `CollapsibleSidebar` (left) containing navigation items and the saved queries section.
        - Nav items include: "Search New Query", "Documents", "Settings".

**Components Used:**
- `TopNavBar`, `CollapsibleSidebar`, `SideNavBar`
- `GraphVisualization`: For rendering the knowledge graph.
- `QueryInput`: A custom input component for entering search queries.
- Various styled components for layout, saved query items, etc.

**User Flow:**
1.  User navigates to the KG Explorer page.
2.  A welcome message is displayed if no query is active.
3.  User types a query into the `QueryInput` field and clicks "Search".
4.  The application fetches data from the knowledge graph based on the query.
5.  The results are displayed as an interactive graph in the `MainGraphArea`.
6.  User can interact with the graph (zoom, pan, select nodes/edges - assuming `GraphVisualization` supports this).
7.  User can click the "Save Query" button to save the current query and its view.
8.  Saved queries appear in the left sidebar.
9.  User can click on a saved query in the sidebar to reload and view it.
10. User can delete a saved query from the sidebar.
11. Clicking "Search New Query" in the sidebar clears the current query and graph, allowing a fresh search.

**Data & State Management:**
- `useKnowledgeGraph` custom hook: Manages all interactions with the knowledge graph backend.
    - Takes the `executedQuery` string as input.
    - Returns `graphData`, `isLoading`, `error` for the current query.
    - Returns `savedQueries`, `loadingSavedQueries` for the list of saved queries.
    - Provides functions: `saveQuery(query, name, graphData)` and `deleteQuery(queryId)`.
- Local state variables:
    - `inputQuery`: The text currently in the query input field.
    - `executedQuery`: The query that was last submitted for execution.
    - `showGraph`: Boolean to control the visibility of the graph (likely true when `graphData` is available).
    - `leftSidebarCollapsed`: Manages the collapse state of the left sidebar.
    - `savedDropdownOpen`: Manages the open/closed state of the saved queries dropdown in the sidebar.

**Interactions:**
- `handleQueryExecute`: Called when the "Search" button is clicked. Sets `executedQuery` to `inputQuery`.
- `handleInputChange`: Updates `inputQuery` as the user types.
- `handleSaveQuery`: Prompts the user for a name and then calls `saveQuery` from the hook.
- `handleSavedQueryClick`: Sets `inputQuery` and `executedQuery` to the selected saved query, and shows the graph.
- `handleDeleteQuery`: Calls `deleteQuery` from the hook for a specific saved query.

## 7. Error Handling UI (`src/pages/ErrorUI/ErrorHandlers.tsx`)

**Purpose:**
Provides a standardized user interface for displaying errors that occur within the application and an `ErrorBoundary` component to catch these errors.

**Key Components & Features:**

### `ErrorHandlers` Component
-   **Display:** Shows a prominent "Something went wrong" title, the error message, and optionally the error stack trace and additional `info` (e.g., component stack from React).
-   **Error Reporting:**
    -   Includes a "Report this error" button.
    -   Uses the `useErrorReport` custom hook to send error details (message, stack, info, timestamp, severity) to a backend or logging service.
    -   Provides feedback to the user during and after reporting (e.g., "Reporting...", "Reported", or an error if reporting fails).
-   **Navigation:**
    -   "Go Back" button: Navigates to the previous page in browser history.
    -   "Go Home" button: Navigates to the application's root page (`/`).

### `ErrorBoundary` Component
-   **Type:** A React class component designed to be used as an error boundary.
-   **Functionality:**
    -   Wraps around other components (its `children`).
    -   Catches JavaScript errors that occur anywhere in its child component tree during rendering, in lifecycle methods, and in constructors of the whole tree below them.
    -   Uses `static getDerivedStateFromError()` to update state when an error occurs, triggering a re-render to show a fallback UI.
    -   Uses `componentDidCatch()` to log error information (e.g., component stack).
    -   When an error is caught, it renders the `ErrorHandlers` component, passing the `error` and `info` to it.

**Usage Context:**
-   The `ErrorHandlers.tsx` file is located in `src/pages/ErrorUI/`, but it's not a standalone navigable page. Instead, the `ErrorBoundary` component would typically be used to wrap major sections of the application, or even the entire application (e.g., in `App.tsx` or around routes in `router.tsx`), to provide a graceful fallback UI in case of unhandled runtime errors.

**User Flow (when an error occurs within an `ErrorBoundary`):**
1.  A JavaScript error occurs in a component wrapped by `ErrorBoundary`.
2.  `ErrorBoundary` catches the error.
3.  Instead of a broken UI or white screen, the user sees the UI rendered by the `ErrorHandlers` component.
4.  The user sees the error message and details.
5.  The user can choose to report the error.
6.  The user can navigate away using "Go Back" or "Go Home".

**Dependencies:**
-   `useErrorReport` hook: For sending error reports.
-   `Button` component: For the action buttons. 