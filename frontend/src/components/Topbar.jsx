export default function Topbar() {
  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">

      <input
        type="text"
        placeholder="Buscar..."
        className="px-4 py-2 rounded-full bg-[#f5f7fb] text-sm outline-none w-64"
      />

      <div className="flex items-center gap-4">
        <span>🔔</span>
        <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
      </div>

    </div>
  );
}