import React from 'react';
import { Check, Circle } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';

const priorityDot = {
  high: 'bg-[#1F6F5F]',
  medium: 'bg-[#2FA084]',
  low: 'bg-[#6FCF97]',
};

export const TaskQueue = () => {
  const { tasks, completeTask } = useDashboardStore();

  const sorted = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const w = { high: 3, medium: 2, low: 1 };
    return w[b.priority] - w[a.priority];
  });

  const pending = tasks.filter((t) => !t.completed).length;
  const total = tasks.length;
  const completionRatio = total === 0 ? 0 : ((total - pending) / total) * 100;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-[#1F6F5F]/10 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1F6F5F]/10 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-semibold text-[#1F6F5F]">Tasks</h2>
          <span className="rounded-md bg-[#EEEEEE] px-1.5 py-0.5 text-[11px] font-semibold text-[#1F6F5F]/65">
            {total - pending}/{total} done
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#EEEEEE]">
            <div
              className="h-full rounded-full bg-[#2FA084] transition-all duration-500"
              style={{ width: `${completionRatio}%` }}
            />
          </div>
          <span className="text-[11px] font-medium text-[#1F6F5F]/45">
            {Math.round(completionRatio)}%
          </span>
        </div>
      </div>

      {/* Tasks list */}
      <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
        {sorted.map((task) => (
          <button
            key={task.id}
            onClick={() => completeTask(task.id)}
            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 ${
              task.completed
                ? 'opacity-50'
                : 'hover:bg-[#EEEEEE]/55'
            }`}
          >
            {/* Checkbox */}
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                task.completed
                  ? 'border-[#2FA084] bg-[#2FA084]'
                  : 'border-[#1F6F5F]/25 group-hover:border-[#6FCF97]'
              }`}
            >
              {task.completed && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
            </div>

            {/* Text */}
            <span
              className={`flex-1 text-sm leading-snug transition-colors ${
                task.completed ? 'text-[#1F6F5F]/35 line-through' : 'text-[#1F6F5F]/78'
              }`}
            >
              {task.title}
            </span>

            {/* Priority dot */}
            {!task.completed && (
              <span className={`h-2 w-2 shrink-0 rounded-full ${priorityDot[task.priority]}`} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
