import { useEffect, useState } from "react";
import { getUserSkills, SkillProfile } from "../services/userApi";

export function useUserSkills(userId: string | null) {
    const [skills, setSkills] = useState<SkillProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        getUserSkills(userId)
            .then(setSkills)
            .catch(() => setError("Failed to load skills"))
            .finally(() => setLoading(false));
    }, [userId]);

    return { skills, loading, error };
}
