

export interface TicketFilterRequestDto {
    status: number,
    priority: number,
    userId: number,
    start: Date,
    end: Date,
    searchString: string
}