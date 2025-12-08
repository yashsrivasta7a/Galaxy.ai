import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChat extends Document {
    userId: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
}

const ChatSchema: Schema = new Schema(
    {
        userId: { type: String, required: true, index: true }, // Clerk ID
        title: { type: String, required: true },
    },
    { timestamps: true }
);

const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);

export default Chat;
