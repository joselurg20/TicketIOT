import { TMessageDTO } from "./TMessageDTO";
import { TicketDto } from "./TicketDTO";

export interface TicketCreationDTO {
    TicketDTO: TicketDto,
    MessageDTO: TMessageDTO
}