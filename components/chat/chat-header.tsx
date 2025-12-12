import ModelSelector from "./model-selector"
import Share from "@/components/icons/Share";
import AddPeople from "@/components/icons/AddPeople";
import MoreHorizontal from "@/components/icons/MoreHorizontal";
import { ShareDialog } from "./share-dialog";
import { useState } from "react";

import clsx from "clsx";

interface ChatHeaderProps {
  chatId: string;
  isShared: boolean;
}

export const ChatHeader = ({ chatId, isShared }: ChatHeaderProps) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  return <div className="flex justify-between items-center w-full p-2 bg-transparent md:pl-2 pl-12">
    <div className="flex justify-start gap-2">
      <ModelSelector />
    </div>
    <div className="flex justify-end items-center gap-2">
      <div
        onClick={() => setIsShareDialogOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-[#2f2f2f] transition-colors text-sm font-medium text-primary/90 hover:text-primary cursor-pointer group"
      >
        <Share className="-ms-0.5 icon" aria-label="" />
        <span className="hidden md:block">Share</span>
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-[#2f2f2f] transition-colors text-sm font-medium text-primary/90 hover:text-primary cursor-pointer group">
        <AddPeople className="-ms-0.5 icon" aria-label="" />
        <span className="hidden md:block">Add People</span>
      </div>
      <div className="flex justify-center items-center p-2 rounded-xl hover:bg-[#2f2f2f] transition-colors text-primary/90 hover:text-primary cursor-pointer">
        <MoreHorizontal className="icon" />
      </div>
    </div>
    <ShareDialog
      chatId={chatId}
      isShared={isShared}
      isOpen={isShareDialogOpen}
      onOpenChange={setIsShareDialogOpen}
    />
  </div>
}
