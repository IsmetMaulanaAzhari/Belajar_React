export default function FilterButtons({ filter, setFilter, filterLabels }) {
  return (
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
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                filter === key ? "bg-white/20" : "bg-white/10"
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
