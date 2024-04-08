export interface iTicketTableSM {
    id: number,
    title: string,
    name: string,
    email: string,
    timestamp: string,
    priority: string,
    state: string,
    techName: string,
    techId: number,
    hasNewMessages: boolean,
    newMessagesCount: number
}