import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChat extends Document {
    userId: string;
    title: string;
    isShared: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ChatSchema: Schema = new Schema(
    {
        _id: { type: String, required: true }, // Custom ID from client
        userId: { type: String, required: true, index: true }, // Clerk ID
        title: { type: String, required: true },
        isShared: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Force recompilation for development to pick up schema changes
if (process.env.NODE_ENV === 'development' && mongoose.models.Chat) {
    delete mongoose.models.Chat;
}

const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);

export default Chat;
