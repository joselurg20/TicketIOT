import { AttachmentJsonResult } from "../JsonResult";
import { iAttachment } from "../attachments/iAttachment";

export interface iMessageDto {
    id: number;
    author: string;
    content: string;
    timestamp: string;
    attachmentPaths: string[];
    attachments: iAttachment[];
    ticketID: number;
  }