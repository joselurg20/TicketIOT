export const translations = {
    en: {
        welcome: "Welcome",
        login: "Login",
        logout: "Logout"
    },
    es: {
        welcome: "Bienvenido",
        login: "Iniciar sesión",
        logout: "Cerrar sesión"
    }
};

export const appConfig = {
    apiEndpoint: "http://localhost:4200",
    timeout: 5000,
    maxRetries: 3
};

export const statusCodes = {
    200: "OK",
    404: "Not Found",
    500: "Internal Server Error"
};

export const userRoles = {
    admin: {
        canEdit: true,
        canDelete: true,
        canView: true
    },
    user: {
        canEdit: false,
        canDelete: false,
        canView: true
    }
};

