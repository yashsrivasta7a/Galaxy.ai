import Sidebar from '@/components/layout/sidebar'
import { auth } from '@clerk/nextjs/server'
import { getUserChats } from '@/lib/db/actions/chat.actions'

export default async function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const { userId } = await auth();
    const chats = userId ? await getUserChats(userId) : [];

    return (
        <div className="flex h-screen w-full bg-sidebar">
            <Sidebar chats={chats} />
            {children}
        </div>
    )
}
