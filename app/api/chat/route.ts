import {
    convertToModelMessages,
    streamText,
    type UIMessage,
} from "ai";
import { openrouter } from "@/lib/openrouter";
import { openai } from "@ai-sdk/openai";
import { auth, currentUser } from "@clerk/nextjs/server";
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import PDFParser from 'pdf2json';
import { createChat, saveMessage, getChat } from "@/lib/db/actions/chat.actions";
import { client } from "@/lib/mem0";
import { getSystemPrompt } from "@/lib/prompts/system";
import { Message } from "@/types/types";


async function parsePDF(buffer: Buffer): Promise<{ text: string; numpages: number }> {
    return new Promise((resolve, reject) => {
        const pdfParser = new (PDFParser as any)(null, 1);

        pdfParser.on('pdfParser_dataError', (errData: any) => {
            reject(new Error(errData.parserError));
        });

        pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
            try {
                let text = '';
                const pages = pdfData.Pages || [];

                pages.forEach((page: any) => {
                    const texts = page.Texts || [];
                    texts.forEach((textItem: any) => {
                        if (textItem.R && textItem.R[0] && textItem.R[0].T) {
                            text += decodeURIComponent(textItem.R[0].T) + ' ';
                        }
                    });
                    text += '\n';
                });

                resolve({
                    text: text.trim(),
                    numpages: pages.length
                });
            } catch (error) {
                reject(error);
            }
        });

        pdfParser.parseBuffer(buffer);
    });
}
export const maxDuration = 30;

// File size limits (in bytes)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_PDF_SIZE = 20 * 1024 * 1024; // 20MB for PDFs

// Supported file types
const SUPPORTED_FILE_TYPES = {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    pdf: ['application/pdf'],
    word: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'],
    excel: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
    text: ['text/plain', 'text/csv', 'application/json', 'text/javascript', 'text/typescript', 'text/xml', 'text/html', 'text/css']
};

async function processAttachment(att: any) {
    try {

        let fileUrl = att.url;
        if (fileUrl.startsWith('http://res.cloudinary.com')) {
            fileUrl = fileUrl.replace('http://', 'https://');

        }

        // For Cloudinary PDFs, fl_attachment flag to bypass delivery restrictions
        if (fileUrl.includes('cloudinary.com') && att.contentType?.includes('pdf')) {
            fileUrl = fileUrl.replace('/upload/', '/upload/fl_attachment/');

        }

        if (att.contentType?.startsWith('image/')) {
            return {
                type: 'image',
                image: new URL(att.url),
            };
        }

        const response = await fetch(fileUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });


        if (!response.ok) {

            throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();

        if (!arrayBuffer || arrayBuffer.byteLength === 0) {
            throw new Error('Received empty file data');
        }

        const buffer = Buffer.from(arrayBuffer);


        if (buffer.length > MAX_FILE_SIZE && !att.contentType?.includes('pdf')) {
            return { type: 'text', text: `[Error: File ${att.name} exceeds size limit (10MB)]` };
        }

        if (att.contentType?.includes('pdf')) {
            console.log(`Processing PDF: ${att.name}`);
            if (buffer.length > MAX_PDF_SIZE) {
                return { type: 'text', text: `[Error: PDF ${att.name} exceeds size limit (20MB)]` };
            }

            try {
                const data = await parsePDF(buffer);
                if (data.text.trim().length < 100 && data.numpages > 1) {
                    return {
                        type: 'text',
                        text: `[PDF ${att.name}: This appears to be a scanned PDF with limited text extraction. Only ${data.text.trim().length} characters extracted from ${data.numpages} pages. OCR processing may be needed for better results.]`
                    };
                }

                return {
                    type: 'text',
                    text: `[PDF Content: ${att.name} (${data.numpages} pages)]\n\n${data.text}`
                };
            } catch (pdfError: any) {
                console.error(`PDF parsing error for ${att.name}:`, pdfError);
                return {
                    type: 'text',
                    text: `[Error: Could not parse PDF ${att.name}. The file may be corrupted or password-protected. Error: ${pdfError.message}]`
                };
            }
        }

        if (att.contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.extractRawText({ buffer });
            return {
                type: 'text',
                text: `[Word Document: ${att.name}]\n\n${result.value}`
            };
        }

        if (att.contentType?.includes('spreadsheet') || att.contentType?.includes('excel')) {
            const workbook = XLSX.read(buffer, { type: 'buffer' });
            let excelContent = '';

            workbook.SheetNames.forEach((sheetName) => {
                const sheet = workbook.Sheets[sheetName];
                const csvData = XLSX.utils.sheet_to_csv(sheet);
                excelContent += `\n--- Sheet: ${sheetName} ---\n${csvData}\n`;
            });

            return {
                type: 'text',
                text: `[Excel File: ${att.name} (${workbook.SheetNames.length} sheets)]\n${excelContent}`
            };
        }

        if (
            att.contentType?.includes('text') ||
            att.contentType?.includes('json') ||
            att.contentType?.includes('javascript') ||
            att.contentType?.includes('typescript') ||
            att.contentType?.includes('xml') ||
            att.contentType?.includes('html') ||
            att.contentType?.includes('css')
        ) {
            const text = buffer.toString('utf-8');
            return {
                type: 'text',
                text: `[File Content: ${att.name}]\n\n${text}`
            };
        }

        if (att.contentType?.startsWith('image/')) {
            return {
                type: 'image',
                image: new URL(att.url),
            };
        }

        return {
            type: 'text',
            text: `[Unsupported File: ${att.name} (${att.contentType}) - This file type cannot be processed. Supported formats: PDF, Word (.docx), Excel (.xlsx), images, and text files.]`
        };

    } catch (error: any) {
        return {
            type: 'text',
            text: `[Error processing file ${att.name}: ${error.message}]`
        };
    }
}

