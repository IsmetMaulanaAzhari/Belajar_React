export default function TaskModal({
  showModal,
  editingTask,
  formData,
  setFormData,
  onSave,
  onClose,
  priorityConfig,
}) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-3xl p-6 w-full max-w-lg border border-purple-500/30 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>{editingTask ? "✏️" : "➕"}</span>
            {editingTask ? "Edit Tugas" : "Tambah Tugas Baru"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              📌 Judul Tugas *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-white/10 border-2 border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all"
              placeholder="Contoh: Mengerjakan laporan bulanan"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              📝 Deskripsi
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-white/10 border-2 border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all resize-none"
              placeholder="Tambahkan detail tugas..."
              rows={3}
            />
          </div>

          {/* Deadline Date & Time */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              📅 Deadline *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Tanggal</label>
                <input
                  type="date"
                  value={formData.deadlineDate}
                  onChange={(e) =>
                    setFormData({ ...formData, deadlineDate: e.target.value })
                  }
                  className="w-full bg-white/10 border-2 border-purple-500/30 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-all cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Waktu</label>
                <input
                  type="time"
                  value={formData.deadlineTime}
                  onChange={(e) =>
                    setFormData({ ...formData, deadlineTime: e.target.value })
                  }
                  className="w-full bg-white/10 border-2 border-purple-500/30 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-all cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              🎯 Prioritas
            </label>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(priorityConfig).map(
                ([key, { label, icon, bg, color, border }]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: key })}
                    className={`py-3 rounded-xl font-medium transition-all duration-300 border-2 ${
                      formData.priority === key
                        ? `${bg} ${color} ${border} scale-105`
                        : "bg-white/10 text-gray-300 border-transparent hover:bg-white/20"
                    }`}
                  >
                    {icon} {label}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-medium bg-white/10 text-gray-300 hover:bg-white/20 transition-all"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            disabled={!formData.title.trim()}
            className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editingTask ? "Simpan Perubahan" : "Tambah Tugas"}
          </button>
        </div>
      </div>
    </div>
  );
}
