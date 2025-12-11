"use client"

import { SignOutButton, UserAvatar, useUser } from "@clerk/nextjs"
import User from "@/components/icons/User";
import Settings from "@/components/icons/Settings";
import Help from "@/components/icons/Help";
import LogOut from "@/components/icons/LogOut";

export default function UserMenu() {
    const { user } = useUser();
    const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`;
    return (
        <div onClick={(e) => e.stopPropagation()} className=" absolute bottom-[100%] left-0 mb-2 ml-2 flex flex-col w-60 bg-[#353535] rounded-2xl p-2 text-gray-100 shadow-xl border border-gray-800/50 z-20">
            <div className="flex items-center gap-3 p-2 hover:bg-[#494949] rounded-xl cursor-pointer mb-1 group transition-colors">
                {UserAvatar ? (
                    <div className="w-8 h-8 rounded-full  flex items-center justify-center text-xs font-medium text-white shrink-0 shadow-sm">
                        {<UserAvatar />}
                    </div>
                ) : (
                    <div className="w-8 h-8 rounded-full bg-[#ab936d] flex items-center justify-center text-xs font-medium text-white shrink-0 shadow-sm">{initials.toUpperCase()}</div>
                )}
                <div className="flex flex-col">
                    <span className="font-medium text-white text-sm">{user?.firstName + " " + (user?.lastName ?? "")}
                    </span>
                    <span className="text-xs text-gray-400">{user?.emailAddresses[0].emailAddress}</span>
                </div>
            </div>
            <div className="h-px bg-gray-300/20 my-1 mx-2" />
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#494949] rounded-lg cursor-pointer transition-colors group">
                    <User className="icon" aria-hidden="true" />
                    <span className="text-sm font-medium text-gray-200 group-hover:text-white">Personalisation</span>
                </div>
                <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#494949] rounded-lg cursor-pointer transition-colors group">
                    <Settings className="icon" aria-hidden="true" />
                    <span className="text-sm font-medium text-gray-200 group-hover:text-white">Settings</span>
                </div>
                <div className="h-px bg-gray-300/20 my-1 mx-2" />
                <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#494949] rounded-lg cursor-pointer transition-colors group">
                    <Help className="icon" aria-hidden="true" />
                    <span className="text-sm font-medium text-gray-200 group-hover:text-white">Help</span>
                </div>
                <SignOutButton redirectUrl="/">
                    <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#494949] rounded-lg cursor-pointer transition-colors group">
                        <LogOut className="icon" aria-hidden="true" data-rtl-flip="" />
                        <span className="text-sm font-medium text-gray-200 group-hover:text-white">
                            Logout
                        </span>
                    </div>
                </SignOutButton>

            </div>

        </div >
    )
}
