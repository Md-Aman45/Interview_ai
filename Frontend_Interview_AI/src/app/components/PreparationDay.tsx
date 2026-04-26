import { CheckCircleIcon, CalendarIcon } from 'lucide-react';

interface PreparationDayProps {
  day: number;
  focus: string;
  tasks: string[];
  completed?: boolean;
}

export function PreparationDay({ day, focus, tasks, completed = false }: PreparationDayProps) {
  return (
    <div className={`border-l-4 pl-6 pr-4 py-4 rounded-r-lg ${
      completed ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-white'
    }`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
          completed ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
        }`}>
          {completed ? <CheckCircleIcon className="w-6 h-6" /> : day}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Day {day}</h3>
          <p className="text-sm text-gray-600">{focus}</p>
        </div>
      </div>
      <ul className="space-y-2 ml-13">
        {tasks.map((task, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="text-blue-600 mt-1">•</span>
            <span>{task}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
