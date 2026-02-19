import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

type Course = {
  id: string;
  title: string;
  roadmap_id: string;
  difficulty_level: number | null;
  description?: string | null;
};

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (!courseId) return;

    fetch(`http://localhost:8000/courses/${courseId}`)
      .then((res) => res.json())
      .then(setCourse)
      .catch(() => setCourse(null));
  }, [courseId]);

  if (!course) {
    return <div className="space-y-6">Loading course...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1>{course.title}</h1>
        <p className="text-muted-foreground">{course.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-[6px] border border-border p-4 bg-card">
          <p className="text-sm text-muted-foreground">Roadmap</p>
          <p className="font-medium">{course.roadmap_id}</p>
        </div>
        <div className="rounded-[6px] border border-border p-4 bg-card">
          <p className="text-sm text-muted-foreground">Difficulty</p>
          <p className="font-medium">{course.difficulty_level}</p>
        </div>
        <div className="rounded-[6px] border border-border p-4 bg-card">
          <p className="text-sm text-muted-foreground">Course ID</p>
          <p className="font-medium">{course.id}</p>
        </div>
      </div>
    </div>
  );
}
