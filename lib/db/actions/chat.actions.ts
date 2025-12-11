"use server";

import Chat from "@/lib/db/models/chat.model";
import Message from "@/lib/db/models/message.model";
import { connectToDatabase } from "@/lib/db";

export async function createChat(userId: string, title?: string, id?: string) {
    try {

        await connectToDatabase();
        const chatData: any = {
            userId,
            title: title || 'New Chat',
        };
        if (id) {
            chatData._id = id;
        } else {
            chatData._id = crypto.randomUUID();
        }
        const chat = await Chat.create(chatData).catch(err => {
            console.log("Chat Create Error:", err);
            throw err;
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

export async function getUserChats(userId: string) {
    try {
        await connectToDatabase();
        const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
        return JSON.parse(JSON.stringify(chats));
    } catch (error) {
        console.error("Error getting user chats:", error);
        throw error;
    }
}

export async function saveMessage(chatId: string, role: string, content: string, parts?: any[]) {
    try {

        await connectToDatabase();
        const message = await Message.create({
            chatId,
            role,
            content,
            parts
        });
        await Chat.findByIdAndUpdate(chatId, { updatedAt: new Date() });
        return JSON.parse(JSON.stringify(message));
    } catch (error) {
        console.error("Error saving message:", error);
        throw error;
    }
}
