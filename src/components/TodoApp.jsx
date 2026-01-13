import { useState, useEffect } from "react";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);
  const [completingTask, setCompletingTask] = useState(null); // For animation
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Get current date and time
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const currentTimeStr = now.toTimeString().slice(0, 5);

  // Form state - now includes time
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadlineDate: new Date().toISOString().split("T")[0],
    deadlineTime: "23:59",
    priority: "medium",
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      deadlineDate: new Date().toISOString().split("T")[0],
      deadlineTime: "23:59",
      priority: "medium",
    });
    setEditingTask(null);
  };

  // Open modal for new task
  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  // Open modal for editing
  const openEditModal = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      deadlineDate: task.deadlineDate,
      deadlineTime: task.deadlineTime,
      priority: task.priority,
    });
    setEditingTask(task);
    setShowModal(true);
  };

  // Save task (add or edit)
  const saveTask = () => {
    if (!formData.title.trim()) return;

    if (editingTask) {
      // Edit existing task
      setTasks(
        tasks.map((task) =>
          task.id === editingTask.id
            ? { ...task, ...formData }
            : task
        )
      );
    } else {
      // Add new task
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          ...formData,
          completed: false,
          completedAt: null,
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    setShowModal(false);
    resetForm();
  };

  // Mark task as complete with animation
  const completeTask = (id) => {
    setCompletingTask(id);
    
    // Delay for animation
    setTimeout(() => {
      setTasks(
        tasks.map((task) =>
          task.id === id 
            ? { ...task, completed: true, completedAt: new Date().toISOString() } 
            : task
        )
      );
      setCompletingTask(null);
    }, 500);
  };

  // Undo complete
  const undoComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: false, completedAt: null } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    if (expandedTask === id) setExpandedTask(null);
  };

  // Check if deadline passed (date + time)
  const isOverdue = (task) => {
    if (task.completed) return false;
    const deadlineDateTime = new Date(`${task.deadlineDate}T${task.deadlineTime}`);
    return deadlineDateTime < now;
  };

  const isToday = (task) => task.deadlineDate === today;

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "done") return task.completed;
    if (filter === "overdue") return isOverdue(task);
    if (filter === "today") return isToday(task);
    return true;
  });

  // Sort by deadline
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const dateA = new Date(`${a.deadlineDate}T${a.deadlineTime}`);
    const dateB = new Date(`${b.deadlineDate}T${b.deadlineTime}`);
    return dateA - dateB;
  });

  // Stats
  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount = tasks.filter((t) => !t.completed).length;
  const overdueCount = tasks.filter((t) => isOverdue(t)).length;
  const todayCount = tasks.filter((t) => isToday(t)).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Format time
  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Get deadline status with time
  const getDeadlineStatus = (task) => {
    if (task.completed) {
      return { color: "text-green-600", bg: "bg-green-100", label: "✅ Selesai", icon: "✅" };
    }
    
    const deadlineDateTime = new Date(`${task.deadlineDate}T${task.deadlineTime}`);
    const diffMs = deadlineDateTime - now;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffMs < 0) {
      return { color: "text-red-600", bg: "bg-red-100", label: "Terlambat!", icon: "🔥" };
    }
    if (diffHours <= 2) {
      return { color: "text-orange-600", bg: "bg-orange-100", label: "Segera!", icon: "⚡" };
    }
    if (task.deadlineDate === today) {
      return { color: "text-amber-600", bg: "bg-amber-100", label: "Hari Ini", icon: "📆" };
    }
    return { color: "text-blue-600", bg: "bg-blue-100", label: formatDate(task.deadlineDate), icon: "📅" };
  };

  // Calculate time remaining
  const getTimeRemaining = (task) => {
    if (task.completed) return null;
    
    const deadlineDateTime = new Date(`${task.deadlineDate}T${task.deadlineTime}`);
    const diffMs = deadlineDateTime - now;
    
    if (diffMs < 0) {
      const overMs = Math.abs(diffMs);
      const overHours = Math.floor(overMs / (1000 * 60 * 60));
      const overDays = Math.floor(overHours / 24);
      if (overDays > 0) return `${overDays} hari terlambat`;
      if (overHours > 0) return `${overHours} jam terlambat`;
      return "Baru saja lewat";
    }
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    const remainingHours = diffHours % 24;
    
    if (diffDays > 0) return `${diffDays} hari ${remainingHours} jam lagi`;
    if (diffHours > 0) return `${diffHours} jam lagi`;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `${diffMinutes} menit lagi`;
  };

  // Priority config
  const priorityConfig = {
    high: { color: "text-red-600", bg: "bg-red-100", border: "border-red-300", label: "Tinggi", icon: "🔴" },
    medium: { color: "text-amber-600", bg: "bg-amber-100", border: "border-amber-300", label: "Sedang", icon: "🟡" },
    low: { color: "text-green-600", bg: "bg-green-100", border: "border-green-300", label: "Rendah", icon: "🟢" },
  };

  const filterLabels = {
    all: { label: "Semua", icon: "📋", count: totalTasks },
    today: { label: "Hari Ini", icon: "📆", count: todayCount },
    active: { label: "Aktif", icon: "⏳", count: activeCount },
    overdue: { label: "Terlambat", icon: "⚠️", count: overdueCount },
    done: { label: "Selesai", icon: "✅", count: completedCount },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 flex items-center justify-center gap-4">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl shadow-lg">📋</span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Task Manager
            </span>
          </h1>
          <p className="text-purple-200">Kelola tugas dan deadline dengan mudah</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* LEFT SIDEBAR - Stats */}
          <div className="lg:col-span-1 space-y-4">
            {/* Add Task Button */}
            <button
              onClick={openAddModal}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg"
            >
              <span className="text-2xl">➕</span>
              Tambah Tugas
            </button>

            {/* Progress Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <span>📊</span> Progress
              </h3>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${progressPercent * 3.52} 352`}
                    className="transition-all duration-500"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{progressPercent}%</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-2xl font-bold text-green-400">{completedCount}</p>
                  <p className="text-xs text-gray-300">Selesai</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-2xl font-bold text-amber-400">{activeCount}</p>
                  <p className="text-xs text-gray-300">Aktif</p>
                </div>
              </div>
              {overdueCount > 0 && (
                <div className="mt-2 bg-red-500/20 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-red-400">{overdueCount}</p>
                  <p className="text-xs text-red-300">Terlambat!</p>
                </div>
              )}
            </div>

            {/* Filter Buttons */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <span>🔍</span> Filter
              </h3>
              <div className="space-y-2">
                {Object.entries(filterLabels).map(([key, { label, icon, count }]) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-between ${
                      filter === key
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{icon}</span>
                      <span>{label}</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      filter === key ? "bg-white/20" : "bg-white/10"
                    }`}>
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MAIN CONTENT - Task List */}
          <div className="lg:col-span-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 min-h-[600px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>{filterLabels[filter].icon}</span>
                  {filterLabels[filter].label}
                  <span className="text-sm font-normal text-purple-300">
                    ({sortedTasks.length} tugas)
                  </span>
                </h2>
              </div>

              {/* Task List */}
              <div className="space-y-3">
                {sortedTasks.length === 0 ? (
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
                  sortedTasks.map((task) => {
                    const deadlineStatus = getDeadlineStatus(task);
                    const priority = priorityConfig[task.priority];
                    const isExpanded = expandedTask === task.id;
                    const timeRemaining = getTimeRemaining(task);
                    const isCompleting = completingTask === task.id;

                    return (
                      <div
                        key={task.id}
                        className={`bg-white/5 backdrop-blur-sm rounded-2xl border-2 transition-all duration-500 hover:bg-white/10 ${
                          isCompleting
                            ? "scale-95 opacity-50 border-green-500"
                            : task.completed
                            ? "border-green-500/30"
                            : isOverdue(task)
                            ? "border-red-500/50 animate-pulse"
                            : "border-white/10 hover:border-purple-500/50"
                        }`}
                      >
                        {/* Main Row */}
                        <div className="p-4">
                          <div className="flex items-start gap-4">
                            {/* Task Info */}
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                            >
                              <div className="flex items-center gap-3 flex-wrap">
                                <h3 className={`font-semibold text-lg ${
                                  task.completed ? "line-through text-gray-500" : "text-white"
                                }`}>
                                  {task.title}
                                </h3>
                                <span className={`text-xs px-2 py-1 rounded-full ${priority.bg} ${priority.color}`}>
                                  {priority.icon} {priority.label}
                                </span>
                              </div>
                              
                              {/* Deadline Info */}
                              <div className="flex items-center gap-3 mt-2 flex-wrap">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${deadlineStatus.bg} ${deadlineStatus.color}`}>
                                  {deadlineStatus.icon} {deadlineStatus.label}
                                </span>
                                <span className="text-gray-400 text-sm flex items-center gap-1">
                                  🕐 {formatTime(task.deadlineTime)}
                                </span>
                                {timeRemaining && (
                                  <span className={`text-sm ${isOverdue(task) ? "text-red-400" : "text-purple-300"}`}>
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
                                  onClick={() => completeTask(task.id)}
                                  disabled={isCompleting}
                                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span className="hidden sm:inline">Selesai</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => undoComplete(task.id)}
                                  className="px-4 py-2 rounded-xl bg-gray-500/30 hover:bg-gray-500/50 text-gray-300 font-medium transition-all duration-300 flex items-center gap-2"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                  </svg>
                                  <span className="hidden sm:inline">Batalkan</span>
                                </button>
                              )}

                              <button
                                onClick={() => openEditModal(task)}
                                className="p-2 rounded-xl bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-white transition-all"
                                title="Edit"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white transition-all"
                                title="Hapus"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                              <button
                                onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                                className={`p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 transition-all duration-300 ${isExpanded ? "rotate-180" : ""}`}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
                                <label className="text-xs text-gray-400 uppercase tracking-wide">📝 Deskripsi</label>
                                <p className="text-gray-200 mt-1 bg-white/5 rounded-xl p-3">
                                  {task.description || <span className="text-gray-500 italic">Tidak ada deskripsi</span>}
                                </p>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white/5 rounded-xl p-3">
                                  <label className="text-xs text-gray-400 uppercase tracking-wide">📅 Tanggal</label>
                                  <p className={`mt-1 font-medium ${deadlineStatus.color}`}>
                                    {formatDate(task.deadlineDate)}
                                  </p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3">
                                  <label className="text-xs text-gray-400 uppercase tracking-wide">🕐 Waktu</label>
                                  <p className="mt-1 font-medium text-white">
                                    {formatTime(task.deadlineTime)}
                                  </p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3">
                                  <label className="text-xs text-gray-400 uppercase tracking-wide">🎯 Prioritas</label>
                                  <p className={`mt-1 font-medium ${priority.color}`}>
                                    {priority.icon} {priority.label}
                                  </p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3">
                                  <label className="text-xs text-gray-400 uppercase tracking-wide">📊 Status</label>
                                  <p className={`mt-1 font-medium ${task.completed ? "text-green-400" : "text-amber-400"}`}>
                                    {task.completed ? "✅ Selesai" : "⏳ Belum"}
                                  </p>
                                </div>
                              </div>
                              {task.completed && task.completedAt && (
                                <div className="bg-green-500/10 rounded-xl p-3 border border-green-500/30">
                                  <p className="text-green-400 text-sm">
                                    ✅ Diselesaikan pada: {new Date(task.completedAt).toLocaleString("id-ID")}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-purple-300 text-sm">
          Made with ❤️ by Ismet Maulana Azhari
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-3xl p-6 w-full max-w-lg border border-purple-500/30 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>{editingTask ? "✏️" : "➕"}</span>
                {editingTask ? "Edit Tugas" : "Tambah Tugas Baru"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, deadlineDate: e.target.value })}
                      className="w-full bg-white/10 border-2 border-purple-500/30 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-all cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Waktu</label>
                    <input
                      type="time"
                      value={formData.deadlineTime}
                      onChange={(e) => setFormData({ ...formData, deadlineTime: e.target.value })}
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
                  {Object.entries(priorityConfig).map(([key, { label, icon, bg, color, border }]) => (
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
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="flex-1 py-3 rounded-xl font-medium bg-white/10 text-gray-300 hover:bg-white/20 transition-all"
              >
                Batal
              </button>
              <button
                onClick={saveTask}
                disabled={!formData.title.trim()}
                className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingTask ? "Simpan Perubahan" : "Tambah Tugas"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
