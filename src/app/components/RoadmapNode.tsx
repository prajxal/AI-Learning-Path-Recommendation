import React from 'react';
import { Lock, Check, Circle, ArrowRight, PlayCircle } from 'lucide-react';
import { LemonCard } from './LemonCard';

export type NodeStatus = 'locked' | 'unlocked' | 'completed';

interface RoadmapNodeProps {
  id: string;
  title: string;
  description: string;
  status: NodeStatus;
  difficulty?: string;
  onClick?: () => void;
}

import { useProgress } from '../hooks/useProgress';

export function RoadmapNode({ id, title, description, status, difficulty, onClick }: RoadmapNodeProps) {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isUnlocked = status === 'unlocked';

  const { getCourseProgress } = useProgress();
  // Assume ~5 resources if we haven't tracked it strictly, or zero if none tracked yet.
  // Real implementation would pass actual totalResources from backend. We use 5 as a placeholder visual.
  const courseProgress = getCourseProgress(id, 5);
  const percent = isCompleted ? 100 : Math.min(courseProgress.percentage, 99);

  const statusConfig = {
    locked: {
      icon: Lock,
      bgColor: 'bg-muted',
      textColor: 'text-muted-foreground',
      borderColor: 'border-border',
      iconColor: 'text-muted-foreground',
    },
    unlocked: {
      icon: Circle,
      bgColor: 'bg-card',
      textColor: 'text-foreground',
      borderColor: 'border-border',
      iconColor: 'text-accent',
    },
    completed: {
      icon: Check,
      bgColor: 'bg-card',
      textColor: 'text-foreground',
      borderColor: 'border-[#388600]',
      iconColor: 'text-[#388600]',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={`
        relative border ${config.borderColor} bg-card rounded-xl p-6
        transition-all duration-300 shadow-sm flex flex-col h-full
        ${!isLocked && 'hover:shadow-md hover:-translate-y-1 cursor-pointer hover:border-blue-300'}
        ${isLocked && 'opacity-70 cursor-not-allowed bg-muted/30'}
      `}
      onClick={!isLocked ? onClick : undefined}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-full ${isCompleted ? 'bg-green-100' : isUnlocked ? 'bg-blue-100' : 'bg-gray-200'} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${isCompleted ? 'text-green-600' : isUnlocked ? 'text-blue-600' : 'text-gray-500'}`} />
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <h4 className={`font-semibold text-lg line-clamp-2 ${config.textColor}`}>{title}</h4>
        </div>
      </div>

      <p className={`text-sm mb-6 flex-1 line-clamp-3 ${isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
        {description}
      </p>

      <div className="mt-auto space-y-4">

        {/* Progress Bar Injection */}
        {!isLocked && (
          <div className="space-y-1.5 mb-2">
            <div className="flex justify-between text-xs font-semibold text-gray-500">
              <span>Course Progress</span>
              <span className={isCompleted ? 'text-green-600' : 'text-blue-600'}>{percent}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-blue-600'}`}
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs font-medium bg-gray-50 rounded-lg p-3 border">
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 uppercase tracking-wider text-[10px]">Difficulty</span>
            <span className="text-gray-900">{difficulty || 'Standard'}</span>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="flex flex-col gap-1 items-end">
            <span className="text-gray-500 uppercase tracking-wider text-[10px]">Status</span>
            <span className={`${isCompleted ? 'text-green-600' : isUnlocked ? 'text-blue-600' : 'text-gray-500'} flex items-center gap-1`}>
              {isCompleted ? '✓ Completed' : isUnlocked ? '● In Progress' : '○ Locked'}
            </span>
          </div>
        </div>

        {!isLocked && (
          <button className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors ${isCompleted ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
            {isCompleted ? 'Review Content' : 'Start Learning'}
            {isCompleted ? <ArrowRight className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
          </button>
        )}
      </div>

      {isCompleted && (
        <div className="absolute -top-2 -right-2 w-8 h-8 focus:outline-none shadow-sm border border-green-200 bg-green-500 rounded-full flex items-center justify-center translate-x-1/4 -translate-y-1/4">
          <Check className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
}
