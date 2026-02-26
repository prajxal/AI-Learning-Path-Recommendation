import React from "react";
import { Link } from "react-router-dom";
import { useRoadmaps } from "../../hooks/useRoadmaps";
import { useProgress } from "../../hooks/useProgress";

function RoadmapCard({ roadmap }: { roadmap: any }) {
    const userId = localStorage.getItem("user_id") || "1";
    const { progress } = useProgress(userId, roadmap.id);

    return (
        <Link
            to={`/roadmap/${roadmap.id}`}
            className="block border rounded-lg p-6 hover:bg-gray-50 transition"
        >
            <div className="text-xl font-medium capitalize">
                {roadmap.id}
            </div>

            <div className="text-gray-500 text-sm mt-1">
                {roadmap.topic_count} topics
            </div>

            {progress && (
                <div className="mt-2 text-sm text-gray-600">
                    Progress: {progress.completed_courses} / {progress.total_courses}
                    <br />
                    Adaptive Score: {Math.round(progress.trust_score)}
                </div>
            )}
        </Link>
    );
}

export default function RoadmapCatalogPage() {
    console.log("[RoadmapCatalogPage] Rendering. Pathname:", window.location.pathname);
    const { roadmaps, loading, error } = useRoadmaps();

    if (loading) {
        console.log("[RoadmapCatalogPage] Loading...");
        return <div>Loading roadmaps...</div>;
    }
    if (error) return <div>Error loading roadmaps</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-semibold mb-6">
                Engineering Roadmaps
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roadmaps.map((roadmap) => (
                    <RoadmapCard key={roadmap.id} roadmap={roadmap} />
                ))}
            </div>
        </div>
    );
}
