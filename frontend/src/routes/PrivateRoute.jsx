import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const token = localStorage.getItem("token");

  console.log("TOKEN:", token); // 👈 DEBUG

  if (!token) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}