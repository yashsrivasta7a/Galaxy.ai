"use client";

import { Delete, Sparkles } from "lucide-react";
import MessageItem from "./message-item";
import { useEffect, useRef, useState } from "react";

interface MessageListProps {
  messages: any[];
  isSubmitted: boolean;
  regenerate: () => void;
}

const intro = [
  "Good to see you",
  "What’s on the agenda today?",
  'What’s on your mind today?',
  "Ready when you are.",
  "What do you need help with?",
];

export default function MessageList({ messages, isSubmitted, regenerate }: MessageListProps) {
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
          {introMessage}
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide pt-20 pb-32">
      <div className="flex-1">
        {messages.map((msg, index) => (
          <MessageItem
            key={msg.id}
            role={msg.role}
            content={msg.content}
            parts={(msg as any).parts}
            isLast={index === messages.length - 1}
            regenerate={regenerate}
          />
        )
        )}
        <div ref={bottomRef} />
      </div>
    </div >
  );
}
