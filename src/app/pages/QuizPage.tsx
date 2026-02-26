import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { getQuiz, submitQuizAttempt, getSkillProfile, Quiz, SkillProfile } from "../services/quizApi";

export default function QuizPage() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);
    const [newProfile, setNewProfile] = useState<SkillProfile | null>(null);

    useEffect(() => {
        if (!courseId) return;

        // Reset everything when courseId changes
        setQuiz(null);
        setResult(null);
        setNewProfile(null);
        setAnswers({});
        setCurrentQuestionIndex(0);
        setLoading(true);
        setError(null);

        getQuiz(courseId)
            .then((data) => {
                if (!data) {
                    setError("Failed to load quiz. The generator may be temporarily unavailable.");
                } else {
                    setQuiz(data);
                }
            })
            .catch((err) => {
                setError(err.message || "An error occurred fetching the quiz.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [courseId]);

    const handleOptionSelect = (option: string) => {
        if (!quiz || !quiz.questions[currentQuestionIndex]) return;
        const questionId = quiz.questions[currentQuestionIndex].id || `q${currentQuestionIndex}`;

        setAnswers((prev) => ({
            ...prev,
            [questionId]: option,
        }));
    };

    const handleNext = async () => {
        if (!quiz) return;

        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            return;
        }

        // Finished last question, submit
        setSubmitting(true);

        try {
            const submissionResult = await submitQuizAttempt(courseId!, answers);
            if (submissionResult) {
                setResult({
                    score: submissionResult.score,
                    passed: submissionResult.passed,
                });

                // Refetch profile to show new mastery
                const updatedProfile = await getSkillProfile(courseId!);
                setNewProfile(updatedProfile);
            } else {
                setError("Failed to submit quiz attempt.");
            }
        } catch (err: any) {
            setError(err.message || "Error submitting quiz");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <div className="animate-spin text-4xl">⚙️</div>
                <p className="text-muted-foreground animate-pulse">Generating your adaptive quiz questions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto mt-12 bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <h2 className="text-xl font-semibold text-red-800 mb-2">Quiz Load Error</h2>
                <p className="text-red-600 mb-6">{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-white px-4 py-2 border rounded shadow-sm font-medium hover:bg-gray-50"
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!quiz) return null;

    // --- RESULT SCREEN ---
    if (result && newProfile) {
        return (
            <div className="max-w-2xl mx-auto mt-12">
                <div className="bg-card border rounded-2xl p-10 text-center shadow-sm space-y-6">
                    <div className="text-6xl mb-4">
                        {result.passed ? "🎉" : "💪"}
                    </div>
                    <h1 className="text-3xl font-bold">
                        {result.passed ? "Quiz Passed!" : "Keep Studying!"}
                    </h1>

                    <div className="bg-muted p-6 rounded-xl inline-block mt-4 mb-6">
                        <div className="text-sm font-semibold uppercase text-muted-foreground tracking-wider mb-2">Your Score</div>
                        <div className={`text-5xl font-extrabold ${result.passed ? "text-green-600" : "text-blue-600"}`}>
                            {Math.round(result.score)}%
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">Passing score: {quiz.passing_score}%</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-left border-t pt-6 max-w-sm mx-auto">
                        <div className="bg-primary/5 p-4 rounded-xl">
                            <div className="text-xs uppercase text-primary font-bold mb-1">New Mastery</div>
                            <div className="text-2xl font-bold">{Math.round(newProfile.proficiency_level)}%</div>
                        </div>
                        <div className="bg-muted p-4 rounded-xl">
                            <div className="text-xs uppercase text-muted-foreground font-bold mb-1">Confidence</div>
                            <div className="text-2xl font-bold">{Math.round(newProfile.confidence * 100)}%</div>
                        </div>
                    </div>

                    <div className="pt-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-foreground text-background font-medium py-3 px-8 rounded-lg hover:opacity-90 transition-opacity w-full sm:w-auto"
                        >
                            Continue Learning
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- QUIZ VIEW ---
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const questionId = currentQuestion.id || `q${currentQuestionIndex}`;
    const selectedOption = answers[questionId];
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

    return (
        <div className="max-w-3xl mx-auto pb-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 opacity-70">
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm hover:underline"
                >
                    Cancel Quiz
                </button>
                <div className="text-sm font-medium">Question {currentQuestionIndex + 1} of {quiz.questions.length}</div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-1.5 mb-10 overflow-hidden">
                <div
                    className="bg-primary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex) / quiz.questions.length) * 100}%` }}
                />
            </div>

            <div className="bg-card border rounded-2xl p-8 md:p-10 shadow-sm">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-tight">
                    {currentQuestion.question}
                </h2>

                <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => {
                        const isSelected = selectedOption === option;
                        return (
                            <button
                                key={idx}
                                onClick={() => handleOptionSelect(option)}
                                className={`w-full text-left p-5 rounded-xl border-2 transition-all ${isSelected
                                        ? "border-primary bg-primary/5 font-semibold shadow-sm"
                                        : "border-border hover:border-gray-400 hover:bg-muted/50"
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? "border-primary bg-primary text-primary-foreground" : "border-gray-300"
                                        }`}>
                                        {isSelected && <span className="text-xs">✓</span>}
                                    </div>
                                    <span className={isSelected ? "text-foreground" : "text-muted-foreground"}>
                                        {option}
                                    </span>
                                </div>
                            </button>
                        )
                    })}
                </div>

                <div className="mt-10 flex justify-end">
                    <button
                        disabled={!selectedOption || submitting}
                        onClick={handleNext}
                        className={`font-medium py-3 px-8 rounded-lg transition-all ${!selectedOption || submitting
                                ? "bg-muted text-muted-foreground cursor-not-allowed"
                                : "bg-primary text-primary-foreground shadow-md hover:opacity-90"
                            }`}
                    >
                        {submitting ? "Submitting..." : isLastQuestion ? "Submit Quiz" : "Next Question"}
                    </button>
                </div>
            </div>
        </div>
    );
}
