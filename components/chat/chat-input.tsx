"use client";

import { ArrowUp, Mic, Square, Plus } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import React from "react";
import { ChatRequestOptions } from "ai";
import Image from "next/image";
import UploadDialog from "./upload-dialog";
import { useState, useRef, useEffect } from "react";
import Voice from "@/components/icons/Voice";

interface ChatInputProps {
  input?: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions
  ) => void;
  isLoading: boolean;
  stop: () => void;
  regenerate: (options?: { messageId?: string }) => void;
}

export default function ChatInput({
  input = "",
  handleInputChange,
  handleSubmit,
  isLoading,
  stop,
  regenerate,
}: ChatInputProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [attachments, setAttachments] = useState<Array<{ url: string; contentType?: string; name?: string; isUploading?: boolean }>>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const hasText = input.trim().length > 0 || (attachments.length > 0 && !attachments.some(a => a.isUploading));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && hasText) {
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>, {
          experimental_attachments: attachments as any,
        } as any);
        setAttachments([]);
      }
    }
  };

  const handleUpload = async (file: File) => {
    try {

      setAttachments((prev) => [
        ...prev,
        {
          url: "",
          contentType: file.type,
          name: file.name,
          isUploading: true,
        },
      ]);
      setShowUploadModal(false);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.result) {

        setAttachments((prev) => {
          const newAttachments = [...prev];
          const index = newAttachments.findIndex(a => a.isUploading && a.name === file.name);
          if (index !== -1) {
            newAttachments[index] = {
              url: data.result.url,
              contentType: file.type,
              name: file.name,
              isUploading: false,
            };
          }
          return newAttachments;
        });
      } else {
        console.error("Upload failed:", data.error);

        setAttachments((prev) => prev.filter(a => !(a.isUploading && a.name === file.name)));
      }
    } catch (error) {
      console.error("Upload failed", error);

      setAttachments((prev) => prev.filter(a => !(a.isUploading && a.name === file.name)));
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowUploadModal(false);
      }
    };

    if (showUploadModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUploadModal]);

  return (
    <div className="w-full max-w-3xl mx-auto pb-4">

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (hasText) {
            handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>, {
              experimental_attachments: attachments as any,
            } as any);
            setAttachments([]);
          }
        }}
        className="relative flex flex-col gap-2 w-full p-3 bg-input rounded-3xl border border-white/5 shadow-md focus-within:border-white/10 transition-colors"
      >
        {attachments.length > 0 && (
          <div className="flex gap-2 px-2 overflow-x-auto">
            {attachments.map((attachment, index) => (
              <div key={index} className="relative group">
                <div className="w-16 h-16 relative rounded-xl overflow-hidden border border-white/10 flex items-center justify-center bg-[#2f2f2f]">
                  {attachment.isUploading ? (
                    <div className="flex flex-col items-center justify-center gap-1 w-full h-full">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="text-[10px] text-gray-400">Loading</span>
                    </div>
                  ) : attachment.contentType?.startsWith("image/") ? (
                    <Image
                      src={attachment.url}
                      alt={attachment.name || "attachment"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-xs text-center p-1 break-all text-gray-400">
                      {attachment.name?.slice(0, 10)}...
                    </div>
                  )}
                </div>
                {!attachment.isUploading && (
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="absolute -top-1 -right-1 bg-black/50 rounded-full p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Plus className="w-3 h-3 rotate-45" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 w-full">
          <div className="relative" ref={modalRef}>
            {showUploadModal && <UploadDialog onUpload={handleUpload} />}
            <button
              type="button"
              onClick={() => setShowUploadModal(!showUploadModal)}
              className="p-2 rounded-full hover:bg-white/10 text-primary transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>


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
              <Voice className="w-5 text-[#2f2f2f] h-5" />
            </button>
          )}
        </div>

      </form>

      <div className="text-center mt-2">
        <span className="text-xs text-secondary/60">
          ChatGPT can make mistakes. Check important info.
        </span>
      </div>
    </div>
  );
}
