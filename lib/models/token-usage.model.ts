import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITokenUsage extends Document {
    userId: string;
    chatId: mongoose.Types.ObjectId;
    tokens: number;
    createdAt: Date;
}

const TokenUsageSchema: Schema = new Schema(
    {
        userId: { type: String, required: true, index: true },
        chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
        tokens: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const TokenUsage: Model<ITokenUsage> = mongoose.models.TokenUsage || mongoose.model<ITokenUsage>('TokenUsage', TokenUsageSchema);

export default TokenUsage;
