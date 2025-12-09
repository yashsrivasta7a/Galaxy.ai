import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createChat, saveMessage } from '@/lib/actions/chat.actions';
import { auth } from '@clerk/nextjs/server';
import { client } from '@/lib/mem0';
import { getSystemPrompt } from '@/lib/prompts/system';

export const maxDuration = 30;

export async function POST(req: Request) {
  const json = await req.json();
  let { messages, chatId } = json;

  if (!chatId && messages && messages.length > 0) {
    chatId = messages[0].chatId;
  }


  if (!messages) {
    console.error("No messages provided");
    return new Response("Missing messages", { status: 400 });
  }

  const lastMessage = messages[messages.length - 1];

  const userContent = (lastMessage as any).parts ? (lastMessage as any).parts[0].text : (lastMessage as any).content || "";

  await saveMessage(chatId, 'user', userContent);

  const { userId } = await auth();

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const mem0Messages = messages.map((m: any) => ({
    role: m.role,
    content: m.content || (m.parts ? m.parts[0].text : "") || "",
  }));

  try {
    await client.add(mem0Messages, { user_id: userId });
  } catch (error) {
    console.error("Error adding memories:", error);
  }


  const memories = await client.search(userContent, { user_id: userId });

  const memoriesText = memories
    .map((m: any) => m.memory)
    .join('\n');

  const title = (messages[0] as any).content || ((messages[0] as any).parts ? (messages[0] as any).parts[0].text : "New Chat");



  try {
    await createChat(userId, title.slice(0, 50), chatId);
  } catch (error: any) {
    if (error.code !== 11000) {
      throw error;
    }

  }

  const textMessages = messages.map((m: any, index: number) => {
    const text = m.content || (m.parts ? m.parts[0].text : "") || "";
    if (!text) {
      console.warn(`Message at index ${index} has incomplete content.`);
    }
    return {
      role: m.role,
      content: text
    };
  });

  try {
    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: getSystemPrompt(memoriesText),
      messages: textMessages as any,
      onFinish: async ({ text }) => {
        await saveMessage(chatId, 'assistant', text);
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("Error in streamText:", err);
    return new Response("Internal SDK Error", { status: 500 });
  }
}
