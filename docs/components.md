## 3. `SideNavBar` (`src/components/SideNavBar.tsx`)

**Purpose:**
Renders a vertical navigation bar, typically designed to be placed within a `CollapsibleSidebar` or a similar sidebar structure.

**Key Features:**
- **Navigation Items:** Displays a list of navigation items provided via the `navItems` prop.
    - Each `NavItem` object can have a `label` (string), an optional `onClick` handler, and an optional `active` (boolean) state to highlight it.
- **Footer:** Includes a `SidebarFooter` section that displays a `footerText` prop.
- **Extensibility:** Allows for `extraSections` (any `React.ReactNode`) to be rendered below the main navigation items but before the footer, providing flexibility for additional content like dropdowns or filters specific to a page.
- **Styling:** Items have hover effects and a distinct style for active items.

**Props:**
- `navItems`: `NavItem[]` (required) - An array of navigation item objects.
    - `NavItem` interface: `{ label: string; onClick?: () => void; active?: boolean; }`
- `footerText`: `string` (required) - Text to be displayed in the footer of the navbar.
- `extraSections?`: `React.ReactNode` (optional) - Additional React nodes to be rendered in the navigation section.

**Styling:**
- Uses `styled-components`.
- The main container (`Sidebar`) has a fixed width of 220px and is designed to fill the height of its parent.
- `NavItemDiv` styles individual navigation links, with different background for active or hovered states.

**Usage Context:**
This component is often nested inside the `CollapsibleSidebar` to provide the actual navigation links when the sidebar is expanded.

```jsx
const myNavItems = [
  { label: 'Dashboard', onClick: () => console.log('Dashboard'), active: true },
  { label: 'Profile', onClick: () => console.log('Profile') },
  { label: 'Settings', onClick: () => console.log('Settings') },
];

<SideNavBar
  navItems={myNavItems}
  footerText="App Version 1.0"
  extraSections={<p>Some extra info here</p>}
/>
```

## 4. `Modal` (`src/components/Modal.tsx`)

**Purpose:**
A general-purpose modal dialog component used to display content in a layer above the main page. It includes an overlay and a close button.

**Key Features:**
- **Visibility Control:** The modal's visibility is controlled by the `open` prop. If `false`, the modal is not rendered.
- **Overlay:** Displays a semi-transparent `Overlay` that covers the entire viewport behind the modal content, focusing user attention.
- **Closing Mechanism:**
    - An `onClose` callback function is required and is triggered when:
        - The user clicks on the `Overlay`.
        - The user clicks the `CloseButton` (styled as an '×').
- **Content Projection:** The content of the modal is passed as `children` to the component.
- **Styling:**
    - The `ModalBox` is styled to be large, taking up `96vw` width and `96vh` height, with rounded corners and a shadow.
    - The `CloseButton` is positioned at the top-right corner of the `ModalBox`.
    - Clicking inside the `ModalBox` does not close it (due to `e.stopPropagation()`).

**Props:**
- `open`: `boolean` (required) - Controls whether the modal is visible or not.
- `onClose`: `() => void` (required) - Function to call when the modal should be closed.
- `children`: `React.ReactNode` (required) - The content to be displayed within the modal.

**Styling:**
- Uses `styled-components`.
- The `Overlay` has a fixed position and a high `z-index` (1000).
- The `ModalBox` is centered within the `Overlay`.

**Usage:**
```jsx
const [isModalOpen, setIsModalOpen] = useState(false);

<Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>

<Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
  <h2>Modal Title</h2>
  <p>This is the content of the modal.</p>
  <Button onClick={() => setIsModalOpen(false)}>Close from inside</Button>
</Modal>
```

## 5. `Placard` (`src/components/Placard.tsx`)

**Purpose:**
A card-like component designed to present a concise overview of a service, feature, or item. It can optionally include a call-to-action button and has a special state for "Coming Soon" items.

