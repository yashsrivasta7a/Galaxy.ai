"use client";

import { MoreHorizontal } from "lucide-react";

export default function UserNav() {
  return (
    <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-[#212121] transition-colors text-left group">
        <div className="w-8 h-8 rounded-full bg-blue-500/90 flex items-center justify-center text-white font-medium text-xs shadow-sm">
            YS
        </div>
        <div className="flex-1 overflow-hidden">
            <div className="text-sm font-medium text-primary truncate leading-tight">Yash Srivastava</div>
            <div className="text-xs text-secondary truncate leading-tight">Free Plan</div>
        </div>
        <MoreHorizontal className="w-4 h-4 text-tertiary group-hover:text-primary transition-colors" />
    </button>
  )
}
