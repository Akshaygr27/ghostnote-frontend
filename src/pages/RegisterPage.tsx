import { useState } from "react";
import type { FormEvent } from "react";

import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import { getApiErrorMessage } from "../utils/apiError";

import type { RegisterPayload } from "../types/auth";

function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<RegisterPayload>({
        username: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await api.post("/auth/register", formData);

            navigate("/login", {
                replace: true,
                state: {
                    message: "Registration successful. Please login."
                }
            });
        } catch (error) {
            setError(
                getApiErrorMessage(
                    error,
                    "Registration failed"
                )
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">
                        Username
                    </label>

                    <input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">
                        Password
                    </label>

                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && <p>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </main>
    );
}

export default RegisterPage;