import Link from "next/link";
import clsx from "clsx";
import { ElementType } from "react";

interface SidebarItemProps {
    icon?: ElementType;
    label: string;
    collapsed: boolean;
    href?: string;
    onClick?: () => void;
}

export default function SidebarItem({ icon: Icon, label, collapsed, href = "#", onClick }: SidebarItemProps) {
    return (
        <Link href={href} onClick={onClick} className="px-2 rounded-lg flex gap-2 py-2 text-md w-full hover:bg-[#2a2a2a] group items-center transition-colors">
            {Icon && <Icon className="text-white w-5 h-5 flex-shrink-0" />}
            <span className={clsx("text-white font-normal text-sm transition-opacity duration-200", {
                "hidden": collapsed,
                "block": !collapsed
            })}>
                {label}
            </span>
        </Link>
    );
}
