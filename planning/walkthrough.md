# Walkthrough - ChatGPT Clone Project Structure

This document outlines the folder structure and file skeletons created for the ChatGPT clone project. The structure is designed to be scalable, efficient, and compatible with Next.js App Router.

## 📂 System Architecture

The project is organized into logical modules:

- **`app/`**: Contains the Next.js App Router pages and API routes.
- **`components/`**: UI building blocks, separated by scope (`ui`, `chat`, `layout`).
- **`lib/`**: Core utilities and external service configurations.
- **`hooks/`**: Custom React hooks for separated logic.
- **`types/`**: TypeScript definitions for type safety.

## 🗂️ Detailed File Structure

### 1. Application Routes (`/app`)
- **API Routes**:
  - `api/chat/route.ts`: Endpoint for handling chat requests (OpenRouter streaming).
  - `api/upload/route.ts`: Endpoint for file uploads (Cloudinary).
  - `api/webhooks/route.ts`: Webhook receiver for external events.

### 2. Components (`/components`)
#### UI Primitives (`/components/ui`)
Reusable, atomic UI components (shadcn/ui style):
- `button.tsx`, `input.tsx`, `textarea.tsx`: Basic form elements.
- `avatar.tsx`: User/Bot avatar display.
- `sheet.tsx`: Mobile sidebar drawer.
- `skeleton.tsx`: Loading state placeholders.

#### Chat Components (`/components/chat`)
Specialized components for the chat experience:
- `chat-interface.tsx`: The main container for the chat view.
- `message-list.tsx`: Scrollable list required for displaying messages.
- `message-item.tsx`: Individual message component (supports Markdown).
- `chat-input.tsx`: Complex input area with file attachment support.
- `model-selector.tsx`: Dropdown to switch between AI models.
- `chat-header.tsx`: Header area with mobile menu trigger.

#### Layout (`/components/layout`)
Global layout elements:
- `sidebar.tsx`: Main navigation and chat history sidebar.
- `sidebar-item.tsx`: Individual history items.
- `user-nav.tsx`: User profile and settings menu.

### 3. Logic & Utilities (`/lib`)
- `openrouter.ts`: Configuration and client for OpenRouter API.
- `mem0.ts`: Setup for Mem0 (Memory/Context).
- `cloudinary.ts`: Cloudinary configuration for storage.
- `utils.ts`: Helper functions (e.g., specific class merging).

### 4. Custom Hooks (`/hooks`)
- `use-chat-stream.ts`: Manages the chat state and streaming responses.
- `use-file-upload.ts`: Handles file selection and upload progress.
- `use-enter-submit.ts`: Logic for submitting on Enter vs. new line on Shift+Enter.

### 5. Types (`/types`)
- `index.ts`: Shared interfaces (`Message`, `ChatSession`, `UserProfile`) to ensure consistency across the app.

## 🚀 Next Steps
With this structure in place, the development flow should be:
1.  **Configure Environment**: Set up `.env` with keys for OpenRouter, Mem0, and Cloudinary.
2.  **Implement Utilities**: Fill in `lib/` files with actual client initialization.
3.  **Build UI**: Implement the visual design in `components/`.
4.  **Connect Logic**: Wire up `hooks` and `api` routes to bring the app to life.
