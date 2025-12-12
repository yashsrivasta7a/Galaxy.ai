import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { Message } from "@/types/types";

export async function generateTitle(messages: Message[]): Promise<string> {
    try {
        // Take the first 2 messages to generate a context-aware title
        const analysisMessages = messages.slice(0, 2).map(m => ({
            role: m.role as "user" | "assistant",
            content: m.content || (Array.isArray(m.parts) ? "User sent an attachment/file." : "")
        }));

        const { text } = await generateText({
            model: openai("gpt-4o"),
            system: `You are a helpful assistant. Generate a short, concise, and descriptive title (max 6 words) for a chat conversation based on the provided messages. 
      - Do not include "Title:" or quotes.
      - If the conversation is about a specific topic (e.g., "Python script error"), use that.
      - If the conversation is just greeting, use "New Conversation".
      - Return ONLY the title text.`,
            messages: analysisMessages,
        });

        return text.trim().slice(0, 50); 
    } catch (error) {
        console.error("Error generating title:", error);
        return "New Chat";
    }
}
