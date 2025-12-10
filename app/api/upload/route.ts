import { uploadFile } from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const result = await uploadFile(file);
    const secureUrl = result.url?.replace('http://', 'https://') || result.secure_url;
    return NextResponse.json({
      success: true, result: {
        ...result,
        url: secureUrl
      }
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
