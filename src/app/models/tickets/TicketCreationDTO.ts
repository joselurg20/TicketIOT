import { TMessageDTO } from "./TMessageDTO";
import { TicketDTO } from "./TicketDTO";

export interface TicketCreationDTO {
    TicketDTO: TicketDTO,
    MessageDTO: TMessageDTO
}