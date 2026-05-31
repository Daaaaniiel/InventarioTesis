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
    sub_categoria: "Chairs",
  });

  // ================= GET PRODUCTOS =================
  const getProductos = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/productos",
        {
          headers: { Authorization: `Bearer ${token}` },
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
          headers: { Authorization: `Bearer ${token}` },
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

    const matchesSearch = producto.nombre
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
          headers: { Authorization: `Bearer ${token}` },
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
      nombre:       producto.nombre       || "",
      descripcion:  producto.descripcion  || "",
      precio:       producto.precio       || "",
      stock:        producto.stock        || "",
      stock_minimo: producto.stock_minimo || "",
      stock_maximo: producto.stock_maximo || "",
      categoria_id: producto.categoria_id || "",
      sku:          producto.sku          || "",
      ubicacion:    producto.ubicacion    || "",
      sub_categoria: producto.sub_categoria || "Chairs",
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
      sub_categoria: "Chairs",
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

  // ================= STOCK COLOR =================
  const getStockColor = (stock, minimo) => {
    if (stock <= 0)       return "text-red-600 bg-red-50";
    if (stock < minimo)   return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  const inputClass = "border p-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-300";

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">

      {/* HEADER */}
      <div className="mb-8">

        <div className="flex justify-between items-start mb-6">

          <div>
            <h1 className="text-3xl font-bold">Gestión de Productos</h1>
            <p className="text-gray-500 mt-1">Administra tu inventario</p>
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
              onClick={() => { limpiarForm(); setShowModal(true); }}
              className="bg-blue-600 text-white px-5 py-2 rounded-xl flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo Producto
            </button>

          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

          <Card title="Total Productos"   value={stats.totalProductos}                        icon={<Package className="w-5 h-5" />} />
          <Card title="Valor Inventario"  value={`$${stats.valorInventario.toFixed(2)}`}       icon={<DollarSign className="w-5 h-5" />} />
          <Card title="Stock Bajo"        value={stats.productosBajoStock}                     icon={<AlertCircle className="w-5 h-5" />} />
          <Card title="Ventas"            value={stats.ventasTotales}                          icon={<TrendingUp className="w-5 h-5" />} />

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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-xl"
            />
          </div>

          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border rounded-xl"
            >
              {categorias.map((cat, index) => (
                <option
                  key={index}
                  value={typeof cat === "string" ? cat : cat.nombre}
                >
                  {typeof cat === "string" ? cat : cat.nombre}
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
              <th className="p-4 text-left">Producto</th>
              <th className="p-4 text-left">SKU</th>
              <th className="p-4 text-left">Categoría</th>
              <th className="p-4 text-left">Sub-Categoría IA</th>
              <th className="p-4 text-left">Precio</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Estado</th>
              <th className="p-4 text-left">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((producto) => (
              <tr key={producto.id} className="border-t hover:bg-gray-50">

                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(producto.id)}
                    onChange={() => toggleSelectProduct(producto.id)}
                  />
                </td>

                <td className="p-4 font-medium">{producto.nombre}</td>

                <td className="p-4 text-gray-500 text-sm">{producto.sku}</td>

                <td className="p-4">{producto.categoria}</td>

                <td className="p-4">
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                    {producto.sub_categoria || "Sin asignar"}
                  </span>
                </td>

                <td className="p-4">${Number(producto.precio).toFixed(2)}</td>

                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStockColor(producto.stock, producto.stock_minimo)}`}>
                    {producto.stock}
                  </span>
                </td>

                <td className="p-4">{producto.estado}</td>

                <td className="p-4 space-x-2">
                  <button
                    onClick={() => editarProducto(producto)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 className="w-4 h-4 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(producto.id)}
                    className="text-red-600 hover:text-red-800"
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-auto p-5">

          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl">

            <h2 className="text-2xl font-bold mb-6">
              {editingProduct ? "Editar Producto" : "Nuevo Producto"}
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="text-sm font-medium">Nombre</label>
                <input
                  placeholder="Nombre del producto"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-sm font-medium">SKU</label>
                <input
                  placeholder="SKU"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Precio</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.precio}
                  onChange={(e) => setForm({ ...form, precio: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Stock</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Stock mínimo</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.stock_minimo}
                  onChange={(e) => setForm({ ...form, stock_minimo: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Stock máximo</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.stock_maximo}
                  onChange={(e) => setForm({ ...form, stock_maximo: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Ubicación</label>
                <input
                  placeholder="Ej: Bodega A"
                  value={form.ubicacion}
                  onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Categoría</label>
                <select
                  value={form.categoria_id}
                  onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Selecciona categoría</option>
                  {categorias
                    .filter((c) => c !== "todos")
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </option>
                    ))}
                </select>
              </div>

              {/* SUB-CATEGORÍA PARA LA IA */}
              <div className="col-span-2">
                <div className="border border-blue-200 rounded-xl p-4 bg-blue-50">
                  <label className="text-sm font-bold text-blue-700">
                    🤖 Sub-Categoría IA
                  </label>
                  <p className="text-xs text-blue-500 mb-2">
                    Este campo es usado por el modelo de IA para predicciones
                  </p>
                  <select
                    value={form.sub_categoria}
                    onChange={(e) => setForm({ ...form, sub_categoria: e.target.value })}
                    className={inputClass}
                  >
                    <option value="Chairs">Chairs — Sillas</option>
                    <option value="Bookcases">Bookcases — Estanterías</option>
                    <option value="Furnishings">Furnishings — Mobiliario</option>
                    <option value="Tables">Tables — Mesas</option>
                  </select>
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium">Descripción</label>
                <textarea
                  placeholder="Descripción del producto"
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className={`${inputClass} h-20 resize-none`}
                />
              </div>

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => { setShowModal(false); limpiarForm(); }}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-xl"
              >
                Cancelar
              </button>

              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl"
              >
                {editingProduct ? "Actualizar" : "Crear"}
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
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <div className="bg-gray-100 p-3 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}