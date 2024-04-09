import { iAttachment } from "../attachments/iAttachment";

export interface iMessage {
    Id: number;
    Author: string;
    Content: string;
    Timestamp: string;
    AttachmentPaths: string[];
    Attachments: iAttachment[];
    ticketID: number;
  }