"use client";

import { cn } from "@/lib/utils";
import { Sparkles, Check, RotateCcw } from "lucide-react";
import Copy from "@/components/icons/Copy";
import Regenerate from "@/components/icons/Regenerate";
import FileIcon from "@/components/icons/File";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from "react";
import { UIToolInvocation } from "ai";

interface MessagePart {
    type: 'text' | 'tool-invocation' | 'file' | 'image';
    text?: string;
    toolInvocation?: UIToolInvocation<any>;
    url?: string; // for 'file' or 'image'
    name?: string; // optional
    contentType?: string; // optional (mimeType)
}

interface MessageItemProps {
    role: string;
    content?: string;
    parts?: Array<MessagePart>;
    experimental_attachments?: Array<{ name?: string; contentType?: string; url: string }>;
    isLast: boolean;

    id: string;
    regenerate: (options?: { messageId?: string }) => void;
}

export default function MessageItem({ role, content, parts, experimental_attachments, isLast, regenerate, id }: MessageItemProps) {
    const isUser = role === "user";
    const [copied, setCopied] = useState(false);

    let textContent = content || "";

    // Extract attachments from parts if not in experimental_attachments
    const partsAttachments = parts?.filter(p => p.type === 'image' || p.type === 'file').map(p => ({
        url: p.url || '',
        name: p.name,
        contentType: p.contentType || (p.type === 'image' ? 'image/png' : 'application/octet-stream')
    })) || [];

    const allAttachments = [...(experimental_attachments || []), ...partsAttachments];

    if ((!textContent || textContent.length === 0) && parts) {
        textContent = parts
            .filter(p => p.type === 'text')
            .map(p => p.text || '')
            .join('');
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(textContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full px-4 py-2.5 md:px-5 focus-visible:outline-0">
            <div className="max-w-3xl mx-auto flex gap-4 md:gap-6">

                <div className={cn("relative flex-1 overflow-hidden", isUser ? "flex justify-end" : "")}>
                    {isUser ? (
                        <div className="bg-[#2f2f2f] w-auto text-primary px-3.5 py-3 rounded-2xl max-w-[85%] whitespace-pre-wrap leading-7">
                            {allAttachments.length > 0 && (
                                <div className="flex gap-2 mb-2 flex-wrap">
                                    {allAttachments.map((attachment, index) => (
                                        <div key={index} className="relative w-40 h-40 rounded-lg overflow-hidden border border-white/10 bg-[#2f2f2f] flex items-center justify-center">
                                            {attachment.contentType?.startsWith('image/') ? (
                                                /* eslint-disable-next-line @next/next/no-img-element */
                                                <img
                                                    src={attachment.url}
                                                    alt={attachment.name || 'attachment'}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <a
                                                    href={attachment.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex flex-col items-center gap-2 p-4 text-center hover:bg-[#3f3f3f] transition-colors w-full h-full justify-center"
                                                >
                                                    <div className="p-2 bg-white/10 rounded-lg">
                                                        <FileIcon width={24} height={24} />
                                                    </div>
                                                    <span className="text-xs text-gray-300 break-all line-clamp-2">
                                                        {attachment.name || 'Document'}
                                                    </span>
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {textContent}
                        </div>
                    ) : (
                        <div className="flex flex-col w-full">
                            <div className="text-primary prose prose-invert prose-p:leading-relaxed prose-pre:p-0 max-w-none w-full">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        code({ node, className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || "");
                                            const isCodeBlock = !className?.includes('inline') && match;

                                            if (!isCodeBlock) {
                                                return (
                                                    <code className={cn("bg-[#2f2f2f] text-gray-200 px-2 py-0.5 rounded-md text-sm", className)} {...props}>
                                                        {children}
                                                    </code>
                                                );
                                            }

                                            return (
                                                <div className="rounded-md overflow-hidden my-4 ">
                                                    <div className="flex items-center justify-between px-4 py-2 bg-[#171717]  ">
                                                        <span className="text-xs text-gray-400 lowercase">{match[1]}</span>
                                                        <button
                                                            className="flex gap-1 items-center text-xs text-gray-400 hover:text-white transition-colors"
                                                            onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                                                        >
                                                            <Copy className="h-3 w-3" />
                                                            Copy
                                                        </button>
                                                    </div>
                                                    <div className="overflow-x-auto">
                                                        <SyntaxHighlighter
                                                            style={{
                                                                ...oneDark,
                                                                'code[class*="language-"]': {
                                                                    ...oneDark['code[class*="language-"]'],
                                                                    background: 'transparent',
                                                                },
                                                                'pre[class*="language-"]': {
                                                                    ...oneDark['pre[class*="language-"]'],
                                                                    background: 'transparent',
                                                                },
                                                            }}
                                                            language={match[1]}
                                                            PreTag="div"
                                                            customStyle={{
                                                                margin: 0,
                                                                padding: '1.5rem',
                                                                background: '#171717',
                                                                fontSize: '0.875rem',
                                                                lineHeight: '1.5',
                                                            }}
                                                        >
                                                            {String(children).replace(/\n$/, '')}
                                                        </SyntaxHighlighter>
                                                    </div>
                                                </div>
                                            );
                                        },
                                        p({ children }) {
                                            return <p className="mb-4 last:mb-0 leading-7">{children}</p>;
                                        },
                                        ul({ children }) {
                                            return <ul className="list-disc pl-4 mb-4 space-y-2">{children}</ul>;
                                        },
                                        ol({ children }) {
                                            return <ol className="list-decimal pl-4 mb-4 space-y-2">{children}</ol>;
                                        },
                                    }}
                                >
                                    {textContent}
                                </ReactMarkdown>
                            </div>
                            <div className="flex items-center -ml-2">
                                <button
                                    onClick={handleCopy}
                                    className="p-2 text-gray-400 hover:text-white hover:bg-[#2f2f2f] rounded-md transition-colors"
                                    aria-label="Copy response"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="icon" />}
                                </button>
                                {isLast && (
                                    <button
                                        onClick={() => regenerate({ messageId: id })}
                                        className="p-2 text-gray-400 hover:text-white hover:bg-[#2f2f2f] rounded-md transition-colors"
                                        aria-label="Regenerate response"
                                    >
                                        <Regenerate className="icon" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
