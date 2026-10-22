import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export interface Event {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    category: string;
    maxCapacity: number;
    registeredCount: number;
    requiredSkills: string[];
    registrationDeadline: string;
    status: "draft" | "published" | "closed" | "completed";
    organizer: { _id: string; name: string; email: string } | string;
    image?: string;
    availableSlots: number;
    isFull: boolean;
    createdAt: string;
}

export interface UseEventsOptions {
    /** Only fetch published events by default */
    status?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
    /** Auto-fetch on mount (default: true) */
    autoFetch?: boolean;
}

interface ApiResponse {
    data: Event[];
    pagination?: {
        total: number;
        page: number;
        pages: number;
        limit: number;
    };
}

export function useEvents(options: UseEventsOptions = {}) {
    const {
        status = "published",
        category,
        search,
        page = 1,
        limit = 12,
        autoFetch = true,
    } = options;

    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<ApiResponse["pagination"]>(undefined);

    const buildQuery = useCallback(() => {
        const params = new URLSearchParams();
        if (status) params.set("status", status);
        if (category) params.set("category", category);
        if (search) params.set("search", search);
        params.set("page", String(page));
        params.set("limit", String(limit));
        return params.toString();
    }, [status, category, search, page, limit]);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const query = buildQuery();
            const res = await api.get<ApiResponse>(`/api/events?${query}`);
            setEvents(res.data);
            if (res.pagination) setPagination(res.pagination);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch events");
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, [buildQuery]);

    useEffect(() => {
        if (autoFetch) fetchEvents();
    }, [autoFetch, fetchEvents]);

    return {
        events,
        loading,
        error,
        pagination,
        refetch: fetchEvents,
    };
}

/** Fetch a single event by ID — no auth required */
export function useEvent(id: string | null) {
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setError(null);
        api.get<{ data: Event }>(`/api/events/${id}`)
            .then((res) => setEvent(res.data))
            .catch((err) => setError(err instanceof Error ? err.message : "Failed to fetch event"))
            .finally(() => setLoading(false));
    }, [id]);

    return { event, loading, error };
}
