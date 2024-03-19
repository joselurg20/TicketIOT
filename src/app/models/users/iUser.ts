import { iTicket } from "../tickets/iTicket";

export interface iUser {
    id?: number,
    userName: string,
    email: string,
    phoneNumber: string,
    role: string,
    tickets?: iTicket[]
}