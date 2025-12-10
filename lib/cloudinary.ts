import { v2 as cloudinary } from 'cloudinary';
import { currentUser } from '@clerk/nextjs/server';
import { CloudinaryResponse } from '@/types/types';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export const uploadFile = async (file: File) => {
    const user = await currentUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<CloudinaryResponse>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                resource_type: "auto",
                folder: "chatgpt-uploads",
                secure: true
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                else resolve(result as CloudinaryResponse);
            }
        ).end(buffer);
    });
};
