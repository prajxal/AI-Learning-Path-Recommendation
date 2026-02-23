const API_BASE = "http://localhost:8000";

export async function signup(email: string, password: string) {
    try {
        const res = await fetch(`${API_BASE}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.detail || `Signup failed: ${res.status}`);
        }

        localStorage.setItem("access_token", data.access_token);

        return data;
    } catch (error: any) {
        console.error("Signup error:", error);
        if (error.message.includes("Failed to fetch")) {
            throw new Error("Cannot connect to server. Is the backend running on port 8000?");
        }
        throw error;
    }
}

export async function login(email: string, password: string) {
    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.detail || `Login failed: ${res.status}`);
        }

        localStorage.setItem("access_token", data.access_token);

        return data;
    } catch (error: any) {
        console.error("Login error:", error);
        throw new Error(error.message || "Failed to connect to server. Make sure backend is running on port 8000");
    }
}

export function getToken() {
    return localStorage.getItem("access_token");
}

export function logout() {
    localStorage.removeItem("access_token");
}
