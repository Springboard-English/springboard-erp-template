export declare function configureApi(options: {
    baseUrl: string;
}): void;
export declare const API_CONFIG: {
    readonly baseURL: string;
    readonly endpoints: {
        readonly login: "/login/password";
        readonly authenticateGoogle: "/authenticate/google";
        readonly currentUser: "/users/me";
        readonly refresh: "/refresh";
        readonly logout: "/logout";
        readonly resetPassword: "/reset/password";
        readonly resetPasswordAuthorised: "/authenticate/reset";
    };
};
export declare function getEndpoint(endpoint: keyof typeof API_CONFIG.endpoints): string;
