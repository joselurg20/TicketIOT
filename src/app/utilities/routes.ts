export enum Routes {
    login = 'login',
    recover = 'recover',
    recover2 = 'recover/:hash/:username/:domain/:tld',
    supportManager = 'support-manager',
    supportTechnician = 'support-technician',
    reviewManager = 'review',
    incidence = 'incidence',
    cls = 'cls',
    link = 'link/:hashedId/:ticketId',
    notFound = '404'
}