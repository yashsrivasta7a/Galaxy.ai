import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
    chatId: mongoose.Types.ObjectId;
    role: 'user' | 'assistant' ;
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema = new Schema(
    {
        chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true, index: true },
        role: { type: String, enum: ['user', 'assistant'], required: true },
        content: { type: String, required: true },
    },
    { timestamps: true }
);

const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
