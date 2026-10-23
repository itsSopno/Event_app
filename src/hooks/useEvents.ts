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

export interface Pagination {
    total: number;
    page: number;
    pages: number;
    limit: number;
}

export interface UseEventsOptions {
    status?: string;
    category?: string;
    search?: string;
    upcoming?: "true" | "false" | "all";
    page?: number;
    limit?: number;
    autoFetch?: boolean;
}

// Backend returns: { success, data: { events: [], pagination: {} } }
interface ApiResponse {
    data: {
        events: Event[];
        pagination: Pagination;
    };
}

export function useEvents(options: UseEventsOptions = {}) {
    const {
        status = "published",
        category,
        search,
        upcoming,
        page = 1,
        limit = 12,
        autoFetch = true,
    } = options;

    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<Pagination | undefined>(undefined);

    const buildQuery = useCallback(() => {
        const params = new URLSearchParams();
        if (status) params.set("status", status);
        if (category) params.set("category", category);
        if (search) params.set("search", search);
        if (upcoming && upcoming !== "all") params.set("upcoming", upcoming);
        params.set("page", String(page));
        params.set("limit", String(limit));
        return params.toString();
    }, [status, category, search, upcoming, page, limit]);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const query = buildQuery();
            const res = await api.get<ApiResponse>(`/api/events?${query}`);
            setEvents(res.data.events ?? []);
            if (res.data.pagination) setPagination(res.data.pagination);
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

    return { events, loading, error, pagination, refetch: fetchEvents };
}

/** Single event — no auth required */
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
