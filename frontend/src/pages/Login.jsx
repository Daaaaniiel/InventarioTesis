import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [rol, setRol] = useState("vendedor");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [cedula, setCedula] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  const navigate = useNavigate();

  const clearForm = () => {
    setEmail("");
    setPass("");
    setRol("vendedor");
    setNombres("");
    setApellidos("");
    setCedula("");
    setTelefono("");
    setDireccion("");
  };

  const validate = () => {
    if (!email.includes("@")) return "Email inválido";
    if (pass.length < 6) return "Password mínimo 6 caracteres";

    if (isRegister) {
      const regex = /^\d{10}$/;
      if (!nombres || !apellidos) return "Nombre y apellido requeridos";
      if (!regex.test(cedula)) return "Cédula inválida";
      if (!regex.test(telefono)) return "Teléfono inválido";
    }
    return null;
  };

  const handleSubmit = async () => {
    try {
      const error = validate();
      if (error) return alert(error);

      const url = isRegister
        ? "http://localhost:3000/api/auth/register"
        : "http://localhost:3000/api/auth/login";

      const body = isRegister
        ? {
            email,
            password: pass,
            rol,
            nombres,
            apellidos,
            cedula,
            telefono,
            direccion,
          }
        : { email, password: pass };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error");
      }

      if (isRegister) {
        alert("Revisa tu correo para verificar tu cuenta");
        if (data.devLink) console.log("🔗 VERIFY LINK:", data.devLink);
        setIsRegister(false);
        clearForm();
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      clearForm();
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4">
      {/* TITLE */}
      <h1 className="text-5xl font-bold mb-8 tracking-tight">
        <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
          {isRegister ? "Register" : "Sign In"}
        </span>{" "}
        <span className="text-gray-700">Form</span>
      </h1>

      {/* CARD */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
        {/* LEFT SECTION - FORM */}
        <div className="w-full md:w-1/2 p-8 lg:p-12 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isRegister ? "Create Account" : "Hello!"}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {isRegister
                ? "Register a new account"
                : "Sign into your account"}
            </p>
          </div>

          <div className="space-y-4">
            {/* REGISTER FIELDS */}
            {isRegister && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    className="input-field"
                    placeholder="Nombres"
                    value={nombres}
                    onChange={(e) => setNombres(e.target.value)}
                  />
                  <input
                    className="input-field"
                    placeholder="Apellidos"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                  />
                </div>
                <input
                  className="input-field"
                  placeholder="Cédula"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                />
                <input
                  className="input-field"
                  placeholder="Teléfono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
                <input
                  className="input-field"
                  placeholder="Dirección"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </>
            )}

            {/* EMAIL */}
            <input
              type="email"
              placeholder="Correo electrónico"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* PASSWORD */}
            <input
              type="password"
              placeholder="Contraseña"
              className="input-field"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />

            {/* ROLES */}
            {isRegister && (
              <div className="flex gap-3 my-2">
                <button
                  type="button"
                  onClick={() => setRol("vendedor")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    rol === "vendedor"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Vendedor
                </button>
                <button
                  type="button"
                  onClick={() => setRol("admin")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    rol === "admin"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Admin
                </button>
              </div>
            )}

            {/* FORGOT PASSWORD */}
            {!isRegister && (
              <div className="text-right">
                <span
                  className="text-sm text-cyan-600 hover:text-cyan-700 cursor-pointer transition-colors duration-200 hover:underline"
                  onClick={async () => {
                    try {
                      const emailInput = prompt("Ingresa tu correo");
                      if (!emailInput) {
                        alert("Debes ingresar un correo");
                        return;
                      }
                      const res = await fetch(
                        "http://localhost:3000/api/auth/forgot-password",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email: emailInput }),
                        }
                      );
                      const data = await res.json();
                      alert(data.message);
                      if (data.devLink) {
                        console.log("🔗 RESET LINK:", data.devLink);
                        alert("Modo desarrollo: revisa la consola");
                      }
                    } catch (err) {
                      alert("Error al procesar solicitud");
                      console.error(err);
                    }
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </span>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
            >
              {isRegister ? "REGISTRARME" : "INICIAR SESIÓN"}
            </button>

            {/* SWITCH MODE */}
            <p className="text-center text-sm text-gray-500 pt-2">
              {isRegister
                ? "¿Ya tienes una cuenta?"
                : "¿No tienes una cuenta?"}{" "}
              <span
                className="text-cyan-600 font-semibold cursor-pointer hover:underline transition-colors"
                onClick={() => {
                  setIsRegister(!isRegister);
                  clearForm();
                }}
              >
                {isRegister ? "Iniciar sesión" : "Crear cuenta"}
              </span>
            </p>
          </div>
        </div>

        {/* RIGHT SECTION - BRANDING */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-cyan-500 to-blue-700 flex flex-col justify-center items-center text-white p-8 lg:p-12">
          <div className="text-center max-w-sm">
            <div className="mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-3">
              {isRegister ? "¡Únete a nosotros!" : "¡Bienvenido de vuelta!"}
            </h2>
            <p className="text-sm text-white/80 leading-relaxed">
              {isRegister
                ? "Crea tu cuenta y comienza a gestionar tu sistema de manera fácil y segura."
                : "Accede a tu panel de control y administra tus datos con total seguridad."}
            </p>
          </div>
        </div>
      </div>

      {/* Custom CSS Styles */}
      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 0.625rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          background-color: #f9fafb;
        }
        .input-field:focus {
          outline: none;
          border-color: #06b6d4;
          ring: 2px solid #06b6d4;
          background-color: white;
          box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
        }
        .input-field:hover {
          border-color: #cbd5e1;
        }
      `}</style>
    </div>
  );
}