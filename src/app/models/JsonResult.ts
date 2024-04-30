import { JsonObject } from "@angular-devkit/core";
import { iMessage } from "./tickets/iMessage";
import { iTicket } from "./tickets/iTicket";
import { iUser } from "./users/iUser";

export interface UserJsonResult {
    result: iUser[]
}

export interface TicketJsonResult {
    $values: iTicket[]
}

export interface FilterTicketJsonResult {
    tickets: InnerFilterTicketJsonResult
}

export interface InnerFilterTicketJsonResult {
    $values: iTicket[]
}

export interface MessageJsonResult {
    result: iMessage[]
}