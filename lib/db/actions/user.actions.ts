"use server";

import User from "@/lib/db/models/user.model";
import { connectToDatabase } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
export async function createUser(user: {
    clerkId: string;
    email: string;
    name?: string;
    image?: string;
}) {
    try {
        await connectToDatabase();
        console.log("Mongoose connection established in createUser");
        const newUser = await User.findOneAndUpdate(
            { clerkId: user.clerkId },
            user,
            { upsert: true, new: true }
        );
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
