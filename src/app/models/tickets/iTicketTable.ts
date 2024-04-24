import { Priorities, Status } from "src/app/utilities/enum";

export interface iTicketTable {
    id: number,
    title: string,
    name: string,
    email: string,
    timestamp: string,
    priority: Priorities,
    status: Status,
    techName: string,
    hasNewMessages: boolean
}