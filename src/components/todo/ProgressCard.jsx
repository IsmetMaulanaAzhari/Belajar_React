export default function ProgressCard({ progressPercent, completedCount, activeCount, overdueCount }) {
  return (
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
  );
}
