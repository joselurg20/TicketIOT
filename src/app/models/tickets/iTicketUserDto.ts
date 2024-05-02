import { Priorities, Status } from "src/app/utilities/enum";

export interface iTicketUserDto {
    id: number,
    title: string,
    name: string,
    email: string,
    timestamp: string,
    userId: number,
    priority: Priorities,
    status: Status,
    isAssigned: boolean,
    hasNewMessages: boolean,
    newMessagesCount: number,
    fullName: string
}