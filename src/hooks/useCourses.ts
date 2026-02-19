import { useEffect, useState } from "react";
import { getCourses, Course } from "../services/courseApi";

export function useCourses(limit: number = 100) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getCourses(limit);
        setCourses(data);
      } catch (err) {
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [limit]);

  return { courses, loading, error };
}
