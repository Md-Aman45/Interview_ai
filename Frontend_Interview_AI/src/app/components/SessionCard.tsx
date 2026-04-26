import { MicIcon, CalendarIcon, TrendingUpIcon } from 'lucide-react';
import { ScoreCircle } from './ScoreCircle';

interface SessionCardProps {
  session: {
    _id: string;
    jobRole: string;
    createdAt: string;
    answers: any[];
    averageScore?: number;
    status: string;
  };
  onClick?: () => void;
}

export function SessionCard({ session, onClick }: SessionCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <MicIcon className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">{session.jobRole}</h3>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              <span>{new Date(session.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUpIcon className="w-4 h-4" />
              <span>{session.answers.length} questions</span>
            </div>
          </div>
        </div>
        <ScoreCircle score={session.averageScore || 0} size="sm" showLabel={false} />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <span className={`text-xs px-2 py-1 rounded ${
          session.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {session.status}
        </span>
        <span className="text-sm font-medium text-gray-900">
          Avg: {session.averageScore?.toFixed(1) || 0}%
        </span>
      </div>
    </div>
  );
}
