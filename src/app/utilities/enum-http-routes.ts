export enum Users {
    getUsers = '/Users/users/getall',
    getUserById = '/Users/users/getbyid/',
    getTechnicians = '/Users/users/gettechnicians',
    checkEmail = '/Users/users/sendemail/',
    resetPassword = '/Users/users/resetpassword'
}

export enum Tickets {
    getTickets = '/tickets/getall',
    getTicketsWithNames = '/tickets/getallwithnames',
    filterTickets = '/tickets/getallfilter',
    createTicket = '/tickets/create',
    getTicketsByUser = '/tickets/getbyuser/',
    getTicketsByUserWithNames = '/tickets/getbyuserwithnames/',
    getTicketById = '/tickets/getbyid/',
    getTicketByIdWithName = '/tickets/getbyidwithname/',
    assignTechnician = '/tickets/asign/',
    updateTicket = '/tickets/update/',
    changeTicketPriority = '/tickets/changepriority/',
    changeTicketStatus = '/tickets/changestatus/'
}

export enum Messages {
    getByTicket = '/messages/getbyticket/',
    downloadAttachment = '/messages/download/',
    createMessage = '/messages/create'
}