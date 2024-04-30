import { iAttachment } from "../attachments/iAttachment";

export interface iMessage {
    id: number;
    author: string;
    content: string;
    timestamp: string;
    attachmentPaths: string[];
    attachments: iAttachment[];
    ticketID: number;
  }