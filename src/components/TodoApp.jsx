import { useState, useEffect } from "react";
import Header from "./todo/Header";
import Sidebar from "./todo/Sidebar";
import TaskList from "./todo/TaskList";
import TaskModal from "./todo/TaskModal";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);
  const [completingTask, setCompletingTask] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Get current date and time
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadlineDate: new Date().toISOString().split("T")[0],
    deadlineTime: "23:59",
    priority: "medium",
  });

  // Priority config
  const priorityConfig = {
    high: { color: "text-red-600", bg: "bg-red-100", border: "border-red-300", label: "Tinggi", icon: "🔴" },
    medium: { color: "text-amber-600", bg: "bg-amber-100", border: "border-amber-300", label: "Sedang", icon: "🟡" },
    low: { color: "text-green-600", bg: "bg-green-100", border: "border-green-300", label: "Rendah", icon: "🟢" },
  };

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

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  // Save task (add or edit)
  const saveTask = () => {
    if (!formData.title.trim()) return;

    if (editingTask) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTask.id ? { ...task, ...formData } : task
        )
      );
    } else {
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

    closeModal();
  };

  // Complete task with animation
  const completeTask = (id) => {
    setCompletingTask(id);
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

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    if (expandedTask === id) setExpandedTask(null);
  };

  // Toggle expand
  const toggleExpand = (id) => {
    setExpandedTask(expandedTask === id ? null : id);
  };

  // Check if deadline passed
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

  // Filter labels
  const filterLabels = {
    all: { label: "Semua", icon: "📋", count: totalTasks },
    today: { label: "Hari Ini", icon: "📆", count: todayCount },
    active: { label: "Aktif", icon: "⏳", count: activeCount },
    overdue: { label: "Terlambat", icon: "⚠️", count: overdueCount },
    done: { label: "Selesai", icon: "✅", count: completedCount },
  };

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

  // Get deadline status
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

  // Get time remaining
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Header />

        <div className="grid lg:grid-cols-4 gap-6">
          <Sidebar
            onAddTask={openAddModal}
            progressPercent={progressPercent}
            completedCount={completedCount}
            activeCount={activeCount}
            overdueCount={overdueCount}
            filter={filter}
            setFilter={setFilter}
            filterLabels={filterLabels}
          />

          <TaskList
            tasks={sortedTasks}
            filter={filter}
            filterLabels={filterLabels}
            expandedTask={expandedTask}
            completingTask={completingTask}
            priorityConfig={priorityConfig}
            isOverdue={isOverdue}
            getDeadlineStatus={getDeadlineStatus}
            getTimeRemaining={getTimeRemaining}
            formatDate={formatDate}
            formatTime={formatTime}
            onToggleExpand={toggleExpand}
            onComplete={completeTask}
            onUndo={undoComplete}
            onEdit={openEditModal}
            onDelete={deleteTask}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-purple-300 text-sm">
          Made by Ismet
        </div>
      </div>

      <TaskModal
        showModal={showModal}
        editingTask={editingTask}
        formData={formData}
        setFormData={setFormData}
        onSave={saveTask}
        onClose={closeModal}
        priorityConfig={priorityConfig}
      />
    </div>
  );
}
