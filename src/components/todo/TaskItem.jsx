export default function TaskItem({
  task,
  isExpanded,
  isCompleting,
  isOverdue,
  deadlineStatus,
  priority,
  timeRemaining,
  formatDate,
  formatTime,
  onToggleExpand,
  onComplete,
  onUndo,
  onEdit,
  onDelete,
}) {
  return (
    <div
      className={`bg-white/5 backdrop-blur-sm rounded-2xl border-2 transition-all duration-500 hover:bg-white/10 ${
        isCompleting
          ? "scale-95 opacity-50 border-green-500"
          : task.completed
          ? "border-green-500/30"
          : isOverdue
          ? "border-red-500/50 animate-pulse"
          : "border-white/10 hover:border-purple-500/50"
      }`}
    >
      {/* Main Row */}
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Task Info */}
          <div className="flex-1 cursor-pointer" onClick={onToggleExpand}>
            <div className="flex items-center gap-3 flex-wrap">
              <h3
                className={`font-semibold text-lg ${
                  task.completed ? "line-through text-gray-500" : "text-white"
                }`}
              >
                {task.title}
              </h3>
              <span
                className={`text-xs px-2 py-1 rounded-full ${priority.bg} ${priority.color}`}
              >
                {priority.icon} {priority.label}
              </span>
            </div>

            {/* Deadline Info */}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${deadlineStatus.bg} ${deadlineStatus.color}`}
              >
                {deadlineStatus.icon} {deadlineStatus.label}
              </span>
              <span className="text-gray-400 text-sm flex items-center gap-1">
                🕐 {formatTime(task.deadlineTime)}
              </span>
              {timeRemaining && (
                <span
                  className={`text-sm ${isOverdue ? "text-red-400" : "text-purple-300"}`}
                >
                  ⏱️ {timeRemaining}
                </span>
              )}
            </div>

            {task.description && (
              <p className="text-gray-400 text-sm mt-2 line-clamp-1">
                {task.description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Complete/Undo Button */}
            {!task.completed ? (
              <button
                onClick={onComplete}
                disabled={isCompleting}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="hidden sm:inline">Selesai</span>
              </button>
            ) : (
              <button
                onClick={onUndo}
                className="px-4 py-2 rounded-xl bg-gray-500/30 hover:bg-gray-500/50 text-gray-300 font-medium transition-all duration-300 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                  />
                </svg>
                <span className="hidden sm:inline">Batalkan</span>
              </button>
            )}

            <button
              onClick={onEdit}
              className="p-2 rounded-xl bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-white transition-all"
              title="Edit"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={onDelete}
              className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white transition-all"
              title="Hapus"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
            <button
              onClick={onToggleExpand}
              className={`p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 transition-all duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-white/10">
          <div className="pt-4 space-y-4">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wide">
                📝 Deskripsi
              </label>
              <p className="text-gray-200 mt-1 bg-white/5 rounded-xl p-3">
                {task.description || (
                  <span className="text-gray-500 italic">Tidak ada deskripsi</span>
                )}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-xl p-3">
                <label className="text-xs text-gray-400 uppercase tracking-wide">
                  📅 Tanggal
                </label>
                <p className={`mt-1 font-medium ${deadlineStatus.color}`}>
                  {formatDate(task.deadlineDate)}
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <label className="text-xs text-gray-400 uppercase tracking-wide">
                  🕐 Waktu
                </label>
                <p className="mt-1 font-medium text-white">
                  {formatTime(task.deadlineTime)}
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <label className="text-xs text-gray-400 uppercase tracking-wide">
                  🎯 Prioritas
                </label>
                <p className={`mt-1 font-medium ${priority.color}`}>
                  {priority.icon} {priority.label}
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <label className="text-xs text-gray-400 uppercase tracking-wide">
                  📊 Status
                </label>
                <p
                  className={`mt-1 font-medium ${
                    task.completed ? "text-green-400" : "text-amber-400"
                  }`}
                >
                  {task.completed ? "✅ Selesai" : "⏳ Belum"}
                </p>
              </div>
            </div>
            {task.completed && task.completedAt && (
              <div className="bg-green-500/10 rounded-xl p-3 border border-green-500/30">
                <p className="text-green-400 text-sm">
                  ✅ Diselesaikan pada:{" "}
                  {new Date(task.completedAt).toLocaleString("id-ID")}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
