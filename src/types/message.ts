export interface Message {
    id: string;
    content: string;
    is_anonymous: boolean;
    likes_count: number;
    created_at: string;
    liked_by_current_user: boolean;
}

export interface LikeResponse {
    message_id: string;
    likes_count: number;
    liked: boolean;
    already_liked: boolean;
}