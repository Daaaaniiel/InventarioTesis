import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass =
    "block p-2 rounded-lg transition hover:bg-white/20";

  const activeClass =
    "bg-white/30";

  return (
    <div className="w-64 bg-gradient-to-b from-cyan-500 to-blue-600 text-white p-6">

      <h2 className="text-2xl font-bold mb-10">Inventario</h2>

      <nav className="space-y-3 text-sm">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/productos"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Productos
        </NavLink>

        <NavLink
          to="/inventario"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Inventario
        </NavLink>

        <NavLink
          to="/ventas"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Ventas
        </NavLink>

        <NavLink
          to="/ia"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          IA Predictiva
        </NavLink>

      </nav>
    </div>
  );
}