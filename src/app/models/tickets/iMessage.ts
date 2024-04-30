import { AttachmentJsonResult } from "../JsonResult";
import { iAttachment } from "../attachments/iAttachment";

export interface iMessage {
    id: number;
    author: string;
    content: string;
    timestamp: string;
    attachmentPaths: AttachmentJsonResult;
    attachments: iAttachment[];
    ticketID: number;
  }