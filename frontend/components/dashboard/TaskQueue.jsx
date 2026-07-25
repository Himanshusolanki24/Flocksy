import React from 'react';
import { Check, Circle } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';

const priorityDot = {
  high: 'bg-rose-500',
  medium: 'bg-amber-400',
  low: 'bg-slate-300',
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
    <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-semibold text-slate-700">Tasks</h2>
          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-500">
            {total - pending}/{total} done
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${completionRatio}%` }}
            />
          </div>
          <span className="text-[11px] font-medium text-slate-400">
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
                : 'hover:bg-slate-50'
            }`}
          >
            {/* Checkbox */}
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                task.completed
                  ? 'border-emerald-500 bg-emerald-500'
                  : 'border-slate-300 group-hover:border-emerald-400'
              }`}
            >
              {task.completed && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
            </div>

            {/* Text */}
            <span
              className={`flex-1 text-sm leading-snug transition-colors ${
                task.completed ? 'text-slate-400 line-through' : 'text-slate-700'
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
