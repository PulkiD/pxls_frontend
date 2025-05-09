# Custom Hooks (`src/hooks/`)

This document describes the custom React hooks used throughout the PhoenixLS application, primarily for data fetching, state management, and encapsulating reusable logic.

## 1. Chat Hooks (`src/hooks/useChat.ts`)

These hooks manage interactions with the chat service, leveraging `@tanstack/react-query` for asynchronous operations like fetching conversation data and sending messages.

**Dependencies:**
- `@tanstack/react-query`
- `../services/chatService.ts` (assumed to provide the actual API call functions: `getConversationSummaries`, `getConversationDetails`, `sendMessage`, `deleteConversation`).

### 1.1. `useConversationSummaries()`

- **Purpose:** Fetches a list of all conversation summaries.
- **Type:** Query (`useQuery`).
- **Query Key:** `['chat', 'summaries']`.
- **Data Fetcher:** `chatService.getConversationSummaries`.
- **Options:**
    - `staleTime`: 1 minute (60,000 ms) - Data is considered fresh for 1 minute.
    - `retry`: 1 - Retries the query once on failure.
- **Returns:** Standard `useQuery` result object for conversation summaries (e.g., `data`, `isLoading`, `error`).

### 1.2. `useConversationDetails(conversationId?: string)`

- **Purpose:** Fetches the detailed messages and information for a specific conversation.
- **Type:** Query (`useQuery`).
- **Arguments:**
    - `conversationId?: string`: The ID of the conversation to fetch. The query is only enabled if this ID is provided.
- **Query Key:** `['chat', 'conversation', conversationId]`.
- **Data Fetcher:** Calls `chatService.getConversationDetails(conversationId)`.
- **Options:**
    - `enabled: !!conversationId` - Query runs only when `conversationId` is a truthy value.
    - `retry`: 1.
- **Returns:** Standard `useQuery` result object for the specific conversation's details.

### 1.3. `useSendMessage()`

- **Purpose:** Provides a mutation function to send a new message.
- **Type:** Mutation (`useMutation`).
- **Mutation Function:** `chatService.sendMessage`.
    - Expected to take an object like `{ conversationId?: string, message: string }`.
    - Expected to return data including the `conversationId` of the affected conversation (new or existing).
- **On Success:**
    - Invalidates the `['chat', 'summaries']` query to refresh the list of conversations.
    - If `data.conversationId` is returned, invalidates the `['chat', 'conversation', data.conversationId]` query to refresh the specific conversation.
- **Returns:** Standard `useMutation` result object (e.g., `mutate`, `isLoading`, `error`, `data`).

### 1.4. `useDeleteConversation()`

- **Purpose:** Provides a mutation function to delete a conversation.
- **Type:** Mutation (`useMutation`).
- **Mutation Function:** `chatService.deleteConversation`.
    - Expected to take the `conversationId` to delete.
    - Expected to return data including the `conversationId` of the deleted conversation.
- **On Success:**
    - Invalidates the `['chat', 'summaries']` query.
    - Invalidates the `['chat', 'conversation', data.conversationId]` query for the deleted conversation.
- **Returns:** Standard `useMutation` result object.

## 2. Knowledge Graph Hooks (`src/hooks/useKnowledgeGraph.ts`)

These hooks manage interactions with the knowledge graph service, utilizing `@tanstack/react-query` for data fetching, caching, and mutations related to graph data and saved queries.

**Dependencies:**
- `@tanstack/react-query`
- `../services/kgService.ts` (providing functions like `fetchKnowledgeGraph`, `getSavedQueries`, `saveQuery`, `deleteQuery`, `updateQuery`).
- `../types/kgApi.types.ts` (for `SaveQueryRequest`, `SavedQuery`).

### 2.1. Main Hook: `useKnowledgeGraph(query: string | null)`

- **Purpose:** A comprehensive hook to fetch knowledge graph data based on a query string, manage saved queries (fetch, save, delete, update), and expose loading/error states for these operations.
- **Arguments:**
    - `query: string | null`: The search query string to fetch the knowledge graph for. If `null` or empty, the graph data query will not be enabled.

- **Returns Object With:**
    - **Graph Data:**
        - `graphData`: The fetched graph data.
        - `isLoading`: Boolean, true while fetching `graphData`.
        - `error`: Error object if `graphData` fetching fails.
        - `refetch`: Function to manually refetch `graphData`.
            - The `graphData` query uses `queryKey: ['knowledgeGraph', query]`, is enabled by `!!query`, and has a `staleTime` of 5 minutes.
    - **Saved Queries Data:**
        - `savedQueries`: An array of `SavedQuery` objects (defaults to `[]`).
        - `loadingSavedQueries`: Boolean, true while fetching saved queries.
        - `savedQueriesError`: Error object if fetching saved queries fails.
            - The `savedQueries` query uses `queryKey: ['savedQueries']` and has a `staleTime` of 1 minute.
    - **Mutation Functions (from `useMutation`):**
        - `saveQuery(data: SaveQueryRequest)`: Saves a new query. Invalidates `['savedQueries']` on success.
        - `deleteQuery(queryId: string)`: Deletes a saved query. Invalidates `['savedQueries']` on success.
        - `updateQuery({ queryId: string; updates: Partial<SavedQuery> })`: Updates an existing saved query. Invalidates `['savedQueries']` on success.
    - **Mutation States (Booleans):**
        - `isSaving`: True if `saveQuery` mutation is pending.
        - `isDeleting`: True if `deleteQuery` mutation is pending.
        - `isUpdating`: True if `updateQuery` mutation is pending.
    - **Mutation Errors:**
        - `saveError`: Error from `saveQuery` mutation.
        - `deleteError`: Error from `deleteQuery` mutation.
        - `updateError`: Error from `updateQuery` mutation.

