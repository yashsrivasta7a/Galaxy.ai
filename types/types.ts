import { UIToolInvocation } from "ai";

export interface MessagePartText {
  type: "text";
  text: string;
}

export interface MessagePartFile {
  type: "file";
  filename: string;
  mediaType: string;
  url: string; // base64 or remote URL
}

export interface MessagePartImage {
  type: "input_image";
  image_url: string;
}

export interface MessagePartTool {
  type: "tool-invocation";
  toolInvocation: UIToolInvocation<any>;
}

export type MessagePart =
  | MessagePartText
  | MessagePartFile
  | MessagePartImage
  | MessagePartTool;

export interface Message {
  id: string;
  role: "system" | "user" | "assistant" | "data" | "tool";
  content?: string; // optional when using parts
  parts?: MessagePart[];
  toolInvocations?: UIToolInvocation<any>[];
  createdAt?: Date;
  partsRef?: any;
}

export interface CloudinaryResponse {
  public_id: string;
  [key: string]: any; // allow dynamic fields like width, height, url, secure_url, etc.
}
