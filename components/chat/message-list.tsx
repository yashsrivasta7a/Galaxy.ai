"use client";

import { Delete, Sparkles } from "lucide-react";
import MessageItem from "./message-item";
import { useEffect, useRef, useState } from "react";
import { Message } from "@/types/types";
import { useUser } from "@clerk/nextjs";

interface MessageListProps {
  messages: Message[];
  isSubmitted: boolean;
  regenerate: (options?: { messageId?: string }) => void;
  isLoading: boolean;
  id?: string;
}


const intro = [
  "Good to see you, ",
  "What’s on the agenda today? ",
  'What’s on your mind today? ',
  "Ready when you are, ",
  "What do you need help with? ",
];

export default function MessageList({ messages, isSubmitted, regenerate, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [introMessage, setIntroMessage] = useState("");

  useEffect(() => {
    setIntroMessage(intro[Math.floor(Math.random() * intro.length)]);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isSubmitted === false) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h1 className="px-1 text-2xl text-pretty whitespace-pre-wrap">
          {introMessage}{useUser().user?.firstName}
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
      <div className="flex-1">
        {messages.map((msg, index) => (
          <MessageItem
            key={msg.id}
            id={msg.id}
            role={msg.role}
            content={msg.content}
            parts={(msg as any).parts}
            experimental_attachments={(msg as any).experimental_attachments}
            isLast={index === messages.length - 1}
            regenerate={regenerate}
          />
        )
        )}
        <div ref={bottomRef} />
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="w-full px-4 py-2.5 md:px-5 focus-visible:outline-0">
            <div className="max-w-3xl mx-auto flex gap-4 md:gap-6">
              <div className="flex flex-col w-full">
                <div className="flex justify-start">
                  <div className="w-3.5 h-3.5 bg-white dark:bg-white rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  );
}
