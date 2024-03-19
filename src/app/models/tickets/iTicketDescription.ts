import { iMessage } from "./iMessage";

export interface iTicketDescriptor {
    id: number,
    title: string,
    name: string,
    email: string,
    timestamp: string,
    priority: string,
    state: string,
    userID: number,
    userName: string,
    messages: iMessage[]
}