import ChatInterface from "@/components/chat/chat-interface";

export default function Home() {

  return (
    <main className="flex-1 flex flex-col h-full bg-main  ml-0 md:ml-0 overflow-hidden relative border border-white/5 shadow-2xl">
      <ChatInterface />
    </main>
  )
}