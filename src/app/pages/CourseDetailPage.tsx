import { useParams, useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { useEffect, useState } from "react";

import { getToken } from "../../services/auth";
import { useProgress } from "../hooks/useProgress";
import { getSkillProfile, SkillProfile } from "../services/quizApi";
import BACKEND_URL from "../../services/api";

type Course = {
  id: string;
  title: string;
  roadmap_id: string;
  difficulty_level: number | null;
  description?: string | null;
};

export default function CourseDetailPage() {
  const { courseId } = useParams();
  console.log("CourseDetailPage courseId:", courseId);
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [learningPath, setLearningPath] = useState<any[]>([]);
  const [pathLoading, setPathLoading] = useState(true);
  const [resources, setResources] = useState<{ primary: any, additional: any[] }>({ primary: null, additional: [] });
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [skillProfile, setSkillProfile] = useState<SkillProfile | null>(null);
  const [skillStatus, setSkillStatus] = useState<string>("locked");

  const { getResourceProgress, getCourseProgress } = useProgress();

  useEffect(() => {
    if (!courseId) return;

    const token = getToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    fetch(`${BACKEND_URL}/courses/${courseId}`, { headers })
      .then((res) => res.json())
      .then(setCourse)
      .catch(() => setCourse(null));

    const userId = localStorage.getItem("user_id");

    fetch(`${BACKEND_URL}/learning-path/${userId}/${courseId}`, { headers })
      .then((res) => res.json())
      .then((data) => {
        setLearningPath(data.path || []);
        setPathLoading(false);
      })
      .catch(() => setPathLoading(false));

    const roadmapId = courseId.split(":")[0];

    // Fetch Skill Graph Status
    fetch(`${BACKEND_URL}/skill-graph/${roadmapId}/status`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        // Find this specific course's status
        const currentSkill = data.find((item: any) => item.skill_id === courseId);
        if (currentSkill) {
          setSkillStatus(currentSkill.status);
        }
      })
      .catch(() => setSkillStatus("locked"));

    // Fetch Adaptive Skill Profile
    getSkillProfile(courseId).then(setSkillProfile);

    fetch(`${BACKEND_URL}/courses/${courseId}/resources`, { headers })
      .then((res) => res.json())
      .then((data) => {
        setResources(data || { primary: null, additional: [] });
        setResourcesLoading(false);
      })
      .catch(() => setResourcesLoading(false));
  }, [courseId]);

  if (!course) {
    return <div className="space-y-6">Loading course...</div>;
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(ROUTES.ROADMAP(course.roadmap_id))}
        className="text-muted-foreground hover:text-foreground flex items-center gap-2 mb-2 transition-colors"
      >
        ← Back to Roadmap
      </button>
      <div className="bg-card border rounded-xl p-8 mb-8 mt-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div className="space-y-4 flex-1">
            <h1 className="text-3xl font-bold text-foreground">{course.title}</h1>
            <p className="text-muted-foreground max-w-2xl">{course.description}</p>

            {/* Adaptive Mastery UI */}
            {skillProfile && (
              <div className="flex gap-4 mt-4">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 w-40">
                  <div className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">Mastery</div>
                  <div className="text-2xl font-bold text-foreground">
                    {Math.round(skillProfile.proficiency_level)}%
                  </div>
                </div>
                <div className="bg-muted border rounded-lg p-3 w-40">
                  <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Confidence</div>
                  <div className="text-2xl font-bold text-foreground">
                    {Math.round(skillProfile.confidence * 100)}%
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2">
              {(() => {
                const totalRes = (resources.primary ? 1 : 0) + (resources.additional?.length || 0);
                const progress = getCourseProgress(course.id, totalRes);
                const resourcesFinished = totalRes > 0 && progress.percentage === 100;

                const isUnlocked = skillStatus === "unlocked" || skillStatus === "completed" || resourcesFinished;

                if (!isUnlocked && skillStatus === "locked") {
                  return (
                    <button disabled className="bg-gray-100 text-gray-400 font-medium py-2 px-6 rounded-md cursor-not-allowed flex items-center gap-2">
                      <span>🔒</span> Locked — Complete prerequisites
                    </button>
                  );
                }

                if (skillStatus === "completed") {
                  return (
                    <button
                      onClick={() => navigate(`/course/${courseId}/quiz`)}
                      className="bg-green-100 text-green-700 hover:bg-green-200 font-semibold py-2 px-6 rounded-md border border-green-200 transition-colors flex items-center gap-2"
                    >
                      <span>✓</span> Skill Mastered (Retake Quiz)
                    </button>
                  );
                }

                return (
                  <button
                    onClick={() => navigate(`/course/${courseId}/quiz`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md shadow-sm transition-colors flex items-center gap-2"
                  >
                    <span>🧠</span> Take Quiz
                  </button>
                );
              })()}
            </div>
          </div>

          {!resourcesLoading && (
            <div className="w-full md:w-64 shrink-0 bg-gray-50 border rounded-lg p-4">
              {(() => {
                const totalRes = (resources.primary ? 1 : 0) + (resources.additional?.length || 0);
                const progress = getCourseProgress(course.id, totalRes);
                const percentage = Math.min(progress.percentage, 100);

                return (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-semibold text-gray-700">
                      <span>Course Progress</span>
                      <span className={percentage === 100 ? 'text-green-600' : 'text-blue-600'}>{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${percentage === 100 ? 'bg-green-500' : 'bg-blue-600'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-center text-gray-500 font-medium pt-1">
                      {progress.completedCount} of {totalRes} resources completed
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mt-8 mb-4">Learning Roadmap</h2>
        {pathLoading ? (
          <div>Loading learning path...</div>
        ) : (
          <div className="space-y-4">
            {learningPath.map((item: any) => {
              const status = item.status || "locked";
              let statusClasses = "border-gray-500/50 bg-gray-50/5 text-muted-foreground"; // locked

              if (status === "completed") {
                statusClasses = "border-green-500/50 bg-green-500/10";
              } else if (status === "ready") {
                statusClasses = "border-blue-500/50 bg-blue-500/10";
              }

              return (
                <div
                  key={item.id}
                  className={`border rounded p-4 flex justify-between items-center ${statusClasses}`}
                >
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm opacity-80">
                      Difficulty: {item.difficulty}
                    </p>
                  </div>
                  <div className="text-xs uppercase font-medium border px-2 py-1 rounded">
                    {status}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mt-8 mb-4">Course Content</h2>
        {resourcesLoading ? (
          <p className="text-muted-foreground">Loading resources...</p>
        ) : (
          <div className="space-y-6">
            {!resources.primary && resources.additional.length === 0 ? (
              <div className="bg-muted/30 p-6 rounded-lg text-center text-muted-foreground border">
                No curated resources available yet.
              </div>
            ) : (
              <>
                {resources.primary && resources.primary.resource_type === "video" && (
                  <div className="bg-card rounded-xl shadow-md border p-6 mb-8 mt-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 text-3xl">
                      🎯
                    </div>
                    <h2 className="text-xl font-semibold mb-2">
                      Recommended Video
                    </h2>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      {resources.primary.title}
                    </p>
                    <button
                      onClick={() => navigate(ROUTES.RESOURCE(courseId as string, resources.primary.id))}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors w-full sm:w-auto"
                    >
                      Start Learning
                    </button>
                  </div>
                )}

                {(() => {
                  const allAdditional = [...resources.additional];
                  if (resources.primary && resources.primary.resource_type !== "video") {
                    allAdditional.unshift(resources.primary);
                  }

                  if (allAdditional.length === 0) return null;

                  return (
                    <div className="space-y-8">
                      {[
                        { type: 'video', label: 'More Videos', icon: '🎥' },
                        { type: 'documentation', label: 'Documentation', icon: '📖' },
                        { type: 'article', label: 'Articles', icon: '📰' },
                        { type: 'practice', label: 'Practice / Labs', icon: '🧪' }
                      ].map(({ type, label, icon }) => {
                        const items = allAdditional.filter((r: any) =>
                          type === 'article' ? (r.resource_type === 'article' || !r.resource_type) : r.resource_type === type
                        );

                        if (items.length === 0) return null;

                        return (
                          <div key={type}>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <span>{icon}</span> {label}
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                              {items.map((res: any) => {
                                const status = getResourceProgress(courseId as string, res.id);
                                return (
                                  <button
                                    key={res.id}
                                    onClick={() => navigate(ROUTES.RESOURCE(courseId as string, res.id))}
                                    className="w-full text-left flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition bg-card"
                                  >
                                    <div className="flex items-center gap-4 text-left">
                                      <div className="shrink-0 text-gray-400 mt-1">
                                        {status === 'completed' && <span className="text-green-500 text-xl leading-none">✓</span>}
                                        {status === 'in_progress' && <span className="text-blue-500 text-sm leading-none">●</span>}
                                        {status === 'not_started' && <span className="text-gray-300 text-sm leading-none">○</span>}
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="font-medium text-foreground line-clamp-2">{res.title}</span>
                                        {res.platform && <span className="text-sm text-muted-foreground capitalize mt-1">{res.platform}</span>}
                                      </div>
                                    </div>
                                    <span className="text-sm text-muted-foreground ml-4 shrink-0">→</span>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                <div className="text-center text-xs text-muted-foreground mt-8 pt-4 border-t">
                  Resources curated from roadmap.sh
                </div>
              </>
            )}
          </div>
        )}
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
