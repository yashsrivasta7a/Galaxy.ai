"use client";

import MessageList from "@/components/chat/message-list";
import ChatInput from "@/components/chat/chat-input";
import ModelSelector from "@/components/chat/model-selector";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, ChatRequestOptions } from "ai";
import { useState, useEffect } from "react";

import { Message } from '@/types/types';
import { ChatHeader } from "./chat-header";

interface ChatInterfaceProps {
  id?: string;
  initialMessages?: Message[];
}

export default function ChatInterface({ id, initialMessages }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(!!(initialMessages && initialMessages.length > 0));
  const [chatId, setChatId] = useState(id);

  const { messages, setMessages, sendMessage, status, stop, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { chatId },
    }),

  });

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

  return (
    <div className="flex flex-col h-full w-full relative">
      <div className="absolute top-0 left-0 right-0 p-2 z-10 flex justify-between items-start bg-transparent">
        <ChatHeader />
      </div>
      {!isSubmitted ? (
        <div className="flex flex-col flex-1 w-full h-full items-center justify-center relative">

          <div className="w-full max-w-3xl flex  justify-center">
            <MessageList messages={messages as any} isSubmitted={isSubmitted} regenerate={regenerate} isLoading={isLoading} />
          </div>

          <div className="w-full max-w-3xl mt-4">
            <ChatInput

              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              stop={stop}
              regenerate={regenerate}
            />
          </div>

        </div>
      )
        : (
          <div className="flex flex-col flex-1 h-full ">
            <div className="flex-1 overflow-hidden relative pt-14">
              <MessageList messages={messages as any} isSubmitted={isSubmitted} regenerate={regenerate} id={messages[messages.length - 1]?.id} isLoading={isLoading} />
            </div>
            <div className="w-full relative z-20">

              <ChatInput

                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                stop={stop}
                regenerate={regenerate}
              />
            </div>
          </div>
        )
      }
    </div>
  );
}
