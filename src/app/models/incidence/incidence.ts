export interface Incidencia {
    number: string;
    title: string;
    description: string;
    importance: string;
    status: string;
    created: string;
    post: string;
    [key: string]: any; // Índice de firma para permitir acceso de propiedad seguro

}