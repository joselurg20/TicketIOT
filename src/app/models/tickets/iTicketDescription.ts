import { Priorities, Status } from "src/app/utilities/enum";

export interface iTicketDescriptor {
    id: number,
    title: string,
    name: string,
    email: string,
    timestamp: string,
    priority: Priorities,
    status: Status,
    userId: string,
    userName: string
}