**Key Features:**
- **Information Display:** Shows a `title` and an optional `description`.
- **Call to Action:** Can include an optional button, configured with `buttonText` and an `onButtonClick` handler. This button uses the `Button` component with an `outline` variant.
- **"Coming Soon" State:**
    - If the `comingSoon` prop is true, the placard displays the `title` as large, grayed-out text (e.g., "Coming Soon").
    - The styling is different (gray background/border), and hover effects are disabled, indicating it's not interactive.
- **Interactive State (Not Coming Soon):**
    - Displays the title, description (if provided), and button (if `buttonText` is provided).
    - Has hover effects: shadow, border color change (to a gold-like color), and a slight upward transform, making it feel interactive.
    - The cursor changes to `pointer`.
- **Styling:** Uses `styled-components`. The `Card` component changes its appearance and behavior based on the `comingSoon` prop.

**Props:**
- `title`: `string` (required) - The main title for the placard.
- `description?`: `string` (optional) - A short description displayed below the title.
- `buttonText?`: `string` (optional) - Text to display on the action button. If not provided, no button is rendered.
- `onButtonClick?`: `() => void` (optional) - Callback function for the action button. Typically used with `buttonText`.
- `comingSoon?`: `boolean` (optional) - If true, displays the placard in a "coming soon" state.

**Dependencies:**
- `Button` component (from `./Button`): Used to render the optional action button.

**Usage:**
```jsx
// Standard Placard
<Placard
  title="Awesome Service"
  description="Discover the amazing features of this service."
  buttonText="Launch Now"
  onButtonClick={() => console.log('Launch Awesome Service')}
/>

// Coming Soon Placard
<Placard
  title="Future Service"
  comingSoon
/>
```

## 6. `TopNavBar` (`src/components/TopNavBar.tsx`)

**Purpose:**
A simple navigation bar component designed to be displayed at the top of a page. It typically includes a logo/application title and a user profile indicator.

**Key Features:**
- **Logo/Title Display:**
    - Shows `logoText` (e.g., application name or page title) on the left side.
    - The logo area is a button and can trigger an `onLogoClick` callback if provided (e.g., to navigate home).
- **Profile Indicator:**
    - Displays a `ProfileCircle` on the right side.
    - The circle shows `profileInitials` (e.g., "PS").
    - The profile circle is clickable and can trigger an `onProfileClick` callback (e.g., to open a profile menu or login page).
- **Layout:** Uses Flexbox to position the logo on the left and the profile circle on the right.

**Props:**
- `logoText`: `string` (required) - The text to be displayed as the logo or title.
- `profileInitials`: `string` (required) - Initials to be displayed in the profile circle.
- `onLogoClick?`: `() => void` (optional) - Callback function for when the logo area is clicked.
- `onProfileClick?`: `() => void` (optional) - Callback function for when the profile circle is clicked.

**Styling:**
- Uses `styled-components`.
- The `TopHeader` has a distinct background color (`#ffeccc`) and a bottom border.
- `Logo` and `ProfileCircle` have specific styling for text and appearance.

**Usage:**
```jsx
<TopNavBar
  logoText="My Application"
  profileInitials="JD"
  onLogoClick={() => window.location.href = '/'}
  onProfileClick={() => alert('Profile clicked!')}
/>
```

## 7. `Button` (`src/components/Button/index.tsx`)

**Purpose:**
A versatile and styled button component that supports different visual variants and standard button functionalities.

**Key Features:**
- **Variants:** Offers three visual styles through the `variant` prop:
    - `primary` (default): Blue background, white text. Darkens on hover.
    - `secondary`: Gray background, white text. Darkens on hover.
    - `outline`: Transparent background, blue border and text. Light gray background on hover.
- **Full Width:** Can span the full width of its container if `fullWidth` prop is true.
- **Standard Attributes:** Accepts all standard HTML `<button>` attributes like `onClick`, `disabled`, `type`, `aria-label`, etc.
- **Disabled State:** Automatically applies reduced opacity and a `not-allowed` cursor when the `disabled` attribute is true.
- **Transitions:** Includes smooth transitions for hover effects.

