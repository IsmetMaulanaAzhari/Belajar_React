import { useState } from "react";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const addTask = () => {
    if (!input.trim()) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: input,
        completed: false,
        date: selectedDate,
      },
    ]);

    setInput("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (task.date !== selectedDate) return false;
    if (filter === "active") return !task.completed;
    if (filter === "done") return task.completed;
    return true;
  });

  // Stats untuk tanggal yang dipilih
  const tasksForDate = tasks.filter((t) => t.date === selectedDate);
  const completedCount = tasksForDate.filter((t) => t.completed).length;
  const activeCount = tasksForDate.filter((t) => !t.completed).length;
  const progressPercent =
    tasksForDate.length > 0
      ? Math.round((completedCount / tasksForDate.length) * 100)
      : 0;

  // Format tanggal untuk tampilan
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filterLabels = {
    all: { label: "Semua", icon: "📋" },
    active: { label: "Aktif", icon: "⏳" },
    done: { label: "Selesai", icon: "✅" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 md:p-8">
      <div className="bg-white/95 backdrop-blur-sm w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <span className="bg-white/20 p-2 rounded-xl">📝</span>
            Task Manager
          </h1>
          <p className="text-indigo-100 mt-2">
            Kelola tugas harianmu dengan mudah dan terorganisir
          </p>
        </div>

        <div className="p-6 md:p-8 grid md:grid-cols-5 gap-8">
          {/* LEFT: TODO LIST - 3 columns */}
          <div className="md:col-span-3 space-y-6">
            {/* Input Section */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100">
              <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="text-xl">➕</span> Tambah Tugas Baru
              </h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  className="flex-1 border-2 border-indigo-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-700 placeholder-gray-400"
                  placeholder="Apa yang ingin kamu kerjakan?"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                />
                <button
                  onClick={addTask}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  <span>Tambah</span>
                  <span className="text-lg">→</span>
                </button>
              </div>
            </div>

            {/* Filter Section */}
            <div className="flex flex-wrap gap-3">
              {Object.entries(filterLabels).map(([key, { label, icon }]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                    filter === key
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                      filter === key ? "bg-white/20" : "bg-gray-200"
                    }`}
                  >
                    {key === "all"
                      ? tasksForDate.length
                      : key === "active"
                      ? activeCount
                      : completedCount}
                  </span>
                </button>
              ))}
            </div>

            {/* Tasks List */}
            <div className="space-y-3 min-h-[300px]">
              {filteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <span className="text-6xl mb-4">📭</span>
                  <p className="text-lg font-medium">Tidak ada tugas</p>
                  <p className="text-sm">
                    {filter === "all"
                      ? "Tambahkan tugas baru untuk memulai"
                      : filter === "active"
                      ? "Semua tugas sudah selesai!"
                      : "Belum ada tugas yang selesai"}
                  </p>
                </div>
              ) : (
                filteredTasks.map((task, index) => (
                  <div
                    key={task.id}
                    className={`group flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                      task.completed
                        ? "bg-green-50 border-green-200"
                        : "bg-white border-gray-100 hover:border-indigo-200"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                        task.completed
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 hover:border-indigo-500 hover:bg-indigo-50"
                      }`}
                    >
                      {task.completed && (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>

                    {/* Task Text */}
                    <span
                      onClick={() => toggleTask(task.id)}
                      className={`flex-1 cursor-pointer text-lg transition-all duration-300 ${
                        task.completed
                          ? "line-through text-gray-400"
                          : "text-gray-700"
                      }`}
                    >
                      {task.text}
                    </span>

                    {/* Delete Button */}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 bg-red-100 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-lg transition-all duration-300"
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
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT: CALENDAR & STATS - 2 columns */}
          <div className="md:col-span-2 space-y-6">
            {/* Calendar Section */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">📅</span> Pilih Tanggal
              </h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white transition-all cursor-pointer"
              />
              <div className="mt-4 bg-white/10 rounded-xl p-4">
                <p className="text-indigo-100 text-sm">Tanggal Dipilih:</p>
                <p className="text-lg font-semibold mt-1">
                  {formatDate(selectedDate)}
                </p>
              </div>
            </div>

            {/* Progress Section */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
              <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span className="text-xl">📊</span> Progress Hari Ini
              </h2>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Penyelesaian</span>
                  <span className="font-bold text-emerald-600">
                    {progressPercent}%
                  </span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <p className="text-3xl font-bold text-indigo-600">
                    {tasksForDate.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Total Tugas</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <p className="text-3xl font-bold text-amber-500">
                    {activeCount}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Belum Selesai</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm col-span-2">
                  <p className="text-3xl font-bold text-emerald-500">
                    {completedCount}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Tugas Selesai</p>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
              <h2 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="text-xl">💡</span> Tips
              </h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  Klik checkbox untuk menandai tugas selesai
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  Tekan Enter untuk menambah tugas baru
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  Gunakan filter untuk menyaring tugas
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t text-center text-gray-500 text-sm">
          Ismet Maulana Azhari 
        </div>
      </div>
    </div>
  );
}
