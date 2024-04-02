import { iMessage } from "./iMessage";

export interface iTicketDescriptor {
    id: number,
    title: string,
    name: string,
    email: string,
    timestamp: string,
    priority: string,
    state: string,
    userId: number,
    userName: string
}