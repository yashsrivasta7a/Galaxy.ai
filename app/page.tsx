import ChatInterface from "@/components/chat/chat-interface";
import Sidebar from "@/components/layout/sidebar";

export default function Home() {

  return (
    <div className="flex h-screen w-full bg-sidebar">

      <Sidebar />

      <main className="flex-1 flex flex-col h-full bg-main  ml-0 md:ml-0 overflow-hidden relative border border-white/5 shadow-2xl">

        <ChatInterface />
      </main>
    </div>

  )
}