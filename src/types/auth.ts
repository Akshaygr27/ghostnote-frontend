export interface User {
    id: string;
    username: string;
    email: string;
    created_at: string;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
}

export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
}