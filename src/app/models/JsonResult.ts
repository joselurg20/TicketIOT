import { iAttachment } from "./attachments/iAttachment";
import { iMessage } from "./tickets/iMessage";
import { iTicket } from "./tickets/iTicket";
import { iUser } from "./users/iUser";

// Interfaces para la respuesta del servidor.

export interface UserJsonResult {
    result: iUser[]
}

export interface TicketJsonResult {
    $values: iTicket[]
}

/**
 * Respuesta de filtrado de incidencias.
 */
export interface FilterTicketJsonResult {
    tickets: InnerFilterTicketJsonResult
}

/**
 * Objeto interno de la respuesta de filtrado de incidencias.
 */
export interface InnerFilterTicketJsonResult {
    $values: iTicket[]
}

export interface MessageJsonResult {
    $values: iMessage[]
}

export interface AttachmentJsonResult {
    $values: iAttachment[]
}