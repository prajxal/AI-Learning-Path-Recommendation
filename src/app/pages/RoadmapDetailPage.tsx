import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { useProgress } from "../hooks/useProgress";

interface Course {
    id: string;
    title: string;
    difficulty_level: number;
}

const BACKEND_URL = "http://localhost:8000";

export default function RoadmapDetailPage() {
    const { roadmapId } = useParams();
    const userId = localStorage.getItem("user_id") || "1";

    const { getRoadmapProgress, getCourseProgress } = useProgress();

    const [courses, setCourses] = useState<Course[]>([]);
    const [coursesLoading, setCoursesLoading] = useState(true);

    useEffect(() => {
        async function loadCourses() {
            try {
                const res = await fetch(
                    `${BACKEND_URL}/courses?roadmap_id=${roadmapId}`
                );
                if (!res.ok) throw new Error("Failed to fetch courses");
                const data = await res.json();
                setCourses(data);
            } catch (err) {
                console.error(err);
            } finally {
                setCoursesLoading(false);
            }
        }

        if (roadmapId) {
            loadCourses();
        }
    }, [roadmapId]);

    if (coursesLoading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-1/4 bg-gray-200 animate-pulse rounded mb-8"></div>
                <div className="h-32 bg-gray-100 animate-pulse rounded-xl mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    const courseMetaForProgress = courses.map(c => ({ id: c.id, total_resources: 5 }));
    const progress = getRoadmapProgress(roadmapId || "", courseMetaForProgress);

    return (
        <div className="space-y-6">
            <Link to={ROUTES.DASHBOARD} className="text-muted-foreground hover:text-foreground flex items-center gap-2 mb-2 transition-colors">
                ← Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold capitalize mb-8">
                {roadmapId?.replace(/-/g, ' ')} Roadmap
            </h1>

            {/* Progress Section */}
            <div className="bg-card border rounded-xl p-6 mb-8 shadow-sm">
                <div className="space-y-3">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Roadmap Progress</span>
                        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{progress.percentage}%</span>
                    </div>

                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${progress.percentage}%` }}
                        />
                    </div>

                    <div className="flex justify-between text-sm text-gray-500 font-medium pt-2">
                        <span>{progress.completedResources} of {progress.totalResources} resources completed</span>
                        <span>{progress.coursesCompleted} of {progress.totalCourses} courses mastered</span>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-6">Available Courses</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.length === 0 && (
                    <div className="col-span-1 border-dashed border-2 rounded-xl p-8 text-center text-gray-500">
                        No courses found for this roadmap.
                    </div>
                )}
                {courses.map((course) => {
                    const cProg = getCourseProgress(course.id, 5);
                    const isCompleted = cProg.isCompleted;
                    const isInProgress = cProg.isInProgress;

                    return (
                        <Link
                            key={course.id}
                            to={ROUTES.COURSE(course.id)}
                            className="block bg-card border rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all group relative"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 pr-8">
                                    {course.title}
                                </div>
                                <div className="shrink-0 pt-1">
                                    {isCompleted ? (
                                        <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">✓</span>
                                    ) : isInProgress ? (
                                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">●</span>
                                    ) : (
                                        <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 text-sm">○</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mt-6">
                                <div className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded">
                                    Difficulty {course.difficulty_level}
                                </div>
                                <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                                    {cProg.percentage}% Complete
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
