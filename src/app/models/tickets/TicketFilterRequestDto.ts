

export interface TicketFilterRequestDto {
    state: number,
    priority: number,
    userId: number,
    start: Date,
    end: Date
}