export async function POST(req: Request) {
    try {
        const json = await req.json();

        const { messages: incomingMessages, chatId: incomingChatId }: { messages: Message[]; chatId?: string } =
            json;

        // Keep only the last 20 messages to maintain immediate context
        // and prevent hitting token limits.
        const recentMessages = incomingMessages.slice(-20);
        const messages = recentMessages;

        if (!messages || messages.length === 0) {
            return new Response("Missing messages", { status: 400 });
        }

        let chatId = incomingChatId;

        const { userId } = await auth();
        if (!userId) return new Response("Unauthorized", { status: 401 });

        const last = messages[messages.length - 1];
        let lastUserText = last.content || "";
        if (!lastUserText && Array.isArray(last.parts)) {
            const textPart = last.parts.find((p) => p.type === "text");
            if (textPart && 'text' in textPart) {
                lastUserText = textPart.text;
            }
        }

        const firstMessage = messages[0];
        let title = firstMessage.content?.trim();
        if (!title || title.length === 0) title = "New Chat"
        if ((!firstMessage.content || firstMessage.content === "") && Array.isArray(firstMessage.parts)) {
            const textPart = firstMessage.parts.find((p) => p.type === "text");
            if (textPart && 'text' in textPart) {
                title = textPart.text;
            }
        }

        if (chatId) {
            const chat = await getChat(chatId);
            if (!chat) {
                await createChat(userId, title.slice(0, 50), chatId);
            }
        } else {
            const chat = await createChat(userId, title.slice(0, 50));
            chatId = chat._id;
        }

        let messageParts: any[] = last.parts ? [...last.parts] : [];
        const attachments = (last as any).experimental_attachments;

        if (attachments && Array.isArray(attachments)) {
            attachments.forEach((att: any) => {
                if (att.contentType?.startsWith('image/')) {
                    messageParts.push({
                        type: 'image',
                        url: att.url,
                        name: att.name,
                        contentType: att.contentType
                    });
                } else {
                    messageParts.push({
                        type: 'file',
                        url: att.url,
                        name: att.name,
                        contentType: att.contentType
                    });
                }
            });
        }

        await saveMessage(chatId!, "user", lastUserText, messageParts);

        const mem0Messages = messages
            .filter((m) => m.role === "user" || m.role === "assistant")
            .map((m) => {
                let content = m.content || "";
                if (!content && Array.isArray(m.parts)) {
                    const textPart = m.parts.find((p) => p.type === "text");
                    if (textPart && 'text' in textPart) {
                        content = textPart.text;
                    }
                }
                return {
                    role: m.role as "user" | "assistant",
                    content: content || "",
                };
            });

        try {
            await client.add(mem0Messages, { user_id: userId });
        } catch (error) {
            console.error("Mem0 Add Error:", error);
        }

        let memories: any[] = [];
        if (lastUserText) {
            try {
                console.log("Searching mem0 for:", lastUserText);
                const res = await client.search(lastUserText, { user_id: userId });
                if (Array.isArray(res)) memories = res;
            } catch (error) {
                console.error("Mem0 Search Error:", error);
            }
        }


        const memoriesText = Array.isArray(memories) ? memories.map((m: any) => m.memory).join("\n") : "";

        const user = await currentUser();
        const userFirst = user?.firstName || undefined;
        const userLast = user?.lastName || undefined;
        const userEmail = user?.emailAddresses?.[0]?.emailAddress || undefined;

        let modelMessages: any[] = [];
        try {
            modelMessages = convertToModelMessages(messages as any);
        } catch (err) {
            console.error("convertToModelMessages failed, using fallback:", err);

            modelMessages = await Promise.all(messages.map(async (m, index) => {
                const parts: any[] = [];

                if (m.content) {
                    parts.push({ type: 'text', text: m.content });
                }

                const isLastMessage = index === messages.length - 1;

                const attachments = (m as any).experimental_attachments;
                if (attachments && Array.isArray(attachments) && isLastMessage) {
                    const attachmentParts = await Promise.all(
                        attachments.map(processAttachment)
                    );
                    parts.push(...attachmentParts);
                } else if (attachments && Array.isArray(attachments)) {
                    console.log(`Skipping ${attachments.length} attachments from previous message ${index}`);
                }

                return {
                    role: m.role,
                    content: parts.length > 0 ? parts : m.content || "",
                };
            }));
        }

        const result = streamText({
            model: openai("gpt-4o"),
            system: getSystemPrompt(
                memoriesText,
                userFirst,
                userLast,
                userEmail
            ),
            messages: modelMessages,
            async onFinish({ text }) {
                await saveMessage(chatId!, "assistant", text);
            },
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error("API /chat Error:", error);
        return new Response(
            JSON.stringify({
                error: "Internal Server Error",
                message: error instanceof Error ? error.message : "Unknown error"
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}