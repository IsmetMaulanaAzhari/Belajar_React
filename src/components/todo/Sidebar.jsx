import ProgressCard from "./ProgressCard";
import FilterButtons from "./FilterButtons";

export default function Sidebar({
  onAddTask,
  progressPercent,
  completedCount,
  activeCount,
  overdueCount,
  filter,
  setFilter,
  filterLabels,
}) {
  return (
    <div className="lg:col-span-1 space-y-4">
      {/* Add Task Button */}
      <button
        onClick={onAddTask}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg"
      >
        <span className="text-2xl">➕</span>
        Tambah Tugas
      </button>

      {/* Progress Card */}
      <ProgressCard
        progressPercent={progressPercent}
        completedCount={completedCount}
        activeCount={activeCount}
        overdueCount={overdueCount}
      />

      {/* Filter Buttons */}
      <FilterButtons
        filter={filter}
        setFilter={setFilter}
        filterLabels={filterLabels}
      />
    </div>
  );
}
