import { useEffect, useState } from "react";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(null);

  //  modal
  const [showModal, setShowModal] = useState(false);

  //  búsqueda
  const [search, setSearch] = useState("");

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

  // ================= FILTRO BUSCADOR =================
  const usuariosFiltrados = usuarios.filter((u) => {
    const texto = search.toLowerCase();

    return (
      u.nombres?.toLowerCase().includes(texto) ||
      u.apellidos?.toLowerCase().includes(texto) ||
      u.email?.toLowerCase().includes(texto) ||
      u.cedula?.includes(texto) ||
      u.telefono?.includes(texto)
    );
  });

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
      setShowModal(false);

      getUsuarios();

    } catch (err) {
      alert(err.message);
    }
  };

  // ================= EDITAR =================
  const editarUsuario = (u) => {
    setForm({
      nombres: u.nombres || "",
      apellidos: u.apellidos || "",
      cedula: u.cedula || "",
      telefono: u.telefono || "",
      direccion: u.direccion || "",
      email: u.email || "",
      password: "",
      rol: u.rol || "vendedor",
    });

    setEditando(u.id);

    // 🔥 abrir modal
    setShowModal(true);
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

  // ================= NUEVO =================
  const nuevoUsuario = () => {
    limpiarForm();
    setShowModal(true);
  };

  // ================= UI =================
  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">
          Gestión de Usuarios
        </h1>

        <div className="flex gap-3">

          {/* 🔍 BUSCADOR */}
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded-lg w-64"
          />

          {/* BOTÓN */}
          <button
            onClick={nuevoUsuario}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
          >
            + Crear Usuario
          </button>

        </div>

      </div>

      {/* TABLA */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr className="text-center">
              <th className="p-3">ID</th>
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
            {usuariosFiltrados.map((u) => (
              <tr
                key={u.id}
                className="text-center border-t hover:bg-gray-50"
              >
                <td className="p-3">{u.id}</td>

                <td>
                  {u.nombres} {u.apellidos}
                </td>

                <td>{u.cedula}</td>

                <td>{u.telefono}</td>

                <td>{u.email}</td>

                <td>{u.rol}</td>

                <td>
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${
                      u.activo
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {u.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>

                <td className="space-x-2">

                  <button
                    onClick={() => editarUsuario(u)}
                    className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => eliminarUsuario(u.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Desactivar
                  </button>

                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[900px] rounded-2xl p-6 shadow-2xl">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">

              <h2 className="text-xl font-bold">
                {editando
                  ? "Editar Usuario"
                  : "Crear Usuario"}
              </h2>

              <button
                onClick={() => {
                  setShowModal(false);
                  limpiarForm();
                }}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>

            </div>

            {/* FORM */}
            <div className="grid grid-cols-3 gap-4">

              <input
                placeholder="Nombres"
                value={form.nombres}
                onChange={(e)=>
                  setForm({...form, nombres:e.target.value})
                }
                className="border p-2 rounded"
              />

              <input
                placeholder="Apellidos"
                value={form.apellidos}
                onChange={(e)=>
                  setForm({...form, apellidos:e.target.value})
                }
                className="border p-2 rounded"
              />

              <input
                placeholder="Cédula"
                value={form.cedula}
                onChange={(e)=>
                  setForm({...form, cedula:e.target.value})
                }
                className="border p-2 rounded"
              />

              <input
                placeholder="Teléfono"
                value={form.telefono}
                onChange={(e)=>
                  setForm({...form, telefono:e.target.value})
                }
                className="border p-2 rounded"
              />

              <input
                placeholder="Dirección"
                value={form.direccion}
                onChange={(e)=>
                  setForm({...form, direccion:e.target.value})
                }
                className="border p-2 rounded"
              />

              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e)=>
                  setForm({...form, email:e.target.value})
                }
                className="border p-2 rounded"
              />

              {!editando && (
                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e)=>
                    setForm({...form, password:e.target.value})
                  }
                  className="border p-2 rounded"
                />
              )}

              <select
                value={form.rol}
                onChange={(e)=>
                  setForm({...form, rol:e.target.value})
                }
                className="border p-2 rounded"
              >
                <option value="vendedor">
                  Vendedor
                </option>

                <option value="admin">
                  Admin
                </option>
              </select>

            </div>

            {/* BOTONES */}
            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => {
                  setShowModal(false);
                  limpiarForm();
                }}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Cancelar
              </button>

              <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded"
              >
                {editando
                  ? "Actualizar"
                  : "Crear"}
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}