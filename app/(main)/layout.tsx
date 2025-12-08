import Sidebar from '@/components/layout/sidebar'

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex h-screen w-full bg-sidebar">
            <Sidebar/>
            {children}
        </div>
    )
}
