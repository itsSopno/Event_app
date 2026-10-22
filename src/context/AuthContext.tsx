"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { api } from "@/lib/api";

export interface User {
    id: string;
    name: string;
    email: string;
    role: "organizer" | "volunteer";
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (
        name: string,
        email: string,
        password: string,
        role: "organizer" | "volunteer"
    ) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const data = await api.post<{ data: { token: string; user: User } }>(
            "/api/auth/login",
            { email, password }
        );
        const { token: t, user: u } = data.data;
        localStorage.setItem("token", t);
        localStorage.setItem("user", JSON.stringify(u));
        setToken(t);
        setUser(u);
    };

    const register = async (
        name: string,
        email: string,
        password: string,
        role: "organizer" | "volunteer"
    ) => {
        const data = await api.post<{ data: { token: string; user: User } }>(
            "/api/auth/register",
            { name, email, password, role }
        );
        const { token: t, user: u } = data.data;
        localStorage.setItem("token", t);
        localStorage.setItem("user", JSON.stringify(u));
        setToken(t);
        setUser(u);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
