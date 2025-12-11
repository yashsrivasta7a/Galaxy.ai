"use client";

import { useRef } from "react";
import Upload from "@/components/icons/Upload"; // Renamed from Upload to avoid conflict? No, component is Upload.
import Library from "@/components/icons/Library";
import ImageIcon from "@/components/icons/Image";
import DeepResearch from "@/components/icons/DeepResearch";
import Shopping from "@/components/icons/Shopping";

interface UploadDialogProps {
    onUpload: (file: File) => void;
}

export default function UploadDialog({ onUpload }: UploadDialogProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onUpload(file);
        }
    };

    return (
        <div
            className="absolute bottom-[100%] left-0 mb-3  flex flex-col w-60 
                 bg-[#353535] rounded-2xl p-2 text-gray-100 shadow-xl 
                 border border-gray-800/50 z-20"
        >
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
            />
            <div className="flex flex-col gap-2.5">

                <div
                    className="flex items-center gap-2.5 px-3 pt-2.5 pb-2.5 hover:bg-[#494949] 
                        rounded-lg cursor-pointer transition-colors group"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload width={20} height={20} className="text-gray-400 group-hover:text-white transition-colors" />

                    <span className="text-sm group-hover:text-white">Add photos &amp; files</span>
                </div>

                <div className="h-px bg-gray-300/20 mx-2" />

                <div className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#494949] rounded-lg cursor-pointer transition-colors group">
                    <Library width={20} height={20} className="icon" />
                    <span className="text-sm group-hover:text-white">Create image</span>
                </div>

                <div className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#494949] rounded-lg cursor-pointer transition-colors group">
                    <ImageIcon width={20} height={20} className="icon" aria-label="" />

                    <span className="text-sm group-hover:text-white">Deep research</span>
                </div>

                <div className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#494949] rounded-lg cursor-pointer transition-colors group">
                    <DeepResearch width={20} height={20} />

                    <span className="text-sm group-hover:text-white">Shopping research</span>
                </div>

                <div className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#494949] rounded-lg cursor-pointer transition-colors group">
                    <Shopping width={20} height={20} className="icon" aria-label="" />

                    <span className="text-sm group-hover:text-white">Thinking</span>
                </div>

            </div>
        </div>
    );
}
