import axios from "axios";

export function getApiErrorMessage(
    error: unknown,
    fallback: string
): string {
    if (axios.isAxiosError(error)) {
        const message =
            error.response?.data?.message ??
            error.response?.data?.detail;

        if (typeof message === "string") {
            return message;
        }
    }

    return fallback;
}