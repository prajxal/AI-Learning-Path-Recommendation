export interface Course {
  id: string;
  title: string;
  roadmap_id: string;
  difficulty_level: number | null;
}

import BACKEND_URL from "./api";

export async function getCourses(limit: number = 100): Promise<Course[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/courses?limit=${limit}`);

    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}
