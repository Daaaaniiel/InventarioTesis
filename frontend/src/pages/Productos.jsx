import { useEffect, useState } from "react";

import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  TrendingUp,
  DollarSign,
  AlertCircle,
  ChevronDown,
  Download,
  Printer,
} from "lucide-react";

export default function ProductosPremium() {

  const token = localStorage.getItem("token");

  // ================= STATES =================
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState(["todos"]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [selectedProducts, setSelectedProducts] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    stock_minimo: "",
    stock_maximo: "",
    categoria_id: "",
    sku: "",
    ubicacion: "",
  });

  // ================= GET PRODUCTOS =================
  const getProductos = async () => {
    try {

      const res = await fetch(
        "http://localhost:3000/api/productos",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setProductos(data);

    } catch (err) {
      console.error(err);
      alert("Error al cargar productos");
    }
  };

  // ================= GET CATEGORIAS =================
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

      setCategorias(["todos", ...data]);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getProductos();
    getCategorias();
  }, []);

  // ================= STATS =================
  const stats = {
    totalProductos: productos.length,

    valorInventario: productos.reduce(
      (sum, p) => sum + Number(p.precio) * Number(p.stock),
      0
    ),

    productosBajoStock: productos.filter(
      (p) => p.stock < p.stock_minimo
    ).length,

    ventasTotales: productos.reduce(
      (sum, p) => sum + (p.ventas || 0),
      0
    ),
  };

  // ================= FILTER =================
  const filteredProducts = productos.filter((producto) => {

    const matchesSearch =
      producto.nombre
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "todos" ||
      producto.categoria === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // ================= CREATE / UPDATE =================
  const handleSubmit = async () => {
    try {

      const url = editingProduct
        ? `http://localhost:3000/api/productos/${editingProduct.id}`
        : "http://localhost:3000/api/productos";

      const method = editingProduct ? "PUT" : "POST";

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

      setShowModal(false);

      limpiarForm();

      getProductos();

    } catch (err) {
      alert(err.message);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {

    if (!window.confirm("¿Eliminar producto?")) return;

    try {

      const res = await fetch(
        `http://localhost:3000/api/productos/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      alert(data.message);

      getProductos();

    } catch (err) {
      alert("Error al eliminar");
    }
  };

  // ================= EDIT =================
  const editarProducto = (producto) => {

    setEditingProduct(producto);

    setForm({
      nombre: producto.nombre || "",
      descripcion: producto.descripcion || "",
      precio: producto.precio || "",
      stock: producto.stock || "",
      stock_minimo: producto.stock_minimo || "",
      stock_maximo: producto.stock_maximo || "",
      categoria_id: producto.categoria_id || "",
      sku: producto.sku || "",
      ubicacion: producto.ubicacion || "",
    });

    setShowModal(true);
  };

  // ================= LIMPIAR =================
  const limpiarForm = () => {

    setForm({
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      stock_minimo: "",
      stock_maximo: "",
      categoria_id: "",
      sku: "",
      ubicacion: "",
    });

    setEditingProduct(null);
  };

  // ================= SELECT =================
  const toggleSelectProduct = (id) => {

    setSelectedProducts((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  };

  // ================= UI HELPERS =================
  const getStockColor = (stock, minimo) => {

    if (stock <= 0) {
      return "text-red-600 bg-red-50";
    }

    if (stock < minimo) {
      return "text-yellow-600 bg-yellow-50";
    }

    return "text-green-600 bg-green-50";
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">

      {/* HEADER */}
      <div className="mb-8">

        <div className="flex justify-between items-start mb-6">

          <div>
            <h1 className="text-3xl font-bold">
              Gestión de Productos
            </h1>

            <p className="text-gray-500 mt-1">
              Administra tu inventario
            </p>
          </div>

          <div className="flex gap-3">

            <button className="bg-white px-4 py-2 rounded-xl shadow-sm flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </button>

            <button className="bg-white px-4 py-2 rounded-xl shadow-sm flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Imprimir
            </button>

            <button
              onClick={() => {
                limpiarForm();
                setShowModal(true);
              }}
              className="bg-blue-600 text-white px-5 py-2 rounded-xl flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo Producto
            </button>

          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

          <Card
            title="Total Productos"
            value={stats.totalProductos}
            icon={<Package className="w-5 h-5" />}
          />

          <Card
            title="Valor Inventario"
            value={`$${stats.valorInventario.toFixed(2)}`}
            icon={<DollarSign className="w-5 h-5" />}
          />

          <Card
            title="Stock Bajo"
            value={stats.productosBajoStock}
            icon={<AlertCircle className="w-5 h-5" />}
          />

          <Card
            title="Ventas"
            value={stats.ventasTotales}
            icon={<TrendingUp className="w-5 h-5" />}
          />

        </div>
      </div>

      {/* FILTROS */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">

        <div className="flex gap-4">

          <div className="relative flex-1">

            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full pl-10 pr-4 py-2 border rounded-xl"
            />
          </div>

          <div className="relative">

            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value)
              }
              className="appearance-none pl-4 pr-10 py-2 border rounded-xl"
            >
              {categorias.map((cat, index) => (
                <option
                  key={index}
                  value={
                    typeof cat === "string"
                      ? cat
                      : cat.nombre
                  }
                >
                  {typeof cat === "string"
                    ? cat
                    : cat.nombre}
                </option>
              ))}
            </select>

            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400" />

          </div>
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4"></th>
              <th>Producto</th>
              <th>SKU</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>

            </tr>
          </thead>

          <tbody>

            {filteredProducts.map((producto) => (

              <tr
                key={producto.id}
                className="border-t text-center hover:bg-gray-50"
              >

                <td>
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(producto.id)}
                    onChange={() =>
                      toggleSelectProduct(producto.id)
                    }
                  />
                </td>

                <td className="p-4">
                  {producto.nombre}
                </td>

                <td>{producto.sku}</td>

                <td>{producto.categoria}</td>

                <td>
                  ${Number(producto.precio).toFixed(2)}
                </td>

                <td>

                  <span
                    className={`px-2 py-1 rounded text-xs ${getStockColor(
                      producto.stock,
                      producto.stock_minimo
                    )}`}
                  >
                    {producto.stock}
                  </span>

                </td>

                <td>
                  {producto.estado}
                </td>

                <td className="space-x-2">

                  <button
                    onClick={() =>
                      editarProducto(producto)
                    }
                    className="text-blue-600"
                  >
                    <Edit2 className="w-4 h-4 inline" />
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(producto.id)
                    }
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-6 w-[700px]">

            <h2 className="text-2xl font-bold mb-6">
              {editingProduct
                ? "Editar Producto"
                : "Nuevo Producto"}
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <input
                placeholder="Nombre"
                value={form.nombre}
                onChange={(e)=>
                  setForm({...form, nombre:e.target.value})
                }
                className="border p-2 rounded"
              />

              <input
                placeholder="SKU"
                value={form.sku}
                onChange={(e)=>
                  setForm({...form, sku:e.target.value})
                }
                className="border p-2 rounded"
              />

              <input
                type="number"
                placeholder="Precio"
                value={form.precio}
                onChange={(e)=>
                  setForm({...form, precio:e.target.value})
                }
                className="border p-2 rounded"
              />

              <input
                type="number"
                placeholder="Stock"
                value={form.stock}
                onChange={(e)=>
                  setForm({...form, stock:e.target.value})
                }
                className="border p-2 rounded"
              />

              <input
                type="number"
                placeholder="Stock mínimo"
                value={form.stock_minimo}
                onChange={(e)=>
                  setForm({...form, stock_minimo:e.target.value})
                }
                className="border p-2 rounded"
              />

              <input
                type="number"
                placeholder="Stock máximo"
                value={form.stock_maximo}
                onChange={(e)=>
                  setForm({...form, stock_maximo:e.target.value})
                }
                className="border p-2 rounded"
              />

              <input
                placeholder="Ubicación"
                value={form.ubicacion}
                onChange={(e)=>
                  setForm({...form, ubicacion:e.target.value})
                }
                className="border p-2 rounded"
              />

              <select
                value={form.categoria_id}
                onChange={(e)=>
                  setForm({...form, categoria_id:e.target.value})
                }
                className="border p-2 rounded"
              >

                <option value="">
                  Selecciona categoría
                </option>

                {categorias
                  .filter(c => c !== "todos")
                  .map((cat) => (
                    <option
                      key={cat.id}
                      value={cat.id}
                    >
                      {cat.nombre}
                    </option>
                  ))}

              </select>

              <textarea
                placeholder="Descripción"
                value={form.descripcion}
                onChange={(e)=>
                  setForm({...form, descripcion:e.target.value})
                }
                className="border p-2 rounded col-span-2"
              />

            </div>

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
                className="bg-blue-600 text-white px-5 py-2 rounded"
              >
                {editingProduct
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

// ================= CARD =================
function Card({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5">
      <div className="flex justify-between">
        <div>
          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h3 className="text-2xl font-bold">
            {value}
          </h3>
        </div>

        <div className="bg-gray-100 p-3 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}