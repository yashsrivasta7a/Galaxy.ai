"use client";

import MessageList from "@/components/chat/message-list";
import ChatInput from "@/components/chat/chat-input";
import ModelSelector from "@/components/chat/model-selector";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { messages, sendMessage, status, stop, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });
  const isLoading = status === "streaming";

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    options?: { experimental_attachments?: FileList }
  ) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setIsSubmitted(true);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full w-full  relative">
      <div className="absolute top-0 left-0 right-0 p-2 z-10 flex justify-between items-start bg-transparent">
        <ModelSelector />
      </div>
      {!isSubmitted ? (
        <div className="flex flex-col flex-1 w-full h-full items-center justify-center relative">

          <div className="w-full max-w-3xl flex justify-center">
            <MessageList messages={messages} isSubmitted={isSubmitted} regenerate={regenerate} />
          </div>

          <div className="w-full max-w-3xl mt-4">
            <ChatInput
              messages={messages}
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
              <MessageList messages={messages} isSubmitted={isSubmitted} regenerate={regenerate} />
            </div>
            <div className="w-full relative z-20">

              <ChatInput
                messages={messages}
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
