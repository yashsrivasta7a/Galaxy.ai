import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
    chatId: string;
    role: 'user' | 'assistant' | 'system' | 'data' | 'tool';
    content: string;
    parts?: any[];
    createdAt: Date;
}

const MessageSchema: Schema = new Schema(
    {
        chatId: { type: String, ref: 'Chat', required: true, index: true },
        role: { type: String, enum: ['user', 'assistant', 'system', 'data', 'tool'], required: true },
        content: { type: String, default: '' },
        parts: { type: Schema.Types.Mixed }, // Store the `parts` array
    },
    { timestamps: true }
);

// Prevent mongoose from creating the model if it already exists to avoid OverwriteModelError
if (process.env.NODE_ENV === 'development') {
    if (mongoose.models.Message) {
        delete mongoose.models.Message;
    }
}

const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
