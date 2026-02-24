import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RoadmapContainer, RoadmapTopic } from '../components/RoadmapContainer';
import { LemonCard } from '../components/LemonCard';

interface RoadmapPageProps {
  learningGoal: string;
  topics: RoadmapTopic[];
  onTopicClick: (topic: RoadmapTopic) => void;
}

export function RoadmapPage({ learningGoal, topics, onTopicClick }: RoadmapPageProps) {
  const navigate = useNavigate();
  const totalTopics = topics.length;
  const completedTopics = topics.filter(t => t.status === 'completed').length;
  const unlockedTopics = topics.filter(t => t.status === 'unlocked').length;
  const lockedTopics = topics.filter(t => t.status === 'locked').length;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(`/dashboard`)}
        className="text-muted-foreground hover:text-foreground flex items-center gap-2 mb-2 transition-colors"
      >
        ← Back to Dashboard
      </button>
      {/* Header */}
      <div>
        <h1>Learning Roadmap</h1>
        <p className="text-muted-foreground mt-1">{learningGoal}</p>
      </div>

      {/* Stats Overview */}
      <LemonCard>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Topics</p>
            <p className="text-2xl font-medium">{totalTopics}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Completed</p>
            <p className="text-2xl font-medium text-[#388600]">{completedTopics}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">In Progress</p>
            <p className="text-2xl font-medium text-accent">{unlockedTopics}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Locked</p>
            <p className="text-2xl font-medium text-muted-foreground">{lockedTopics}</p>
          </div>
        </div>
      </LemonCard>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#388600]" />
          <span className="text-muted-foreground">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-accent" />
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-muted" />
          <span className="text-muted-foreground">Locked</span>
        </div>
      </div>

      {/* Roadmap */}
      <RoadmapContainer topics={topics} onTopicClick={onTopicClick} />
    </div>
  );
}
