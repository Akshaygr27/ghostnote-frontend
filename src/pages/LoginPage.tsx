import { useState } from "react";
import type { FormEvent } from "react";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import api from "../api/axios";

import { useAuthStore } from "../store/authStore";
import { getApiErrorMessage } from "../utils/apiError";

import type {
    TokenResponse,
    User
} from "../types/auth";

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const setAuth = useAuthStore((state) => state.setAuth);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const registrationMessage = (
        location.state as { message?: string } | null
    )?.message;

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const formData = new URLSearchParams();

            formData.append("username", username);
            formData.append("password", password);

            const tokenResponse = await api.post<TokenResponse>(
                "/auth/login",
                formData,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );

            const token = tokenResponse.data.access_token;

            const userResponse = await api.get<User>(
                "/auth/me",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setAuth(token, userResponse.data);

            const from = (
                location.state as {
                    from?: { pathname?: string }
                } | null
            )?.from?.pathname;

            navigate(from || "/messages", {
                replace: true
            });

        } catch (error) {
            clearAuth();

            setError(
                getApiErrorMessage(
                    error,
                    "Login failed. Please check your credentials."
                )
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <h1>Login</h1>

            {registrationMessage && (
                <p>{registrationMessage}</p>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">
                        Username or Email
                    </label>

                    <input
                        id="username"
                        value={username}
                        onChange={(event) =>
                            setUsername(event.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />
                </div>

                {error && <p>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </main>
    );
}

export default LoginPage;