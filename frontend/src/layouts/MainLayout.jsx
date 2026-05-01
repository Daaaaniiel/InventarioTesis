import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="h-screen flex bg-[#f2f3f7]">

      {/* Sidebar */}
      <Sidebar />

      {/* Contenido */}
      <div className="flex-1 flex flex-col">

        <Topbar />

        <div className="p-6 overflow-y-auto">
          <Outlet />
        </div>

      </div>
    </div>
  );
}