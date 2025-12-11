"use client";

import ChatGPT from "@/components/icons/ChatGPT";
import { SidebarCloseIcon, SidebarOpenIcon } from "lucide-react";
import Link from "next/link";
import NewChat from "@/components/icons/NewChat";
import Search from "@/components/icons/Search";
import Library from "@/components/icons/Library";
import Sora from "@/components/icons/Sora";
import GPT from "@/components/icons/GPT";
import NewProject from "@/components/icons/NewProject";
import SidebarLeft from "@/components/icons/SidebarLeft";
import clsx from "clsx";
import { useState, useEffect } from "react";
import UserMenu from "./user-menu";
import { UserAvatar, useUser } from "@clerk/nextjs";
import SidebarItem from "./sidebar-item";


interface SidebarProps {
    chats?: any[];
}

export default function Sidebar({ chats = [] }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const { user } = useUser();
    const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`;

    useEffect(() => {
        if (window.innerWidth < 768) {
            setCollapsed(true);
        }
    }, []);

    return (
        <>
            <div
                className={clsx(
                    "fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity",
                    collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
                )}
                onClick={() => setCollapsed(true)}
            />

            <button
                onClick={() => setCollapsed(false)}
                className={clsx(
                    "fixed top-2.5 left-3 z-30 p-2 bg-transparent rounded-md text-white md:hidden hover:bg-[#212121]",
                    !collapsed && "hidden"
                )}
            >
                <SidebarLeft className="w-5 h-5" />
            </button>

            <div className={clsx("bg-[#171717] transition-all duration-300 ease-in-out flex flex-col box-border h-full border-r border-[#333] tracking-normal",
                "fixed md:relative z-50",
                collapsed ? 'w-[260px] max-md:-translate-x-full md:w-[50px]' : 'w-[260px] translate-x-0'
            )}>
                <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
                    <div className="sticky top-0 z-1 bg-[#171717]">
                        <div className="flex justify-between p-4 mb-2 group">
                            <button className={clsx("cursor-pointer",
                                {
                                    'group-hover:hidden': collapsed
                                }
                            )}>
                                <ChatGPT className="w-6 h-6 text-white" />
                            </button>
                            <button className={clsx("cursor-pointer hidden",
                                {
                                    "md:block": !collapsed,
                                    "md:group-hover:block": collapsed
                                }
                            )} onClick={() => setCollapsed(!collapsed)}>
                                {

                                    <SidebarLeft width="20" height="20" className="icon" data-rtl-flip="" />

                                }
                            </button>
                            <button
                                className="cursor-pointer md:hidden block text-gray-400 hover:text-white"
                                onClick={() => setCollapsed(true)}
                            >
                                <SidebarCloseIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="px-2 space-y-1">
                            <button className="cursor-pointer w-full" onClick={() => window.location.href = '/'}>
                                <SidebarItem icon={NewChat} label="New chat" collapsed={collapsed} />
                            </button>
                            <SidebarItem icon={Search} label="Search chat" collapsed={collapsed} />
                            <SidebarItem icon={Library} label="Library" collapsed={collapsed} />
                            <SidebarItem icon={NewProject} label="Project" collapsed={collapsed} />
                        </div>
                    </div>

                    <div className={clsx({
                        "hidden": collapsed
                    })}>
                        <div className="my-6 mx-2">
                            <p className="px-2 text-gray-400 text-xs font-normal mb-2">GPTs</p>
                            <div className="">
                                {
                                    <div className={``}>

                                        <SidebarItem icon={GPT} label="Explore" collapsed={collapsed} />
                                    </div>
                                }

                            </div>
                        </div>

                        <div className="my-6 mx-2">

                        </div>
                        <div className="my-6 mx-2">
                            <p className="px-2 text-gray-400 text-xs font-normal mb-2">Your chats</p>
                            <div className="mt-2 space-y-1">
                                {chats.map((chat) => (
                                    <SidebarItem
                                        key={chat._id}
                                        label={chat.title}
                                        href={`/c/${chat._id}`}
                                        collapsed={collapsed}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div onClick={() => setOpenModal(!openModal)} className="flex-0 border-t border-[#333] pt-2 relative z-50 bg-[#171717]">
                    {openModal && (
                        <div className="absolute bottom-full left-0 mb-2 z-50">
                            <UserMenu />
                        </div>
                    )}
                    <div className="flex items-center justify-between p-2">
                        <div className="flex gap-2 items-center hover:bg-[#2a2a2a] p-2 rounded-lg cursor-pointer w-full">
                            {UserAvatar ? (
                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white shrink-0 shadow-sm">
                                    {<UserAvatar />}
                                </div>
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-[#ab936d] flex items-center justify-center text-xs font-medium text-white shrink-0 shadow-sm">{initials.toUpperCase()}</div>
                            )}
                            <div className={clsx("flex flex-col flex-shrink-0",
                                {
                                    "hidden": collapsed

                                }
                            )}>

                                <span className="text-sm text-white font-normal">{user?.firstName + " " + (user?.lastName ?? "")}
                                </span>
                                <span className="text-xs text-gray-400">Free</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}