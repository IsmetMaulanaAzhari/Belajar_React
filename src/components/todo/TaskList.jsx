import TaskItem from "./TaskItem";

export default function TaskList({
  tasks,
  filter,
  filterLabels,
  expandedTask,
  completingTask,
  priorityConfig,
  isOverdue,
  getDeadlineStatus,
  getTimeRemaining,
  formatDate,
  formatTime,
  onToggleExpand,
  onComplete,
  onUndo,
  onEdit,
  onDelete,
}) {
  return (
    <div className="lg:col-span-3">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 min-h-[600px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>{filterLabels[filter].icon}</span>
            {filterLabels[filter].label}
            <span className="text-sm font-normal text-purple-300">
              ({tasks.length} tugas)
            </span>
          </h2>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <span className="text-7xl mb-4">📭</span>
              <p className="text-xl font-medium text-white">Tidak ada tugas</p>
              <p className="text-purple-300 mt-2">
                {filter === "all"
                  ? "Klik tombol 'Tambah Tugas' untuk memulai"
                  : "Tidak ada tugas dalam kategori ini"}
              </p>
            </div>
          ) : (
            tasks.map((task) => {
              const deadlineStatus = getDeadlineStatus(task);
              const priority = priorityConfig[task.priority];
              const isExpanded = expandedTask === task.id;
              const timeRemaining = getTimeRemaining(task);
              const isCompleting = completingTask === task.id;
              const taskIsOverdue = isOverdue(task);

              return (
                <TaskItem
                  key={task.id}
                  task={task}
                  isExpanded={isExpanded}
                  isCompleting={isCompleting}
                  isOverdue={taskIsOverdue}
                  deadlineStatus={deadlineStatus}
                  priority={priority}
                  timeRemaining={timeRemaining}
                  formatDate={formatDate}
                  formatTime={formatTime}
                  onToggleExpand={() => onToggleExpand(task.id)}
                  onComplete={() => onComplete(task.id)}
                  onUndo={() => onUndo(task.id)}
                  onEdit={() => onEdit(task)}
                  onDelete={() => onDelete(task.id)}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
