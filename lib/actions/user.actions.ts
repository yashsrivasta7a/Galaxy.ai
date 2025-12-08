"use server";

import User from "@/lib/models/user.model";
import { connectToDatabase } from "@/lib/db";

export async function createUser(user: {
    clerkId: string;
    email: string;
    name?: string;
    image?: string;
}) {
    try {
        await connectToDatabase();
        const newUser = await User.create(user);
        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}

export async function getUser(clerkId: string) {
    try {
        await connectToDatabase();
        const user = await User.findOne({ clerkId });
        if (!user) {
            throw new Error("User not found");
        }
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
}
