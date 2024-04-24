import { iMessage } from "./iMessage";
import { iUser } from "../users/iUser";
import { Priorities, Status } from "src/app/utilities/enum";

export interface iTicket {
    id?: string | number,
    title: string,
    name: string,
    email: string,
    timestamp: string,
    user: iUser,
    priority: Priorities,
    status: Status,
    hasNewMessages: boolean,
    messages: iMessage[]
}