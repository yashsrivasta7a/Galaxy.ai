"use client";

import MessageList from "@/components/chat/message-list";
import ChatInput from "@/components/chat/chat-input";
import ModelSelector from "@/components/chat/model-selector";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, ChatRequestOptions } from "ai";
import { useState, useEffect } from "react";

interface ChatInterfaceProps {
  id?: string;
  initialMessages?: any[];
}

export default function ChatInterface({ id, initialMessages }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(!!(initialMessages && initialMessages.length > 0));
  const [chatId, setChatId] = useState(id);

  const { messages, setMessages, sendMessage, status, stop, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    initialMessages,
    body: { chatId },
  });

  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      setMessages(initialMessages);
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
    if (!input.trim()) return;
    let currentChatId = chatId;
    if (!currentChatId) {
      currentChatId = Math.random().toString(36).substring(7);
      setChatId(currentChatId);
      window.history.replaceState({}, "", `/c/${currentChatId}`);
    }
    sendMessage({ role: 'user', content: input } as any, { body: { chatId: currentChatId } });
    setIsSubmitted(true);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      <div className="absolute top-0 left-0 right-0 p-2 z-10 flex justify-between items-start bg-transparent">
        <ModelSelector />
      </div>
      {!isSubmitted ? (
        <div className="flex flex-col flex-1 w-full h-full items-center justify-center relative">

          <div className="w-full max-w-3xl flex  justify-center">
            <MessageList messages={messages} isSubmitted={isSubmitted} regenerate={regenerate} isLoading={isLoading} />
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
              <MessageList messages={messages} isSubmitted={isSubmitted} regenerate={regenerate} id={messages[messages.length - 1]?.id} isLoading={isLoading} />
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
