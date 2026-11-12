import { Link } from "react-router-dom";

import { useAuthStore } from "../store/authStore";

function LandingPage() {
    const token = useAuthStore((state) => state.token);

    return (
        <main>
            <h1>GhostNote</h1>

            <p>
                Share your thoughts and express yourself anonymously.
            </p>

            {token ? (
                <Link to="/messages">
                    Explore Messages
                </Link>
            ) : (
                <>
                    <Link to="/register">
                        Get Started
                    </Link>

                    <Link to="/login">
                        Login
                    </Link>
                </>
            )}
        </main>
    );
}

export default LandingPage;