**Props:**
- `variant?`: `'primary' | 'secondary' | 'outline'` (optional, default: `'primary'`) - The visual style of the button.
- `fullWidth?`: `boolean` (optional, default: `false`) - If true, the button takes up the full width of its parent.
- All other standard `React.ButtonHTMLAttributes<HTMLButtonElement>` are accepted (e.g., `children` for the button text, `onClick`, `disabled`, `type`).

**Styling:**
- Uses `styled-components`.
- `getVariantStyles` function provides the specific CSS for each variant.
- Common styles (padding, border-radius, cursor, font-size, transitions) are applied to `StyledButton`.

**Usage:**
```jsx
<Button onClick={() => console.log('Primary Clicked')}>Primary Button</Button>

<Button variant="secondary" disabled>
  Disabled Secondary
</Button>

<Button variant="outline" fullWidth onClick={() => console.log('Outline Clicked')}>
  Full Width Outline
</Button>
```

## 8. Chat Components (`src/components/Chat/`)

This section covers components specifically designed for chat interfaces.

### 8.1. `Message` (`src/components/Chat/Message.tsx`)

**Purpose:**
Renders a single message within a chat conversation, visually distinguishing between messages sent by the user and messages received (e.g., from an AI or another user).

**Key Features:**
- **Sender Differentiation:** The `isUser` boolean prop determines the styling and alignment:
    - If `true` (user's message): Aligned to the right, blue background (`#007bff`), white text.
    - If `false` (other party's message): Aligned to the left, light gray background (`#f0f0f0`), dark text.
- **Content Display:** Shows the `content` (string) of the message within a `MessageBubble`.
- **Timestamp:** Displays a `timestamp` (string) below the message bubble, aligned with the message.
- **Styling:** Uses `styled-components` for chat bubble appearance, alignment, and timestamp.

**Props:**
- `content`: `string` (required) - The textual content of the message.
- `isUser`: `boolean` (required) - True if the message is from the current user, false otherwise.
- `timestamp`: `string` (required) - A string representing the time the message was sent/received.

**Usage:**
Typically used within a list of messages in a chat window.
```jsx
<Message
  content="Hello there!"
  isUser={false}
  timestamp="10:30 AM"
/>
<Message
  content="Hi! How are you?"
  isUser={true}
  timestamp="10:31 AM"
/>
```

### 8.2. `ChatInput` (`src/components/Chat/ChatInput.tsx`)

**Purpose:**
Provides a user interface for composing and sending messages in a chat. It consists of a text input field and a "Send" button.

**Key Features:**
- **Message Composition:** A text input field (`StyledInput`) allows users to type their message.
- **Sending Mechanism:**
    - A "Send" button (using the `Button` component) triggers the sending process.
    - Pressing the Enter key (without Shift) also submits the message.
- **`onSend` Callback:** When a message is submitted (and is not empty), the `onSend(message: string)` prop function is called with the trimmed message text.
- **Input Clearing:** The input field is cleared after a message is sent.
- **Disabled State:**
    - The `disabled` prop can disable both the input field and the "Send" button.
    - The "Send" button is also automatically disabled if the input field is empty (or contains only whitespace).

**Props:**
- `onSend`: `(message: string) => void` (required) - Callback function invoked when the user submits a message.
- `disabled?`: `boolean` (optional, default: `false`) - If true, disables the input field and send button.

**Internal State:**
- `message`: `string` - Stores the current text in the input field.

**Dependencies:**
- `Button` component (from `../Button`).

**Usage:**
```jsx
const handleSendMessage = (msg) => {
  console.log("Sending message:", msg);
  // Add logic to send message to chat service
};

<ChatInput onSend={handleSendMessage} />

// Disabled state
<ChatInput onSend={handleSendMessage} disabled={true} />
```

### 8.3. `ChatHistory` (`src/components/Chat/ChatHistory.tsx`)

**Purpose:**
Displays a list of past chat conversations, typically in a sidebar panel. It allows users to select a conversation to view or to start a new chat.

**Key Features:**
- **New Chat Initiation:** A "Start New Chat" button at the top (using `Button` component with `outline` variant) calls the `onNewChat` prop function.
- **Conversation List:**
    - Renders a list of `conversations` provided via props.
    - Each `ConversationItem` displays:
        - `ConversationTitle`: The title of the conversation.
        - `ConversationPreview`: A snippet of the last message.
        - `Timestamp`: The timestamp of the last message.
    - Clicking a `ConversationItem` calls the `onSelect(id)` prop function with the conversation's ID.
- **Active Conversation Highlight:** The conversation whose ID matches the `activeId` prop is visually highlighted (different background color).
- **Layout:** Designed as a fixed-width (250px) panel that takes the full viewport height, with scrollable conversation list.

**Props:**
- `conversations`: `Array<{ id: string; title: string; lastMessage: string; timestamp: string; }>` (required) - An array of conversation objects to display.
- `onSelect`: `(id: string) => void` (required) - Callback function invoked when a conversation is selected from the list.
- `onNewChat`: `() => void` (required) - Callback function invoked when the "Start New Chat" button is clicked.
- `activeId?`: `string` (optional) - The ID of the currently active conversation, used for highlighting.

**Styling:**
- Uses `styled-components`.
- `HistoryContainer` defines the overall panel structure.
- `ConversationItem` has hover effects and a distinct style for the active item.

**Usage Context:**
This component is suitable for a dedicated chat history panel, often positioned as a sidebar in a chat application layout.

```jsx
const sampleConversations = [
  { id: '1', title: 'General Inquiry', lastMessage: 'Thanks for your help!', timestamp: 'Yesterday' },
  { id: '2', title: 'Support Ticket #123', lastMessage: 'Can you check on this?', timestamp: '2 hours ago' },
];

const [activeConv, setActiveConv] = useState('1');

<ChatHistory
  conversations={sampleConversations}
  onSelect={(id) => setActiveConv(id)}
  onNewChat={() => console.log('New Chat Started')}
  activeId={activeConv}
/>
```

### 8.4. `ChatHistoryDropdown` (`src/components/Chat/ChatHistoryDropdown.tsx`)

**Purpose:**
A compact, collapsible dropdown component for displaying a list of chat conversation summaries. It's suitable for embedding within sidebars or other UI sections where space is a consideration.

**Key Features:**
- **Collapsible List:** The list of conversations can be expanded or collapsed by clicking the header.
    - The header displays a `title` (defaults to "Chat History") and an arrow icon indicating the expanded/collapsed state.
- **Conversation Display:**
    - Renders a list of `conversations` (type `ConversationSummary`).
    - Each item in the list primarily displays the `conv.title`.
    - Clicking an item calls the `onSelect(id)` prop function.
- **Active Item Highlight:** The conversation whose ID matches `activeId` is visually highlighted.
- **Optional Deletion:**
    - If an `onDelete` prop function is provided, a delete button ('×') appears on hover for each conversation item.
    - Clicking the delete button calls `onDelete(id)`, ensuring to stop event propagation to prevent selection.
- **Empty State:** Displays "No history" if the `conversations` array is empty.

**Props:**
- `conversations`: `ConversationSummary[]` (required) - An array of conversation summary objects.
    - `ConversationSummary` interface: `{ id: string; title: string; lastMessage: string; timestamp: string; }` (Note: `lastMessage` and `timestamp` are not directly displayed by this component but are part of the expected structure).
- `activeId?`: `string` (optional) - The ID of the currently active conversation for highlighting.
- `onSelect`: `(id: string) => void` (required) - Callback when a conversation is selected.
- `onDelete?`: `(id: string) => void` (optional) - Callback when a conversation's delete button is clicked. If not provided, delete buttons are not shown.
- `title?`: `string` (optional, default: "Chat History") - The title for the dropdown header.

**Internal State:**
- `expanded`: `boolean` - Tracks whether the dropdown list is expanded or collapsed (initially `true`).

**Usage Context:**
This component is used in pages like `ResearchAssistant` and `CSRSummary` within their sidebars to offer a quick way to switch between or manage conversation histories related to that page's context.

```jsx
const convSummaries = [
  { id: 'c1', title: 'Chat about KG', lastMessage: '...', timestamp: '1h ago' },
  { id: 'c2', title: 'Follow-up on CSR', lastMessage: '...', timestamp: '2h ago' },
];

const [currentConv, setCurrentConv] = useState('c1');

<ChatHistoryDropdown
  conversations={convSummaries}
  activeId={currentConv}
  onSelect={(id) => setCurrentConv(id)}
  onDelete={(id) => console.log('Delete conversation:', id)}
  title="Recent Chats"
/>
```

## 9. Knowledge Graph Visualization (`src/components/KGViz/`)

This section details components related to visualizing knowledge graphs.

### 9.1. `GraphVisualization` (`src/components/KGViz/GraphVisualization.tsx`)

**Purpose:**
A sophisticated component responsible for rendering and managing an interactive knowledge graph visualization using D3.js. It displays nodes and relationships, allows for filtering, and can show information about selected graph elements.

**Key Features:**
- **Graph Rendering:**
    - Takes `data` (an object containing `nodes` and `relationships` arrays) as input.
    - Uses D3.js to create an SVG-based force-directed graph.
    - Renders nodes (circles) and links (lines with optional labels and arrowheads).
    - Node colors can be determined by `node.type` via `getNodeColors`.
- **Interactivity:**
    - **Zoom & Pan:** The graph view supports zooming and panning.
    - **Node Dragging:** Nodes can be dragged to reposition them (their position can be fixed or released).
    - **Selection:**
        - Clicking a node selects it and can display details using `NodeInfoPanel`.
        - Clicking a link (edge) selects it and can display details using `EdgeInfoPanel`.
- **Filtering (Left Sidebar):**
    - Displays a list of unique node types found in the data.
    - Allows users to filter the graph by checking/unchecking node types.
- **Network Evolution (Time-based Visualization):**
    - If relationship data includes `evolution` information (year-based weights), the graph can be filtered to show its state at a specific `evolutionYear`.
    - An `EvolutionControl` component (typically a slider) can be used to change the `currentEvolutionYear`.
    - Links can be styled or hidden based on their activity in the selected year.
- **Information Display:**
    - **Stats:** Shows the current count of visible nodes and relationships.
    - **Search Query:** Can display the `searchQuery` that generated the graph data.
- **Layout:** Uses a specific layout (`ModalLayout`) with:
    - `LeftSidebar`: Contains node type filters, statistics, and potentially the `EvolutionControl`.
    - `MainGraphArea`: Where the D3 graph is rendered.
- **Error Handling:** Displays an error message if `data` is invalid or missing.

**Props:**
- `data`: `GraphData` (required) - The graph data, an object `{ nodes: Node[], relationships: Relationship[] }`.
    - `Node`: `{ id: string; type: string; properties: Record<string, any>; ... }`
    - `Relationship`: `{ id: string; source: string; target: string; type: string; properties: Record<string, any>; evolution?: Record<string, number>; isActive?: boolean; ... }`
- `searchQuery?`: `string` (optional) - The search query that resulted in this graph, for display.
- `evolutionYear?`: `number | null` (optional) - The initial year for network evolution visualization.
- `hideControls?`: `boolean` (optional, default: `false`) - May be used to hide certain UI controls (e.g., evolution slider if not applicable).

**Internal State & Effects:**
- Manages selected node/edge, node type filters, and the current evolution year.
- Uses `useEffect` extensively to re-render the D3 graph when data, filters, or evolution year change.
- Employs `useMemo` and `useCallback` for performance optimizations.

**Dependencies:**
- `d3` library.
- `./NodeInfoPanel.tsx`, `./EdgeInfoPanel.tsx`.
- `../../features/NetworkEvolution/EvolutionControl.tsx`.
- `./d3GraphUtils.ts` (for D3 helper functions).
- `./styles/GraphVisualization.styles.ts` (for styled-components).
- `../../types/GraphVisualization.types.tsx` (for `GraphData` and related types).
- `../../constants/kgviz.constants.ts`.

**Usage Context:**
This is a central component for any page that needs to display and interact with knowledge graph data, such as the `KGExplorer` page or the `ResearchAssistant` (for graph responses).

```jsx
// Simplified example assuming graphData is fetched
<GraphVisualization
  data={graphData} 
  searchQuery=" ursprüngliche_Abfrage "
  evolutionYear={2023}
/>
```

### 9.2. `NodeInfoPanel` (`src/components/KGViz/NodeInfoPanel.tsx`)

**Purpose:**
Displays detailed information about a selected node from the knowledge graph. This panel typically appears as a floating overlay near the selected node.

**Key Features:**
- **Positioning:** Absolutely positioned on the screen using `x` and `y` coordinates (presumably the coordinates of the clicked node, with an offset).
- **Information Display:**
    - Shows the `node.name` as a prominent `Title`.
    - Displays the `node.type`.
    - Iterates over `node.properties` (if any) and displays each key-value pair.
- **Styling:**
    - Dark-themed panel (`background: rgba(17, 24, 39, 0.9)` with white and light gray text) for contrast against a potentially light graph background.
    - Has a border, border-radius, and shadow.
    - High `z-index` (1000) to appear above other graph elements.

**Props:**
- `node`: `Node` (required) - The node object whose information is to be displayed. The `Node` type likely includes `id`, `name`, `type`, and `properties` fields.
- `x`: `number` (required) - The x-coordinate for positioning the panel.
- `y`: `number` (required) - The y-coordinate for positioning the panel.

**Usage Context:**
Instantiated and shown by `GraphVisualization` when a user clicks on a node in the graph.

```jsx
// This component is typically used internally by GraphVisualization
// Example of how it might be invoked (conceptual):

// if (selectedNodeData) {
//   <NodeInfoPanel node={selectedNodeData.node} x={selectedNodeData.x} y={selectedNodeData.y} />
// }
```

### 9.3. `EdgeInfoPanel` (`src/components/KGViz/EdgeInfoPanel.tsx`)

**Purpose:**
Displays detailed information about a selected edge (relationship) from the knowledge graph. This panel appears as a floating overlay, typically near the midpoint or click location of the selected edge.

**Key Features:**
- **Positioning:** Absolutely positioned using `x` and `y` coordinates.
- **Information Display:**
    - A generic `Title`: "Relationship".
    - `Type`: The type of the relationship (from `edge.relation`).
    - `From`: The name of the source node (`edge.source.name`).
    - `To`: The name of the target node (`edge.target.name`).
    - `Weight`: The weight of the edge (`edge.weight`).
    - `Evolution`: If `edge.evolution` data exists (an object mapping years to values/weights), it lists these year-value pairs.
    - `Properties`: Iterates over `edge.properties` (if any) and displays each key-value pair.
    - `Status`: If `edge.isActive` is defined, it shows whether the edge is currently "Active" or "Inactive" (relevant for evolution view).
- **Styling:** Consistent dark theme with `NodeInfoPanel` (dark background, light text, shadow, high `z-index`).

**Props:**
- `edge`: `D3Link` (required) - The edge object whose information is to be displayed. 
    - `D3Link` is a type defined in this file, extending the base `Relationship` type. It includes resolved `source` and `target` objects (which have a `name` property at least), D3 simulation properties, `relation` (for relationship type), `weight`, optional `evolution` data, optional `properties`, and an optional `isActive` flag.
- `x`: `number` (required) - The x-coordinate for positioning the panel.
- `y`: `number` (required) - The y-coordinate for positioning the panel.

**Usage Context:**
Instantiated and shown by `GraphVisualization` when a user clicks on a link (edge) in the graph.

```jsx
// This component is typically used internally by GraphVisualization
// Example of how it might be invoked (conceptual):

// if (selectedEdgeData) {
//   <EdgeInfoPanel edge={selectedEdgeData.edge} x={selectedEdgeData.x} y={selectedEdgeData.y} />
// }
```

### 9.4. `d3GraphUtils.ts` (`src/components/KGViz/d3GraphUtils.ts`)

**Purpose:**
This utility file contains a collection of helper functions used by `GraphVisualization.tsx` to manage and render the graph using D3.js. It encapsulates much of the direct D3 manipulation logic.

**Key Functions (Conceptual Overview - based on imports in `GraphVisualization.tsx`):**
- `setupSVG(svgRef, container)`: Initializes the main SVG element for the graph, sets up zoom behavior, and defines dimensions.
- `setupMarkers(svg)`: Defines SVG markers, such as arrowheads for directed links.
- `createD3Nodes(nodes, width, height)`: Converts the application's node data structure into a D3-compatible format, potentially adding initial positions.
- `createD3Links(relationships, nodeMap)`: Converts relationship data into D3-compatible links, using a map of D3 nodes to connect sources and targets.
- `renderLinks(g, d3Links, handleLinkClick)`: Appends SVG elements (lines, paths, text) to the D3 group element (`g`) to draw the links and their labels. Attaches click handlers.
- `renderNodes(g, d3Nodes, nodeColors, handleNodeClick, ...dragHandlers)`: Appends SVG elements (circles, text) to draw the nodes. Applies colors, attaches click and drag event handlers.
- `initializeSimulation(d3Nodes, d3Links, width, height, onTickCallback)`: Creates and configures the D3 force simulation (e.g., forces like charge, link, center). Starts the simulation and provides a callback (`onTickCallback`) that updates node and link positions on each simulation tick.

**Note:** This is not a React component but a crucial part of the D3 rendering pipeline for `GraphVisualization`.

### 9.5. KGViz Styles (`src/components/KGViz/styles/`)

This directory likely contains styled-component definitions specific to the `GraphVisualization` component and its sub-parts (like the layout, sidebar sections, filter controls, etc.). For example, `GraphVisualization.styles.ts` is imported by `GraphVisualization.tsx` and provides components like `GraphContainer`, `ModalLayout`, `LeftSidebar`, `MainGraphArea`, `SidebarSection`, etc.

## 10. `Layout` (`src/components/Layout/index.tsx`)

**Purpose:**
Provides a primary application shell layout, typically featuring collapsible left and right navigation panels and a central main content area for rendering page content via React Router's `Outlet`.

**Key Features:**
- **Three-Column Structure:**
    - `LeftNav`: A collapsible navigation panel on the left.
        - Contains a toggle button (☰ icon).
        - When open, displays a hardcoded "PhoenixLS" logo and nav items ("Dashboard", "Services", "Analytics").
    - `MainContent`: The central area that takes up the remaining space.
        - Renders `<Outlet />` from `react-router-dom`, which is where child route components will be displayed.
    - `RightNav`: A collapsible navigation panel on the right.
        - Contains a toggle button (☰ icon).
        - When open, displays a hardcoded user profile section and nav items ("Settings", "Preferences", "Help", "Logout").
- **Collapsibility:** Both `LeftNav` and `RightNav` can be independently toggled open/closed.
    - Width changes with a transition effect.
    - Content within the nav panels is only rendered when they are open.
- **Styling:** Dark theme for the navigation panels (`#1a1a1a` background) and a light theme for the main content area.

**Props:**
- This component does not explicitly define any props in its interface but relies on `React.FC`.

**Internal State:**
- `leftNavOpen`: `boolean` - Controls the open/closed state of the `LeftNav`.
- `rightNavOpen`: `boolean` - Controls the open/closed state of the `RightNav`.

**Dependencies:**
- `Outlet` from `react-router-dom` for rendering nested routes.

**Usage Context:**
This `Layout` component is likely used as a top-level route component in the application's routing setup (e.g., in `App.tsx` or `router.tsx`) to provide a consistent layout structure for multiple pages.

```jsx
// In your router configuration:
// <Route path="/app" element={<Layout />}>
//   <Route path="dashboard" element={<DashboardPage />} />
//   <Route path="services" element={<ServicesPage />} />
//   {/* ... other nested routes ... */}
// </Route>
```
