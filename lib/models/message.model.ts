import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
    chatId: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema = new Schema(
    {
        chatId: { type: String, ref: 'Chat', required: true, index: true },
        role: { type: String, enum: ['user', 'assistant'], required: true },
        content: { type: String, required: true },
    },
    { timestamps: true }
);

// Prevent mongoose from creating the model if it already exists to avoid OverwriteModelError,
// BUT for dev hot reloading with schema changes, we might want to delete it.
// Ideally, just restarting the server fixes this. 
// However, implementing a safer 'delete' for dev environment:
if (process.env.NODE_ENV === 'development') {
    if (mongoose.models.Message) {
        delete mongoose.models.Message;
    }
}

const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
