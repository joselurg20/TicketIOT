import { Priorities, Status } from "src/app/utilities/enum";

export interface iTicket {
    id: number,
    title: string,
    name: string,
    email: string,
    timestamp: string,
    userId: number
    priority: Priorities,
    status: Status,
    hasNewMessages: boolean,
    newMessagesCount: number
}