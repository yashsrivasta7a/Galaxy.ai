import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITokenUsage extends Document {
    userId: string;
    chatId: string;
    tokens: number;
    createdAt: Date;
}

const TokenUsageSchema: Schema = new Schema(
    {
        userId: { type: String, required: true, index: true },
        chatId: { type: String, ref: 'Chat', required: true },
        tokens: { type: Number, default: 0 },
    },
    { timestamps: true }
);

if (process.env.NODE_ENV === 'development') {
    if (mongoose.models.TokenUsage) {
        delete mongoose.models.TokenUsage;
    }
}

const TokenUsage: Model<ITokenUsage> = mongoose.models.TokenUsage || mongoose.model<ITokenUsage>('TokenUsage', TokenUsageSchema);

export default TokenUsage;