**Usage Context:**
Crucial for pages like `KGExplorer` that need to fetch dynamic graph data and allow users to manage their persisted queries.

## 3. Error Reporting Hook (`src/hooks/useErrorReport.ts`)

This hook provides functionality to send error reports to a backend service.

**Dependencies:**
- `../services/errorService.ts` (specifically the `reportError` function and `ErrorReport` type).

### 3.1. `useErrorReport()`

- **Purpose:** Encapsulates the logic for sending an error report, along with managing loading and result/error states of the reporting operation.
- **Arguments:** None.
- **Returns Object With:**
    - `sendErrorReport`: `async (errorReport: ErrorReport) => void`
        - A `useCallback` memoized function to send the error report.
        - Takes an `errorReport` object (matching the `ErrorReport` type from `errorService`).
        - Sets `loading` to true during the API call.
        - Updates `result` with `{ success: boolean; message: string }` from `reportError` on success.
        - Updates `error` with an error message on failure.
        - Sets `loading` to false in a `finally` block.
    - `loading`: `boolean` - True while `sendErrorReport` is in progress.
    - `result`: `{ success: boolean; message: string } | null` - The success response from the `errorService.reportError` call.
    - `error`: `string | null` - Error message if the `reportError` call fails.

**Usage Context:**
Used by error handling components (like `src/pages/ErrorUI/ErrorHandlers.tsx`) to allow users to report client-side errors.

## 4. Generic Error Handler Hook (`src/hooks/useErrorHandler.ts`)

This hook provides a centralized and configurable way to handle errors that occur within the application.

**Dependencies:**
- `../hooks/useToast.ts` (for displaying toast notifications).
- `../services/errorService.ts` (for `normalizeError`, `reportError`, `extractUserFriendlyMessage`).

### 4.1. `useErrorHandler()`

- **Purpose:** To offer a consistent approach to processing errors, optionally showing user-friendly toast messages, and reporting errors to a backend service.
- **Arguments:** None.
- **Returns Object With:**
    - `handleError`: `async (error: any, options?: ErrorHandlerOptions) => NormalizedError`
        - A `useCallback` memoized function.
        - **Parameters:**
            - `error: any`: The error object to handle.
            - `options?: ErrorHandlerOptions`: Configuration for handling this specific error.
                - `showToast?: boolean` (default: `true`): If true, displays an error toast.
                - `reportToServer?: boolean` (default: `true`): If true, reports the error to the server via `errorService.reportError`.
                - `context?: Record<string, any>`: Additional context to include if reporting to the server.
        - **Logic:**
            1. Normalizes the incoming `error` using `errorService.normalizeError(error, context)` to get a consistent error structure (`NormalizedError`).
            2. Extracts a user-friendly message using `errorService.extractUserFriendlyMessage(error)`.
            3. If `shouldShowToast` is true, calls `showToast()` (from `useToast`) with type 'error' and the user-friendly message.
            4. If `reportToServer` is true, calls `errorService.reportError(error, context)` asynchronously. Catches and logs any failure during this reporting step.
            5. Returns the `normalizedError` object.

**Usage Context:**
Can be used in various parts of the application, such as in API call catch blocks, event handlers, or other places where errors need to be processed consistently.

```jsx
const { handleError } = useErrorHandler();

try {
  // some operation that might fail
  await someAsyncOperation();
} catch (err) {
  handleError(err, { 
    showToast: true, 
    reportToServer: true, 
    context: { component: 'MyComponent', action: 'someOperation' } 
  });
}
```

## 5. Toast Notification Hook (`src/hooks/useToast.ts`)

This hook is intended to provide a way to display toast (small, temporary) notifications to the user.

### 5.1. `useToast()`

- **Purpose:** To offer a simple function for triggering toast notifications from any component or hook.
- **Arguments:** None.
- **Returns Object With:**
    - `showToast`: `(options: ToastOptions) => void`
        - A `useCallback` memoized function.
        - **Parameters:**
            - `options: ToastOptions`: An object defining the toast.
                - `type: ToastType`: (`'success' | 'error' | 'info' | 'warning';`)
                - `message: string`: The message to display.
                - `duration?: number` (default: `3000`): Duration in milliseconds for the toast to be visible.
        - **Current Behavior:**
            - **Placeholder Implementation:** Currently, this function *does not* display a visual toast message. It logs the toast type and message to the console (e.g., `[ERROR] An error occurred.`).
            - Contains a `// TODO: Implement actual toast notification system` comment, indicating that a proper UI for toasts (e.g., using a library like `react-toastify` or a custom solution) is pending.

**Usage Context:**
Intended to be used by other hooks (like `useErrorHandler`) or components to provide quick feedback to the user.

```jsx
const { showToast } = useToast();

// Example usage:
showToast({ type: 'success', message: 'Operation completed successfully!' });
showToast({ type: 'error', message: 'Failed to save data.', duration: 5000 });
```

**Note:** A full implementation of a toast UI system is required for this hook to provide visual feedback to the user beyond console logs.
