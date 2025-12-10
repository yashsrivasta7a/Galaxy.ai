import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ChatInterface from "@/components/chat/chat-interface";
import { getChatMessages } from "@/lib/actions/chat.actions";
import { Message } from '@/types/types';

interface ChatPageProps {
  params: {
    chatid: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const user = await currentUser();

  if (!user) {
    redirect("/login");
  }

  const resolvedParams = await params;
  const chatId = resolvedParams.chatid;

  if (!chatId) {
    console.error("ChatPage: chatid is missing from params");
    return <div>Error: Chat ID missing</div>;
  }

  const messagesFromDb = await getChatMessages(chatId);

  const initialMessages: Message[] = messagesFromDb.map((msg: any) => ({
    ...msg,
    id: msg._id,
  }));

  return (
    <div className="flex-1 flex flex-col h-full bg-main  ml-0 md:ml-0 overflow-hidden relative border border-white/5 shadow-2xl">
      <ChatInterface id={chatId} initialMessages={initialMessages} />
    </div>
  );
}
