import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

interface QuestionCardProps {
  question: string;
  intention: string;
  idealAnswer: string;
  index: number;
  type?: 'technical' | 'behavioral';
}

export function QuestionCard({ question, intention, idealAnswer, index, type = 'technical' }: QuestionCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 text-xs font-medium rounded ${
              type === 'technical' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
            }`}>
              {type === 'technical' ? 'Technical' : 'Behavioral'}
            </span>
            <span className="text-sm text-gray-500">Question {index + 1}</span>
          </div>
          <p className="font-semibold text-gray-900 text-lg">{question}</p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {expanded ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Intent:</span> {intention}
        </p>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Ideal Answer:</p>
          <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg leading-relaxed">
            {idealAnswer}
          </p>
        </div>
      )}
    </div>
  );
}
