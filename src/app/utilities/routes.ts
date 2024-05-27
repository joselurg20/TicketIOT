export enum Routes {
    login = 'login',
    recover = 'recover',
    recover2 = 'recover/:hash/:username/:domain/:tld',
    supportManager = 'manager/support-manager',
    supportTechnician = 'manager/support-technician',
    reviewManager = 'manager/review',
    incidence = 'incidence',
    cls = 'cls',
    link = 'link/:hashedId/:ticketId',
    notFound = '404'
}
