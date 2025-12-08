"use client";

import { ArrowUp, Mic, Square, Plus } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import React from "react";
import { ChatRequestOptions } from "ai";
import Image from "next/image";
;
interface ChatInputProps {
  input?: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions
  ) => void;
  isLoading: boolean;
  stop: () => void;
  reload: () => void;
}

export default function ChatInput({
  input = "",
  handleInputChange,
  handleSubmit,
  isLoading,
  stop,
  reload,
}: ChatInputProps) {
  const hasText = input.trim().length > 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) {
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto pb-4">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center gap-2 w-full p-3 bg-input rounded-4xl border border-white/5 shadow-md focus-within:border-white/10 transition-colors"
      >

        <button
          type="button"
          className="p-2 rounded-full hover:bg-white/10 text-primary transition"
        >
          <Plus className="w-5 h-5" />
        </button>


        <TextareaAutosize
          minRows={1}
          maxRows={8}
          placeholder="Ask anything"
          className="w-full bg-transparent resize-none focus:outline-none text-primary placeholder:text-secondary/70 max-h-[200px] overflow-y-auto px-2 py-1"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="p-2 rounded-full hover:bg-white/10 text-primary transition"
        >
          <Mic className="w-5 h-5" />
        </button>
        {isLoading ? (

          <button
            type="button"
            onClick={stop}
            className="p-2 rounded-full bg-white text-black hover:bg-gray-200 transition"
          >
            <Square className="w-5 h-5 fill-black" />
          </button>
        ) : hasText ? (

          <button
            type="submit"
            className="p-2 rounded-full bg-white text-black hover:bg-gray-200 transition"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        ) : (

          <button
            type="button"
            className="p-2 rounded-full bg-white hover:bg-white/60 text-primary transition"
          >
            <Image src="/icons/voice.svg" alt="voice" width={22} height={22} />
          </button>
        )}
      </form>

      <div className="text-center mt-2">
        <span className="text-xs text-secondary/60">
          ChatGPT can make mistakes. Check important info.
        </span>
      </div>
    </div>
  );
}
