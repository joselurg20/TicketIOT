import { Priorities, Status } from "src/app/utilities/enum";

export interface iTicketGraph {
    userId: number;
    status: Status;
    priority: Priorities;
}