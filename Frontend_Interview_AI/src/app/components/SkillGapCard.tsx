import { AlertCircleIcon, AlertTriangleIcon, InfoIcon } from 'lucide-react';

interface SkillGapCardProps {
  skill: string;
  suggestion: string;
  severity: 'critical' | 'important' | 'nice-to-have';
}

export function SkillGapCard({ skill, suggestion, severity }: SkillGapCardProps) {
  const severityConfig = {
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      badge: 'bg-red-100 text-red-800',
      icon: AlertCircleIcon,
      iconColor: 'text-red-600',
    },
    important: {
      bg: 'bg-orange-50',
      border: 'border-orange-500',
      badge: 'bg-orange-100 text-orange-800',
      icon: AlertTriangleIcon,
      iconColor: 'text-orange-600',
    },
    'nice-to-have': {
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      badge: 'bg-yellow-100 text-yellow-800',
      icon: InfoIcon,
      iconColor: 'text-yellow-600',
    },
  };

  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-lg border-l-4 ${config.bg} ${config.border}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 ${config.iconColor}`} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-gray-900">{skill}</p>
            <span className={`text-xs px-2 py-1 rounded ${config.badge} capitalize`}>
              {severity.replace('-', ' ')}
            </span>
          </div>
          <p className="text-sm text-gray-700">{suggestion}</p>
        </div>
      </div>
    </div>
  );
}
