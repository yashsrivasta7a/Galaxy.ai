"use server";

import Chat from "@/lib/models/chat.model";
import Message from "@/lib/models/message.model";
import { connectToDatabase } from "@/lib/db";

export async function createChat(userId: string, title?: string) {
    try {
        await connectToDatabase();
        const chat = await Chat.create({
            userId,
            title: title || 'New Chat',
        });
        return JSON.parse(JSON.stringify(chat));
    } catch (error) {
        console.error("Error creating chat:", error);
        throw error;
    }
}

export async function getChat(chatId: string) {
    try {
        await connectToDatabase();
        const chat = await Chat.findById(chatId);
        return JSON.parse(JSON.stringify(chat));
    } catch (error) {
        console.error("Error getting chat:", error);
        throw error;
    }
}

export async function getChatMessages(chatId: string) {
    try {
        await connectToDatabase();
        const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
        return JSON.parse(JSON.stringify(messages));
    } catch (error) {
        console.error("Error getting messages:", error);
        throw error;
    }
}

export async function saveMessage(chatId: string, role: string, content: string) {
    try {
        await connectToDatabase();
        const message = await Message.create({
            chatId,
            role,
            content,
        });
        return JSON.parse(JSON.stringify(message));
    } catch (error) {
        console.error("Error saving message:", error);
        throw error;
    }
}
