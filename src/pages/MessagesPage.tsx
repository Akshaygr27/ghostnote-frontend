import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import api from "../api/axios";

import type { Message, LikeResponse } from "../types/message";
import { getApiErrorMessage } from "../utils/apiError";

const PAGE_SIZE = 10;

function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);

    const [likingMessageIds, setLikingMessageIds] = useState<Set<string>>(
        new Set()
    );

    const [content, setContent] = useState("");

    const [page, setPage] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);

    const [hasNext, setHasNext] = useState(false);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");

    // Fetch messages
    useEffect(() => {
        let cancelled = false;

        const fetchMessages = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await api.get<Message[]>(
                    "/messages",
                    {
                        params: {
                            limit: PAGE_SIZE + 1,
                            offset: page * PAGE_SIZE
                        }
                    }
                );

                if (!cancelled) {
                    setMessages(
                        response.data.slice(0, PAGE_SIZE)
                    );

                    setHasNext(
                        response.data.length > PAGE_SIZE
                    );
                }

            } catch (error) {
                if (!cancelled) {
                    setError(
                        getApiErrorMessage(
                            error,
                            "Unable to load messages"
                        )
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchMessages();

        return () => {
            cancelled = true;
        };
    }, [page, refreshKey]);

    // Add new message
    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!content.trim()) {
            setError("Message cannot be empty");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            await api.post("/messages", {
                content: content.trim()
            });

            setContent("");
            setPage(0);
            setRefreshKey((previous) => previous + 1);

        } catch (error) {
            setError(
                getApiErrorMessage(
                    error,
                    "Unable to create message"
                )
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleLike = async (messageId: string) => {
        const message = messages.find(
            (item) => item.id === messageId
        );

        if (
            message?.liked_by_current_user ||
            likingMessageIds.has(messageId)
        ) {
            return;
        }

        setLikingMessageIds((previous) => {
            const updated = new Set(previous);
            updated.add(messageId);
            return updated;
        });

        try {
            const response = await api.post<LikeResponse>(
                `/messages/${messageId}/like`
            );

            setMessages((previous) =>
                previous.map((message) =>
                    message.id === messageId
                        ? {
                            ...message,
                            likes_count: response.data.likes_count,
                            liked_by_current_user: response.data.liked
                        }
                        : message
                )
            );

        } catch (error) {
            setError(
                getApiErrorMessage(error, "Unable to like message")
            );
        } finally {
            setLikingMessageIds((previous) => {
                const updated = new Set(previous);
                updated.delete(messageId);
                return updated;
            });
        }
    };

    return (
        <main>
            <h1>Messages</h1>

            {/* Add new message */}

            <section>
                <h2>Add New Message</h2>

                <form onSubmit={handleSubmit}>
                    <textarea
                        value={content}
                        onChange={(event) =>
                            setContent(event.target.value)
                        }
                        placeholder="Write your anonymous message..."
                        maxLength={2000}
                        required
                    />

                    <button
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting
                            ? "Submitting..."
                            : "Submit Message"}
                    </button>
                </form>
            </section>

            {/* Message listing */}

            <section>
                <h2>All Messages</h2>

                {error && <p>{error}</p>}

                {loading ? (
                    <p>Loading messages...</p>
                ) : messages.length === 0 ? (
                    <p>No messages found.</p>
                ) : (
                    <ul>
                        {messages.map((message) => (
                            <li key={message.id}>
                                <p>{message.content}</p>

                                <p>
                                    {message.is_anonymous
                                        ? "Anonymous"
                                        : "User"}
                                </p>

                                <p>
                                    {new Date(
                                        message.created_at
                                    ).toLocaleString()}
                                </p>

                                <div>
                                    <span>
                                        Likes: {message.likes_count}
                                    </span>

                                    <button
                                        type="button"
                                        disabled={
                                            message.liked_by_current_user ||
                                            likingMessageIds.has(message.id)
                                        }
                                        onClick={() => handleLike(message.id)}
                                    >
                                        {likingMessageIds.has(message.id)
                                            ? "Liking..."
                                            : message.liked_by_current_user
                                                ? "❤️ Liked"
                                                : "🤍 Like"}
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Pagination */}

            <section>
                <button
                    disabled={page === 0 || loading}
                    onClick={() =>
                        setPage((previous) => previous - 1)
                    }
                >
                    Previous
                </button>

                <span>
                    Page {page + 1}
                </span>

                <button
                    disabled={!hasNext || loading}
                    onClick={() =>
                        setPage((previous) => previous + 1)
                    }
                >
                    Next
                </button>
            </section>
        </main>
    );
}

export default MessagesPage;