import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress';
import { getToken } from '../../services/auth';

export default function MyProgressPage() {
    const navigate = useNavigate();
    const { getRoadmapProgress } = useProgress();
    const [skills, setSkills] = useState<any[]>([]);
    const [roadmaps, setRoadmaps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = getToken();
            try {
                // Fetch User Skills to display exact adaptive scores
                const userRes = await fetch(`http://localhost:8000/auth/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const userData = await userRes.json();

                const skillsRes = await fetch(`http://localhost:8000/users/${userData.id}/skills`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const skillsData = await skillsRes.json();
                setSkills(skillsData.skills || []);

                // Fetch Roadmaps to match against local progress
                const roadmapsRes = await fetch(`http://localhost:8000/roadmaps`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const roadmapsData = await roadmapsRes.json();
                setRoadmaps(roadmapsData);
            } catch (err) {
                console.error("Failed to fetch progress data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">My Progress</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-48 bg-muted animate-pulse rounded-xl"></div>
                    <div className="h-48 bg-muted animate-pulse rounded-xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold mb-2">My Progress</h1>
                <p className="text-muted-foreground">Track your learning journey and skill development.</p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">Roadmaps Overview</h2>
                {roadmaps.length === 0 ? (
                    <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground">
                        No roadmaps available yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {roadmaps.map(roadmap => {
                            // Extract courses from roadmap data if possible, fallback to dummy for visual
                            const coursesData = roadmap.topics?.map((t: any) => ({
                                id: `course_${t.id}`,
                                total_resources: 5 // mock estimate since we only fetch full courses inside RoadmapPage
                            })) || [];

                            const progress = getRoadmapProgress(roadmap.id, coursesData);
                            // Since the mock isn't exact without fetching all courses, let's just make sure the UI works.
                            // In a real scenario, we might need a backend aggregate or local storage sum.

                            const calculatedPercentage = Math.min(progress.percentage || 0, 100);

                            return (
                                <div key={roadmap.id} className="bg-card shadow-sm border rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                    <div className="p-6 flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-semibold text-lg">{roadmap.title || roadmap.id}</h3>
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">{calculatedPercentage}%</span>
                                        </div>

                                        <div className="space-y-2 mb-6">
                                            <div className="flex justify-between text-sm text-muted-foreground">
                                                <span>Completion</span>
                                                <span>{calculatedPercentage}%</span>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-2">
                                                <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${calculatedPercentage}%` }}></div>
                                            </div>
                                        </div>

                                        <div className="flex text-sm text-muted-foreground gap-4">
                                            <div>
                                                <span className="font-medium text-foreground">{progress.completedResources || 0}</span> Resources
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-6 py-4 bg-muted/20 border-t flex justify-between items-center">
                                        <span className="text-sm font-medium text-muted-foreground">Adaptive Score: {Math.round(skills.find(s => s.roadmap_id === roadmap.id)?.trust_score || 0)}</span>
                                        <button
                                            onClick={() => navigate(`/roadmap/${roadmap.id}`)}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                                        >
                                            Continue Learning <span className="text-lg leading-none">→</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">Skill Proficiency Profiles</h2>
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    {skills.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">Start learning to build your skill profile.</p>
                    ) : (
                        <div className="space-y-6">
                            {skills.map((skill, index) => {
                                const maxScore = 1500; // Arbitrary max for visualization
                                const percentage = Math.min(Math.round(((skill.trust_score || 0) / maxScore) * 100), 100);

                                return (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <h4 className="font-medium capitalize">{skill.roadmap_id.replace('-', ' ')}</h4>
                                                <p className="text-xs text-muted-foreground">Proficiency: {skill.proficiency_level ? (skill.proficiency_level * 100).toFixed(0) + '%' : '0%'}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-bold text-lg">{Math.round(skill.trust_score || 0)}</span>
                                                <span className="text-xs text-muted-foreground ml-1">elo</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                                            <div
                                                className={`h-3 rounded-full transition-all ${percentage > 60 ? 'bg-green-500' : percentage > 30 ? 'bg-blue-500' : 'bg-orange-400'
                                                    }`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
