import { Priorities, Status } from "src/app/utilities/enum";

export interface iTicketTableSM {
    id: number,
    title: string,
    name: string,
    email: string,
    timestamp: string,
    priority: Priorities,
    status: Status,
    techName: string,
    techId: number,
    hasNewMessages: boolean,
    newMessagesCount: number
}