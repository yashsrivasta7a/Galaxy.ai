import React from 'react';

export default function SkeletonLoader() {
    return (
        <div className="flex h-screen w-full bg-[#212121] overflow-hidden">
            {/* Sidebar Skeleton - Hidden on mobile */}
            <div className="hidden md:flex flex-col w-[260px] h-full bg-[#171717] border-r border-[#333] p-3 gap-4">
                {/* Sidebar Header */}
                <div className="flex justify-between items-center px-2 py-3">
                    <div className="h-8 w-8 bg-[#2f2f2f] rounded-md animate-pulse" />
                    <div className="h-8 w-8 bg-[#2f2f2f] rounded-md animate-pulse" />
                </div>

                {/* New Chat Button */}
                <div className="h-10 w-full bg-[#2f2f2f] rounded-lg animate-pulse" />

                {/* Nav Items */}
                <div className="flex flex-col gap-2 mt-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-3 items-center px-2">
                            <div className="h-5 w-5 bg-[#2f2f2f] rounded animate-pulse" />
                            <div className="h-4 w-24 bg-[#2f2f2f] rounded animate-pulse" />
                        </div>
                    ))}
                </div>

                {/* Chat History Section */}
                <div className="mt-6 flex flex-col gap-3">
                    <div className="h-3 w-12 bg-[#2f2f2f] rounded ml-2 animate-pulse" />
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-4 w-full bg-[#2f2f2f] rounded animate-pulse" />
                    ))}
                </div>

                {/* User Profile - Bottom */}
                <div className="mt-auto flex items-center gap-3 p-2">
                    <div className="h-8 w-8 bg-[#2f2f2f] rounded-full animate-pulse" />
                    <div className="flex flex-col gap-1">
                        <div className="h-3 w-20 bg-[#2f2f2f] rounded animate-pulse" />
                        <div className="h-2 w-12 bg-[#2f2f2f] rounded animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Main Chat Area Skeleton */}
            <div className="flex-1 flex flex-col h-full relative">
                {/* Header */}
                <div className="h-14 w-full flex items-center justify-between px-4 border-b border-white/5">
                    <div className="h-6 w-32 bg-[#2f2f2f] rounded animate-pulse" />
                    <div className="flex gap-2">
                        <div className="h-8 w-8 bg-[#2f2f2f] rounded animate-pulse" />
                        <div className="h-8 w-8 bg-[#2f2f2f] rounded animate-pulse" />
                    </div>
                </div>

                {/* Chat Messages Area */}
                <div className="flex-1 flex flex-col justify-center items-center p-4 gap-8">
                    <div className="h-12 w-12 bg-white/10 rounded-full animate-pulse mb-4" />
                </div>

                {/* Input Area */}
                <div className="w-full max-w-3xl mx-auto p-4 mb-4">
                    <div className="h-14 w-full bg-[#2f2f2f] rounded-3xl animate-pulse" />
                    <div className="flex justify-center gap-4 mt-2">
                        <div className="h-3 w-24 bg-[#2f2f2f] rounded animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}
