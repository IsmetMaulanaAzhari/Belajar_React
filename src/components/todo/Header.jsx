export default function Header() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 flex items-center justify-center gap-4">
        <span className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl shadow-lg">
          📋
        </span>
        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Task Manager
        </span>
      </h1>
      <p className="text-purple-200">Kelola tugas dan deadline dengan mudah</p>
    </div>
  );
}
