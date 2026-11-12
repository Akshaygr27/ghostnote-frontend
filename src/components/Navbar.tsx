import { Link, useNavigate } from "react-router-dom";

import api from "../api/axios";
import { useAuthStore } from "../store/authStore";

function Navbar() {
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
        } catch {
            // Clear the local session even if the API request fails.
        } finally {
            clearAuth();
            navigate("/", { replace: true });
        }
    };

    return (
        <nav>
            <Link to="/">Anonymous Feedback</Link>

            {token ? (
                <>
                    <Link to="/messages">Messages</Link>

                    <span>
                        Welcome, {user?.username}
                    </span>

                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <Link to="/register">Register</Link>

                    <Link to="/login">Login</Link>
                </>
            )}
        </nav>
    );
}

export default Navbar;