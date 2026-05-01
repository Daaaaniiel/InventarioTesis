import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [rol, setRol] = useState("vendedor");

  const navigate = useNavigate();

  // 🔥 limpiar formulario
  const clearForm = () => {
    setEmail("");
    setPass("");
    setRol("vendedor");
  };

  const handleSubmit = async () => {
    try {
      const url = isRegister
        ? "http://localhost:3000/api/auth/register"
        : "http://localhost:3000/api/auth/login";

      const body = isRegister
        ? { email, password: pass, rol }
        : { email, password: pass };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error");
      }

      // 🟢 REGISTRO
      if (isRegister) {
        alert("Revisa tu correo para verificar tu cuenta");
        setIsRegister(false);
        clearForm(); // 🔥 limpiar
        return;
      }

      // 🔐 LOGIN
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      clearForm(); // 🔥 limpiar
      navigate("/dashboard");

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="h-screen bg-[#f3f4f6] flex flex-col items-center justify-center">

      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-10">
        <span className="font-extrabold">
          {isRegister ? "Register" : "Sign In"}
        </span>{" "}
        form
      </h1>

      {/* CARD */}
      <div className="w-[900px] h-[450px] bg-white rounded-3xl shadow-2xl flex overflow-hidden">

        {/* LEFT */}
        <div className="w-1/2 flex flex-col justify-center px-12">

          <h2 className="text-xl font-semibold mb-1">
            {isRegister ? "Create Account" : "Hello!"}
          </h2>

          <p className="text-gray-400 text-sm mb-6">
            {isRegister
              ? "Register a new account"
              : "Sign into your account"}
          </p>

          {/* EMAIL */}
          <div className="mb-4">
            <input
              type="email"
              value={email} // 🔥 controlado
              placeholder="E-mail"
              className="w-full px-4 py-2 rounded-full bg-[#f5f7fb] shadow-inner outline-none text-sm"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-3">
            <input
              type="password"
              value={pass} // 🔥 controlado
              placeholder="Password"
              className="w-full px-4 py-2 rounded-full bg-[#f5f7fb] shadow-inner outline-none text-sm"
              onChange={(e) => setPass(e.target.value)}
            />
          </div>

          {/* SELECTOR DE ROL */}
          {isRegister && (
            <div className="mb-4 flex justify-center gap-4">
              
              <button
                type="button"
                onClick={() => setRol("vendedor")}
                className={`px-4 py-1 rounded-full text-sm border transition ${
                  rol === "vendedor"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Vendedor
              </button>

              <button
                type="button"
                onClick={() => setRol("admin")}
                className={`px-4 py-1 rounded-full text-sm border transition ${
                  rol === "admin"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Admin
              </button>

            </div>
          )}

          {/* OPTIONS */}
          {!isRegister && (
            <div className="flex justify-between text-xs text-gray-400 mb-4">
              <span className="flex items-center gap-1">
                <input type="checkbox" />
                Remember me
              </span>
              <span className="cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>
          )}

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            className="w-40 mx-auto bg-gradient-to-r from-cyan-400 to-blue-500 text-white py-2 rounded-full text-sm shadow-md hover:opacity-90 transition"
          >
            {isRegister ? "REGISTER" : "SIGN IN"}
          </button>

          {/* SWITCH */}
          <p className="text-xs text-center text-gray-400 mt-4">
            {isRegister ? "Already have an account?" : "Don’t have an account?"}{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => {
                setIsRegister(!isRegister);
                clearForm(); // 🔥 limpiar al cambiar
              }}
            >
              {isRegister ? "Login" : "Create"}
            </span>
          </p>

        </div>

        {/* RIGHT */}
        <div className="w-1/2 bg-gradient-to-b from-cyan-400 to-blue-500 flex flex-col justify-center items-center text-white px-10">

          <h2 className="text-2xl font-bold mb-4">
            {isRegister ? "Join Us!" : "Welcome Back!"}
          </h2>

          <p className="text-center text-sm opacity-80 leading-relaxed">
            {isRegister
              ? "Create your account and start managing your system."
              : "Access your dashboard and manage your data easily."}
          </p>

        </div>
      </div>
    </div>
  );
}