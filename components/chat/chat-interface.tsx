"use client";

import MessageList from "@/components/chat/message-list";
import ChatInput from "@/components/chat/chat-input";
import ModelSelector from "@/components/chat/model-selector";
import { useChat } from "@ai-sdk/react";
import { useRouter } from "next/navigation";
import { DefaultChatTransport, ChatRequestOptions } from "ai";
import { useState, useEffect } from "react";

import { Message } from '@/types/types';
import { ChatHeader } from "./chat-header";
import { deleteMessagesSince } from "@/lib/db/actions/chat.actions";

interface ChatInterfaceProps {
  id?: string;
  initialMessages?: Message[];
  isShared?: boolean;
  isReadOnly?: boolean;
}

export default function ChatInterface({ id, initialMessages, isShared = false, isReadOnly = false }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(!!(initialMessages && initialMessages.length > 0));
  const [chatId, setChatId] = useState(id);

  const router = useRouter();

  const { messages, setMessages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { chatId },
    }),
    onFinish: () => {
      router.refresh();
    },
  });

  useEffect(() => {
    if (id) {
      setChatId(id);
    }
  }, [id]);

  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      setMessages(initialMessages as any);
    }
  }, [initialMessages, setMessages]);
  const isLoading = status === "streaming" || status === "submitted";

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    options?: ChatRequestOptions
  ) => {
    e.preventDefault();
    const attachments = (options as any)?.experimental_attachments;
    if (!input.trim() && (!attachments || attachments.length === 0)) return;

    let currentChatId = chatId;
    if (!currentChatId) {
      currentChatId = Math.random().toString(36).substring(7);
      setChatId(currentChatId);
      window.history.replaceState({}, "", `/c/${currentChatId}`);
    }

    sendMessage(
      {
        role: 'user',
        content: input,
        experimental_attachments: attachments
      } as any,
      {
        ...options, // (like attachments)
        body: { chatId: currentChatId }
      }
    );
    setIsSubmitted(true);
    setInput("");
  };

  const handleEdit = async (messageId: string, newContent: string) => {
    if (!chatId) return;

    await deleteMessagesSince(chatId, messageId);

    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) return;

    const previousMessages = messages.slice(0, messageIndex);
    setMessages(previousMessages as any);

    sendMessage(
      {
        role: 'user',
        content: newContent,
      } as any,
      {
        body: { chatId }
      }
    );
  };

  const handleRegenerate = async (options?: { messageId?: string }) => {
    if (!chatId || !options?.messageId) return;

    // Find the message being regenerated
    const messageIndex = messages.findIndex((m) => m.id === options.messageId);
    if (messageIndex === -1) return;

    // Get the user message that prompted this response
    const userMessageIndex = messageIndex - 1;
    if (userMessageIndex < 0) return;

    const userMessage = messages[userMessageIndex];

    // Update local state immediately
    // key fix: Slicing to userMessageIndex effectively removes the user message from the history
    // so that sendMessage can add it back without duplication.
    const messagesToKeep = messages.slice(0, userMessageIndex);
    setMessages(messagesToKeep as any);

    // Send the request with regeneration context
    await sendMessage(
      {
        role: 'user',
        content: (userMessage as any).content,
        experimental_attachments: (userMessage as any).experimental_attachments
      } as any,
      {
        body: {
          chatId,
          regenerateMessageId: options.messageId
        }
      }
    );
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      <div className="absolute top-0 left-0 right-0  z-10 flex justify-between items-start bg-transparent">
        <ChatHeader chatId={chatId || ''} isShared={isShared} />
      </div>
      {!isSubmitted ? (
        <div className="flex flex-col flex-1 w-full h-full items-center justify-center relative">

          <div className="w-full max-w-3xl flex  justify-center">
            <MessageList messages={messages as any} isSubmitted={isSubmitted} regenerate={handleRegenerate} isLoading={isLoading} onEdit={isReadOnly ? undefined : handleEdit} />
          </div>

          {!isReadOnly && (
            <div className="w-full max-w-3xl mt-4">
              <ChatInput
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                stop={stop}
                regenerate={handleRegenerate}
              />
            </div>
          )}
          {isReadOnly && (
            <div className="w-full max-w-3xl mt-4 p-4 text-center text-zinc-500 bg-zinc-900/50 rounded-xl">
              This chat is read-only. Start a new chat to interact.
            </div>
          )}

        </div>
      )
        : (
          <div className="flex flex-col flex-1 h-full ">
            <div className="flex-1 overflow-hidden relative pt-14">
              <MessageList messages={messages as any} isSubmitted={isSubmitted} regenerate={handleRegenerate} id={messages[messages.length - 1]?.id} isLoading={isLoading} onEdit={isReadOnly ? undefined : handleEdit} />
            </div>
            <div className="w-full relative z-20">
              {!isReadOnly ? (
                <ChatInput
                  input={input}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  isLoading={isLoading}
                  stop={stop}
                  regenerate={handleRegenerate}
                />
              ) : (
                <div className="w-full p-4 text-center text-zinc-500 bg-zinc-900/50 border-t border-white/5">
                  This chat is read-only. Start a new chat to interact.
                </div>
              )}
            </div>
          </div>
        )
      }
    </div>
  );
}
