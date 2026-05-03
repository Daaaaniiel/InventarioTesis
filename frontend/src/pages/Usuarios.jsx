import { useEffect, useState } from "react";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    cedula: "",
    telefono: "",
    direccion: "",
    email: "",
    password: "",
    rol: "vendedor",
  });

  const token = localStorage.getItem("token");

  // ================= GET =================
  const getUsuarios = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/usuarios", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.clear();
        window.location.href = "/";
        return;
      }

      const data = await res.json();
      setUsuarios(data);

    } catch (err) {
      console.error(err);
      alert("Error al cargar usuarios");
    }
  };

  useEffect(() => {
    getUsuarios();
  }, []);

  // ================= VALIDACIONES =================
  const validar = () => {
    if (!form.nombres || !form.apellidos || !form.email) {
      alert("Completa todos los campos obligatorios");
      return false;
    }

    if (!/^\d{10}$/.test(form.cedula)) {
      alert("Cédula inválida (10 números)");
      return false;
    }

    if (!/^\d{10}$/.test(form.telefono)) {
      alert("Teléfono inválido (10 números)");
      return false;
    }

    if (!editando && form.password.length < 6) {
      alert("Password mínimo 6 caracteres");
      return false;
    }

    return true;
  };

  // ================= CREATE / UPDATE =================
  const handleSubmit = async () => {
    if (!validar()) return;

    try {
      const url = editando
        ? `http://localhost:3000/api/usuarios/${editando}`
        : "http://localhost:3000/api/usuarios";

      const method = editando ? "PUT" : "POST";

      const body = editando
        ? {
            nombres: form.nombres,
            apellidos: form.apellidos,
            cedula: form.cedula,
            telefono: form.telefono,
            direccion: form.direccion,
            email: form.email,
            rol: form.rol,
          }
        : form;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.status === 401) {
        localStorage.clear();
        window.location.href = "/";
        return;
      }

      if (!res.ok) throw new Error(data.error);

      alert(data.message);

      limpiarForm();
      getUsuarios();

    } catch (err) {
      alert(err.message);
    }
  };

  // ================= EDITAR =================
  const editarUsuario = (u) => {
    setForm({
      nombres: u.nombres,
      apellidos: u.apellidos,
      cedula: u.cedula,
      telefono: u.telefono,
      direccion: u.direccion,
      email: u.email,
      password: "",
      rol: u.rol,
    });

    setEditando(u.id);
  };

  // ================= DESACTIVAR =================
  const eliminarUsuario = async (id) => {
    if (!confirm("¿Desactivar usuario?")) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/usuarios/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.status === 401) {
        localStorage.clear();
        window.location.href = "/";
        return;
      }

      alert(data.message);
      getUsuarios();

    } catch (err) {
      alert("Error al desactivar");
    }
  };

  // ================= LIMPIAR =================
  const limpiarForm = () => {
    setForm({
      nombres: "",
      apellidos: "",
      cedula: "",
      telefono: "",
      direccion: "",
      email: "",
      password: "",
      rol: "vendedor",
    });
    setEditando(null);
  };

  // ================= UI =================
  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-3 gap-4">

        <input placeholder="Nombres"
          value={form.nombres}
          onChange={(e)=>setForm({...form, nombres:e.target.value})}
          className="border p-2 rounded"
        />

        <input placeholder="Apellidos"
          value={form.apellidos}
          onChange={(e)=>setForm({...form, apellidos:e.target.value})}
          className="border p-2 rounded"
        />

        <input placeholder="Cédula"
          value={form.cedula}
          onChange={(e)=>setForm({...form, cedula:e.target.value})}
          className="border p-2 rounded"
        />

        <input placeholder="Teléfono"
          value={form.telefono}
          onChange={(e)=>setForm({...form, telefono:e.target.value})}
          className="border p-2 rounded"
        />

        <input placeholder="Dirección"
          value={form.direccion}
          onChange={(e)=>setForm({...form, direccion:e.target.value})}
          className="border p-2 rounded"
        />

        <input type="email" placeholder="Email"
          value={form.email}
          onChange={(e)=>setForm({...form, email:e.target.value})}
          className="border p-2 rounded"
        />

        {!editando && (
          <input type="password" placeholder="Password"
            value={form.password}
            onChange={(e)=>setForm({...form, password:e.target.value})}
            className="border p-2 rounded"
          />
        )}

        <select
          value={form.rol}
          onChange={(e)=>setForm({...form, rol:e.target.value})}
          className="border p-2 rounded"
        >
          <option value="vendedor">Vendedor</option>
          <option value="admin">Admin</option>
        </select>

        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 rounded col-span-3"
        >
          {editando ? "Actualizar" : "Crear"}
        </button>

      </div>

      {/* TABLA */}
      <div className="bg-white rounded-xl shadow">
        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Cédula</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="text-center border-t">

                <td>{u.id}</td>
                <td>{u.nombres} {u.apellidos}</td>
                <td>{u.cedula}</td>
                <td>{u.telefono}</td>
                <td>{u.email}</td>
                <td>{u.rol}</td>

                <td>
                  <span className={`px-2 py-1 rounded text-white ${
                    u.activo ? "bg-green-500" : "bg-red-500"
                  }`}>
                    {u.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>

                <td className="space-x-2">
                  <button
                    onClick={()=>editarUsuario(u)}
                    className="bg-yellow-400 px-2 rounded"
                  >
                    Editar
                  </button>

                  <button
                    onClick={()=>eliminarUsuario(u.id)}
                    className="bg-red-500 text-white px-2 rounded"
                  >
                    Desactivar
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}