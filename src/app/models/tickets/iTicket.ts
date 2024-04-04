import { iMessage } from "./iMessage";
import { iUser } from "../users/iUser";

export interface iTicket {
    id?: string | number,
    title: string,
    name: string,
    email: string,
    timestamp: string,
    user: iUser,
    priority: string,
    state: string,
    hasNewMessages: boolean,
    messages: iMessage[]
}