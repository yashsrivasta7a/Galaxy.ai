"use client";


import { Copy, Check } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { shareChat } from "@/lib/db/actions/chat.actions";
import { useEffect, useState } from "react";



interface ShareDialogProps {
    chatId: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    isShared: boolean;
}

export function ShareDialog({ chatId, isOpen, onOpenChange, isShared: initialShared }: ShareDialogProps) {
    const [isShared, setIsShared] = useState(initialShared);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    useEffect(() => {
        setIsShared(initialShared);
    }, [initialShared]);

    const shareUrl = typeof window !== "undefined"
        ? `${window.location.origin}/c/${chatId}`
        : "";

    const handleShare = async () => {
        try {
            setLoading(true);
            await shareChat(chatId);
            setIsShared(true);
        } catch (error) {
            console.error("Failed to share chat", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50 backdrop-blur-sm" />
                <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border border-zinc-800 bg-zinc-900 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full text-zinc-100">
                    <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                        <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
                            Share Chat
                        </Dialog.Title>
                        <Dialog.Description className="text-zinc-400 text-sm mt-1.5">
                            {isShared
                                ? "Anyone with the link can view this chat."
                                : "Share this chat with others."}
                        </Dialog.Description>
                    </div>

                    <div className="flex flex-col gap-4 mt-2">
                        {!isShared ? (
                            <button
                                onClick={handleShare}
                                disabled={loading}
                                className="inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black hover:bg-zinc-200 h-10 px-4 py-2 w-full"
                            >
                                {loading ? "Creating link..." : "Create public link"}
                            </button>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <div className="grid flex-1 gap-2">
                                    <label htmlFor="link" className="sr-only">
                                        Link
                                    </label>
                                    <div className="flex items-center rounded-xl border border-zinc-700 bg-zinc-950 px-3 h-10 w-full">
                                        <input
                                            id="link"
                                            className="flex h-full w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground text-zinc-100"
                                            readOnly
                                            value={shareUrl}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    title="Copy Link"
                                    onClick={handleCopy}
                                    className="inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-zinc-800 text-zinc-100 hover:bg-zinc-700 h-10 px-4 py-2 min-w-[3rem]"
                                >
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </button>
                            </div>
                        )}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
