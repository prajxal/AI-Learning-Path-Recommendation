const BACKEND_URL = "https://ai-learning-backend-2stp.onrender.com";

export async function getUserSkills() {
    console.log("Token:", localStorage.getItem("access_token"));

    const response = await fetch(`${BACKEND_URL}/users/me/skills`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json"
        }
    });

    console.log("Response status:", response.status);

    const text = await response.text();
    console.log("Response body:", text);

    if (!response.ok) throw new Error(text);

    return JSON.parse(text);
}
