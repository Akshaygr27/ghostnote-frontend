import { useEffect, useState } from "react";

import {
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import api from "./api/axios";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MessagesPage from "./pages/MessagesPage";

import { useAuthStore } from "./store/authStore";

import type { User } from "./types/auth";

function App() {
    const [initializing, setInitializing] = useState(true);

    const setUser = useAuthStore((state) => state.setUser);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    useEffect(() => {
        let active = true;

        const initializeAuth = async () => {
            const token = useAuthStore.getState().token;

            if (!token) {
                setInitializing(false);
                return;
            }

            try {
                const response = await api.get<User>("/auth/me");

                if (active) {
                    setUser(response.data);
                }
            } catch {
                if (active) {
                    clearAuth();
                }
            } finally {
                if (active) {
                    setInitializing(false);
                }
            }
        };

        initializeAuth();

        return () => {
            active = false;
        };
    }, [setUser, clearAuth]);

    if (initializing) {
        return <p>Loading application...</p>;
    }

    return (
        <>
            <Navbar />

            <Routes>
                <Route
                    path="/"
                    element={<LandingPage />}
                />

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

                <Route element={<ProtectedRoute />}>
                    <Route
                        path="/messages"
                        element={<MessagesPage />}
                    />
                </Route>

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
            </Routes>
        </>
    );
}

export default App;