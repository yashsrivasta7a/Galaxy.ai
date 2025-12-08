"use client";

import { ChevronDown, Sparkles } from "lucide-react";

export default function ModelSelector() {
  return (
    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-[#2f2f2f] transition-colors text-lg  text-primary/90 hover:text-primary group">
      <span>ChatGPT </span>
      <span className="text-white/30">5.1</span>
      <ChevronDown className="w-4 h-4 text-tertiary group-hover:text-primary transition-colors mt-0.5" />
    </button>
  );
}
