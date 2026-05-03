import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import Inventario from "./pages/Inventario";
import Ventas from "./pages/Ventas";
import IA from "./pages/IA";
import Verify from "./pages/Verify";
import ResetPassword from "./pages/ResetPassword";
import Usuarios from "./pages/Usuarios";

import MainLayout from "./layouts/MainLayout";

import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/*  RUTAS PÚBLICAS */}
        <Route path="/" element={<Login />} />
        <Route path="/verify/:token" element={<Verify />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/*  RUTAS PRIVADAS */}
        <Route element={<PrivateRoute />}>
          
          {/* Layout protegido */}
          <Route element={<MainLayout />}>

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/ia" element={<IA />} />

            {/*  SOLO ADMIN */}
            <Route element={<AdminRoute />}>
              <Route path="/usuarios" element={<Usuarios />} />
            </Route>

          </Route>
        </Route>

        {/*  fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}