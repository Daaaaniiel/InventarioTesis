import { useEffect, useState } from "react";

export default function Categorias() {

  const token = localStorage.getItem("token");

  const [categorias, setCategorias] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
  });

  // ================= GET =================
  const getCategorias = async () => {

    try {

      const res = await fetch(
        "http://localhost:3000/api/categorias",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setCategorias(data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategorias();
  }, []);

  // ================= CREATE / UPDATE =================
  const handleSubmit = async () => {

    try {

      const url = editando
        ? `http://localhost:3000/api/categorias/${editando}`
        : "http://localhost:3000/api/categorias";

      const method = editando
        ? "PUT"
        : "POST";

      const res = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      alert(data.message);

      limpiarForm();

      setShowModal(false);

      getCategorias();

    } catch (error) {
      alert(error.message);
    }
  };

  // ================= EDITAR =================
  const editarCategoria = (cat) => {

    setEditando(cat.id);

    setForm({
      nombre: cat.nombre,
      descripcion: cat.descripcion,
    });

    setShowModal(true);
  };

  // ================= DELETE =================
  const eliminarCategoria = async (id) => {

    if (!confirm("¿Eliminar categoría?")) {
      return;
    }

    try {

      const res = await fetch(
        `http://localhost:3000/api/categorias/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      alert(data.message);

      getCategorias();

    } catch (error) {
      console.log(error);
    }
  };

  // ================= LIMPIAR =================
  const limpiarForm = () => {

    setEditando(null);

    setForm({
      nombre: "",
      descripcion: "",
    });
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Categorías
        </h1>

        <button
          onClick={() => {
            limpiarForm();
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl"
        >
          + Nueva Categoría
        </button>

      </div>

      {/* TABLA */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-4">ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>

          </thead>

          <tbody>

            {categorias.map((cat) => (

              <tr
                key={cat.id}
                className="border-t text-center"
              >

                <td className="p-4">
                  {cat.id}
                </td>

                <td>
                  {cat.nombre}
                </td>

                <td>
                  {cat.descripcion}
                </td>

                <td className="space-x-2">

                  <button
                    onClick={() => editarCategoria(cat)}
                    className="bg-yellow-400 px-3 py-1 rounded"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => eliminarCategoria(cat.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>

                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white rounded-2xl p-6 w-[500px]">

            <h2 className="text-2xl font-bold mb-6">

              {editando
                ? "Editar Categoría"
                : "Nueva Categoría"}

            </h2>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="Nombre"
                value={form.nombre}
                onChange={(e)=>
                  setForm({
                    ...form,
                    nombre:e.target.value
                  })
                }
                className="w-full border p-3 rounded-xl"
              />

              <textarea
                placeholder="Descripción"
                value={form.descripcion}
                onChange={(e)=>
                  setForm({
                    ...form,
                    descripcion:e.target.value
                  })
                }
                className="w-full border p-3 rounded-xl"
              />

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => {
                  setShowModal(false);
                  limpiarForm();
                }}
                className="bg-gray-300 px-4 py-2 rounded-xl"
              >
                Cancelar
              </button>

              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-5 py-2 rounded-xl"
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