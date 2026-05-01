import { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  MoreVertical,
  Package,
  TrendingUp,
  DollarSign,
  AlertCircle,
  ChevronDown,
  Download,
  Printer,
  Eye
} from "lucide-react";

export default function ProductosPremium() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Datos de productos mejorados
  const [productos, setProductos] = useState([
    { 
      id: 1, 
      nombre: "Laptop HP Pavilion", 
      precio: 899.99, 
      stock: 45, 
      categoria: "Electrónica",
      ventas: 234,
      estado: "activo",
      sku: "HP-001",
      imagen: "💻"
    },
    { 
      id: 2, 
      nombre: "Mouse Logitech MX Master", 
      precio: 89.99, 
      stock: 120, 
      categoria: "Periféricos",
      ventas: 567,
      estado: "activo",
      sku: "LOG-002",
      imagen: "🖱️"
    },
    { 
      id: 3, 
      nombre: "Teclado Mecánico RGB", 
      precio: 129.99, 
      stock: 32, 
      categoria: "Periféricos",
      ventas: 345,
      estado: "activo",
      sku: "TEC-003",
      imagen: "⌨️"
    },
    { 
      id: 4, 
      nombre: "Monitor 4K UltraWide", 
      precio: 499.99, 
      stock: 18, 
      categoria: "Electrónica",
      ventas: 89,
      estado: "bajo_stock",
      sku: "MON-004",
      imagen: "🖥️"
    },
    { 
      id: 5, 
      nombre: "Auriculares Gaming", 
      precio: 79.99, 
      stock: 67, 
      categoria: "Audio",
      ventas: 178,
      estado: "activo",
      sku: "AUR-005",
      imagen: "🎧"
    },
  ]);

  const categorias = ["todos", "Electrónica", "Periféricos", "Audio"];

  // Estadísticas
  const stats = {
    totalProductos: productos.length,
    valorInventario: productos.reduce((sum, p) => sum + (p.precio * p.stock), 0),
    productosBajoStock: productos.filter(p => p.stock < 20).length,
    ventasTotales: productos.reduce((sum, p) => sum + p.ventas, 0)
  };

  // Filtrar productos
  const filteredProducts = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "todos" || producto.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Funciones CRUD
  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      setProductos(productos.filter(p => p.id !== id));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`¿Eliminar ${selectedProducts.length} productos?`)) {
      setProductos(productos.filter(p => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
    }
  };

  const toggleSelectProduct = (id) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p.id !== id) : [...prev, id]
    );
  };

  const getStockColor = (stock) => {
    if (stock < 10) return "text-red-600 bg-red-50";
    if (stock < 30) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      activo: "bg-green-100 text-green-800",
      bajo_stock: "bg-yellow-100 text-yellow-800",
      agotado: "bg-red-100 text-red-800"
    };
    const texts = {
      activo: "Activo",
      bajo_stock: "Stock Bajo",
      agotado: "Agotado"
    };
    return { className: badges[estado] || badges.activo, text: texts[estado] || "Activo" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Gestión de Productos
            </h1>
            <p className="text-gray-500 mt-1">Administra tu inventario y productos</p>
          </div>
          
          <div className="flex gap-3">
            <button className="bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="text-sm">Exportar</span>
            </button>
            <button className="bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2">
              <Printer className="w-4 h-4" />
              <span className="text-sm">Imprimir</span>
            </button>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Producto</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { title: "Total Productos", value: stats.totalProductos, icon: Package, color: "from-blue-500 to-blue-600", bgColor: "bg-blue-50" },
            { title: "Valor Inventario", value: `$${stats.valorInventario.toLocaleString()}`, icon: DollarSign, color: "from-emerald-500 to-emerald-600", bgColor: "bg-emerald-50" },
            { title: "Productos Críticos", value: stats.productosBajoStock, icon: AlertCircle, color: "from-red-500 to-red-600", bgColor: "bg-red-50" },
            { title: "Ventas Totales", value: stats.ventasTotales, icon: TrendingUp, color: "from-purple-500 to-purple-600", bgColor: "bg-purple-50" },
          ].map((stat) => (
            <div key={stat.title} className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start">
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <stat.icon className="w-5 h-5 text-gray-700" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-gray-500 text-sm mt-1">{stat.title}</p>
                </div>
              </div>
              <div className={`h-1 bg-gradient-to-r ${stat.color} rounded-full mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
            </div>
          ))}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === "todos" ? "Todas las categorías" : cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {selectedProducts.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar ({selectedProducts.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={() => {
                      if (selectedProducts.length === filteredProducts.length) {
                        setSelectedProducts([]);
                      } else {
                        setSelectedProducts(filteredProducts.map(p => p.id));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Producto</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">SKU</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Categoría</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Precio</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Ventas</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((producto) => {
                const estadoBadge = getEstadoBadge(producto.estado);
                return (
                  <tr key={producto.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(producto.id)}
                        onChange={() => toggleSelectProduct(producto.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-xl">
                          {producto.imagen}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{producto.nombre}</p>
                          <p className="text-xs text-gray-500">ID: {producto.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{producto.sku}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                        {producto.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">${producto.precio.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStockColor(producto.stock)}`}>
                          {producto.stock} unidades
                        </span>
                        {producto.stock < 20 && (
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{producto.ventas}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${estadoBadge.className}`}>
                        {estadoBadge.text}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(producto);
                            setShowModal(true);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(producto.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Mostrando {filteredProducts.length} de {productos.length} productos
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-white transition-colors">
              Anterior
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-white transition-colors">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-white transition-colors">
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Producto (Simplificado) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingProduct ? "Editar Producto" : "Nuevo Producto"}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nombre del producto"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={editingProduct?.nombre}
              />
              <input
                type="number"
                placeholder="Precio"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={editingProduct?.precio}
              />
              <input
                type="number"
                placeholder="Stock"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={editingProduct?.stock}
              />
              <select className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Electrónica</option>
                <option>Periféricos</option>
                <option>Audio</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingProduct(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                {editingProduct ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}