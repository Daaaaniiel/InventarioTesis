import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleReset = async () => {
    const res = await fetch(
      `http://localhost:3000/api/auth/reset-password/${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Contraseña actualizada");
    navigate("/");
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="mb-4">Nueva contraseña</h2>

        <input
          type="password"
          placeholder="Nueva contraseña"
          onChange={(e) => setPass(e.target.value)}
          className="border p-2 mb-4 w-full"
        />

        <button
          onClick={handleReset}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Cambiar contraseña
        </button>
      </div>
    </div>
  );
}