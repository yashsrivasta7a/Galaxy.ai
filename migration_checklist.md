# AI SDK 5 Migration Checklist

## Dependencies
- [x] Update `ai` to latest version (5.x)
- [x] Update provider packages (e.g., `@ai-sdk/openai`) to latest
- [x] Update `@ai-sdk/react` to latest

## API Routes
- [x] Migrate `app/api/chat/route.ts` (or wherever the chat endpoint is) to use `streamText`
- [x] Ensure `streamText` uses `maxSteps` (if needed) on the server side instead of client side
- [x] Use `createDataStreamResponse` if previously using custom response handling

## Client Side (`useChat`)
- [x] Update `ChatInterface` to handle input state manually (if `useChat` no longer manages it as preferred) - *Note: Local state was just added in ChatInput, verify `useChat` usage in `ChatInterface`.*
- [x] Update `handleSubmit` to work with the decoupled input.
- [x] Remove `maxSteps` from `useChat` config if present.

## Types
- [x] Update message types if manually defined (prefer types from `ai` package).
- [x] Handle `UIMessage` structure (checking `parts` for attachments/images).

## Attachments
- [x] Verify attachment handling works with the new `experimental_attachments` or standard `parts` structure.
