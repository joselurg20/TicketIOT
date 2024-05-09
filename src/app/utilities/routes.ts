export enum Routes {
    login = 'login',
    recover = 'recover',
    recover2 = 'recuperar/:hash/:username/:domain/:tld',
    supportManager = 'support-manager',
    supportTechnician = 'support-technician',
    reviewManager = 'review-manager',
    reviewTechnician = 'review-technician',
    incidence = 'incidence',
    cls = 'cls',
    link = 'link/:hashedId/:ticketId',
    notFound = '404'
}