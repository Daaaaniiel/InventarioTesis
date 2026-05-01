import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (
      (email === "admin@test.com" && pass === "1234") ||
      (email === "user@test.com" && pass === "1234")
    ) {
      navigate("/dashboard");
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="h-screen bg-[#f3f4f6] flex flex-col items-center justify-center">

      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-10">
        <span className="font-extrabold">Sign In</span> form
      </h1>

      {/* CARD */}
      <div className="w-[900px] h-[450px] bg-white rounded-3xl shadow-2xl flex overflow-hidden">

        {/* LEFT */}
        <div className="w-1/2 flex flex-col justify-center px-12">

          <h2 className="text-xl font-semibold mb-1">Hello!</h2>
          <p className="text-gray-400 text-sm mb-6">
            Sign into Your account
          </p>

          {/* INPUT EMAIL */}
          <div className="mb-4 relative">
            <input
              type="email"
              placeholder="E-mail"
              className="w-full px-4 py-2 rounded-full bg-[#f5f7fb] shadow-inner outline-none text-sm focus:ring-2 focus:ring-cyan-400"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* INPUT PASSWORD */}
          <div className="mb-3 relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded-full bg-[#f5f7fb] shadow-inner outline-none text-sm focus:ring-2 focus:ring-cyan-400"
              onChange={(e) => setPass(e.target.value)}
            />
          </div>

          {/* OPTIONS */}
          <div className="flex justify-between text-xs text-gray-400 mb-4">
            <span className="flex items-center gap-1">
              <input type="checkbox" />
              Remember me
            </span>
            <span className="cursor-pointer hover:underline">
              Forgot password?
            </span>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleLogin}
            className="w-40 mx-auto bg-gradient-to-r from-cyan-400 to-blue-500 text-white py-2 rounded-full text-sm shadow-md hover:opacity-90 transition"
          >
            SIGN IN
          </button>

          {/* FOOTER */}
          <p className="text-xs text-center text-gray-400 mt-4">
            Don’t have an account?{" "}
            <span className="text-blue-500 cursor-pointer">Create</span>
          </p>
        </div>

        {/* RIGHT */}
        <div className="w-1/2 bg-gradient-to-b from-cyan-400 to-blue-500 flex flex-col justify-center items-center text-white px-10">

          <h2 className="text-2xl font-bold mb-4">
            Welcome Back!
          </h2>

          <p className="text-center text-sm opacity-80 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

        </div>
      </div>
    </div>
  );
}