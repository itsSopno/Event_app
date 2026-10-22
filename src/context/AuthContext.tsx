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
    role: "organizer" | "volunteer" | "public";
    profileCompleted: boolean;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    completeProfile: (data: ProfileData) => Promise<void>;
    logout: () => void;
}

export interface ProfileData {
    role: "organizer" | "volunteer" | "public";
    bio?: string;
    skills?: string;
    interests?: string;
    avatar?: string;
    location?: string;
    phone?: string;
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

    const persistAuth = (t: string, u: User) => {
        localStorage.setItem("token", t);
        localStorage.setItem("user", JSON.stringify(u));
        setToken(t);
        setUser(u);
    };

    const login = async (email: string, password: string) => {
        const data = await api.post<{ data: { token: string; user: User } }>(
            "/api/auth/login",
            { email, password }
        );
        persistAuth(data.data.token, data.data.user);
    };

    const register = async (name: string, email: string, password: string) => {
        const data = await api.post<{ data: { token: string; user: User } }>(
            "/api/auth/register",
            { name, email, password }
        );
        persistAuth(data.data.token, data.data.user);
    };

    const completeProfile = async (profileData: ProfileData) => {
        const data = await api.post<{ data: { token: string; user: User } }>(
            "/api/auth/complete-profile",
            profileData
        );
        persistAuth(data.data.token, data.data.user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, completeProfile, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
