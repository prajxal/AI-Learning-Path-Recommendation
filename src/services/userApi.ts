const BACKEND_URL = "http://localhost:8000";

export interface SkillProfile {
    roadmap_id: string;
    trust_score: number;
    proficiency_level: number;
    completed_courses: number;
    total_courses: number;
    progress_percent: number;
    last_updated: string;
}

export async function getUserSkills(userId: string): Promise<SkillProfile[]> {
    const res = await fetch(`${BACKEND_URL}/users/${userId}/skills`);
    if (!res.ok) throw new Error("Failed to fetch skills");
    const data = await res.json();
    return data.skills;
}
