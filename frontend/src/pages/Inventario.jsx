import { useState } from "react";
import { 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Search,
  Filter,
  Download,
  RefreshCw,
  Bell,
  ChevronDown,
  Eye,
  Edit2,
  Truck,
  Warehouse
} from "lucide-react";

export default function InventarioPremium() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [selectedCategory, setSelectedCategory] = useState("todos");

  // Datos de inventario mejorados
  const [inventario, setInventario] = useState([
    { 
      id: 1, 
      producto: "Laptop HP Pavilion", 
      stock: 45, 
      stockMinimo: 10,
      stockMaximo: 100,
      categoria: "Electrónica",
      ubicacion: "A-01",
      ultimaActualizacion: "2024-01-15",
      estado: "normal",
      precio: 899.99,
      ventasMensuales: 23
    },
    { 
      id: 2, 
      producto: "Mouse Logitech MX", 
      stock: 0, 
      stockMinimo: 20,
      stockMaximo: 200,
      categoria: "Periféricos",
      ubicacion: "B-03",
      ultimaActualizacion: "2024-01-14",
      estado: "critico",
      precio: 89.99,
      ventasMensuales: 45
    },
    { 
      id: 3, 
      producto: "Teclado Mecánico RGB", 
      stock: 40, 
      stockMinimo: 15,
      stockMaximo: 80,
      categoria: "Periféricos",
      ubicacion: "B-02",
      ultimaActualizacion: "2024-01-15",
      estado: "normal",
      precio: 129.99,
      ventasMensuales: 32
    },
    { 
      id: 4, 
      producto: "Monitor 4K UltraWide", 
      stock: 8, 
      stockMinimo: 5,
      stockMaximo: 30,
      categoria: "Electrónica",
      ubicacion: "A-04",
      ultimaActualizacion: "2024-01-13",
      estado: "bajo",
      precio: 499.99,
      ventasMensuales: 12
    },
    { 
      id: 5, 
      producto: "Auriculares Gaming", 
      stock: 67, 
      stockMinimo: 25,
      stockMaximo: 150,
      categoria: "Audio",
      ubicacion: "C-01",
      ultimaActualizacion: "2024-01-15",
      estado: "normal",
      precio: 79.99,
      ventasMensuales: 38
    },
    { 
      id: 6, 
      producto: "Webcam 4K", 
      stock: 3, 
      stockMinimo: 10,
      stockMaximo: 50,
      categoria: "Electrónica",
      ubicacion: "A-03",
      ultimaActualizacion: "2024-01-10",
      estado: "critico",
      precio: 149.99,
      ventasMensuales: 28
    },
    { 
      id: 7, 
      producto: "Silla Gamer", 
      stock: 12, 
      stockMinimo: 8,
      stockMaximo: 40,
      categoria: "Accesorios",
      ubicacion: "D-01",
      ultimaActualizacion: "2024-01-14",
      estado: "bajo",
      precio: 299.99,
      ventasMensuales: 15
    },
  ]);

  const categorias = ["todos", "Electrónica", "Periféricos", "Audio", "Accesorios"];
  
  // Estadísticas
  const stats = {
    totalProductos: inventario.length,
    totalUnidades: inventario.reduce((sum, item) => sum + item.stock, 0),
    valorInventario: inventario.reduce((sum, item) => sum + (item.stock * item.precio), 0),
    productosCriticos: inventario.filter(item => item.estado === "critico").length,
    productosBajoStock: inventario.filter(item => item.estado === "bajo").length,
    rotacionMensual: inventario.reduce((sum, item) => sum + item.ventasMensuales, 0)
  };

  // Filtrar inventario
  const filteredInventory = inventario.filter(item => {
    const matchesSearch = item.producto.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "todos" || item.estado === filterStatus;
    const matchesCategory = selectedCategory === "todos" || item.categoria === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getEstadoConfig = (estado, stock, stockMinimo) => {
    if (stock === 0) {
      return {
        color: "red",
        bgColor: "bg-red-50",
        textColor: "text-red-700",
        borderColor: "border-red-200",
        icon: AlertTriangle,
        label: "Agotado",
        action: "Reabastecer urgente"
      };
    } else if (estado === "critico" || stock < stockMinimo * 0.5) {
      return {
        color: "red",
        bgColor: "bg-red-50",
        textColor: "text-red-700",
        borderColor: "border-red-200",
        icon: AlertTriangle,
        label: "Crítico",
        action: "Reabastecer ahora"
      };
    } else if (estado === "bajo" || stock < stockMinimo) {
      return {
        color: "yellow",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-700",
        borderColor: "border-yellow-200",
        icon: Clock,
        label: "Stock Bajo",
        action: "Revisar inventario"
      };
    } else {
      return {
        color: "green",
        bgColor: "bg-green-50",
        textColor: "text-green-700",
        borderColor: "border-green-200",
        icon: CheckCircle,
        label: "Normal",
        action: "Stock óptimo"
      };
    }
  };

  const getProgressBarColor = (stock, stockMinimo, stockMaximo) => {
    const porcentaje = (stock / stockMaximo) * 100;
    if (stock < stockMinimo) return "bg-red-500";
    if (stock < stockMinimo * 1.5) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Control de Inventario
            </h1>
            <p className="text-gray-500 mt-1">Gestión inteligente de stock y almacén</p>
          </div>
          
          <div className="flex gap-3">
            <button className="bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Sincronizar</span>
            </button>
            <button className="bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="text-sm">Exportar</span>
            </button>
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span>Actualizar Stock</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {[
            { title: "Total Productos", value: stats.totalProductos, icon: Package, color: "from-blue-500 to-blue-600", bgColor: "bg-blue-50" },
            { title: "Unidades Totales", value: stats.totalUnidades.toLocaleString(), icon: Warehouse, color: "from-indigo-500 to-indigo-600", bgColor: "bg-indigo-50" },
            { title: "Valor Inventario", value: `$${stats.valorInventario.toLocaleString()}`, icon: TrendingUp, color: "from-emerald-500 to-emerald-600", bgColor: "bg-emerald-50" },
            { title: "Stock Crítico", value: stats.productosCriticos, icon: AlertTriangle, color: "from-red-500 to-red-600", bgColor: "bg-red-50" },
            { title: "Rotación Mensual", value: stats.rotacionMensual, icon: TrendingDown, color: "from-purple-500 to-purple-600", bgColor: "bg-purple-50" },
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

      {/* Alertas de Stock */}
      {(stats.productosCriticos > 0 || stats.productosBajoStock > 0) && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-800">Alertas de Inventario</h3>
              <p className="text-sm text-yellow-700 mt-1">
                {stats.productosCriticos > 0 && `${stats.productosCriticos} productos en estado crítico. `}
                {stats.productosBajoStock > 0 && `${stats.productosBajoStock} productos con stock bajo. `}
                Se recomienda reabastecer lo antes posible.
              </p>
            </div>
            <button className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm hover:bg-yellow-200 transition-colors">
              Ver detalles
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
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
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
              >
                <option value="todos">Todos los estados</option>
                <option value="critico">Crítico</option>
                <option value="bajo">Stock Bajo</option>
                <option value="normal">Normal</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
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
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <button className="text-gray-500 hover:text-gray-700">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInventory.map((item) => {
          const estado = getEstadoConfig(item.estado, item.stock, item.stockMinimo);
          const porcentajeStock = (item.stock / item.stockMaximo) * 100;
          const progressColor = getProgressBarColor(item.stock, item.stockMinimo, item.stockMaximo);
          
          return (
            <div key={item.id} className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 ${estado.borderColor}`}>
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`${estado.bgColor} p-2 rounded-xl`}>
                      <estado.icon className={`w-5 h-5 text-${estado.color}-600`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{item.producto}</h3>
                      <p className="text-xs text-gray-500">{item.categoria} • {item.ubicacion}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-xs font-medium ${estado.bgColor} ${estado.textColor}`}>
                    {estado.label}
                  </div>
                </div>

                {/* Stock Info */}
                <div className="mb-4">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">{item.stock}</p>
                      <p className="text-xs text-gray-500">unidades disponibles</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Mín: {item.stockMinimo} | Máx: {item.stockMaximo}
                      </p>
                      <p className="text-xs text-gray-400">
                        Última actualización: {item.ultimaActualizacion}
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Stock actual</span>
                      <span>{porcentajeStock.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`${progressColor} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(porcentajeStock, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4 pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Precio unitario</p>
                    <p className="text-sm font-semibold text-gray-900">${item.precio.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Ventas mensuales</p>
                    <p className="text-sm font-semibold text-gray-900">{item.ventasMensuales} unidades</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Valor total</p>
                    <p className="text-sm font-semibold text-gray-900">${(item.stock * item.precio).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Días de cobertura</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {item.ventasMensuales > 0 ? Math.round((item.stock / item.ventasMensuales) * 30) : "∞"} días
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                    <Truck className="w-4 h-4" />
                    Reabastecer
                  </button>
                  <button className="flex-1 px-3 py-2 bg-gray-50 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    Detalles
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredInventory.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron productos</h3>
          <p className="text-gray-500">Intenta con otros filtros o agrega nuevos productos</p>
        </div>
      )}

      {/* Footer Stats */}
      <div className="mt-6 bg-white rounded-2xl shadow-lg p-4">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <p>Mostrando {filteredInventory.length} de {inventario.length} productos</p>
          <div className="flex gap-4">
            <span>📦 Stock promedio: {(stats.totalUnidades / stats.totalProductos).toFixed(1)} uds/producto</span>
            <span>💰 Valor promedio: ${(stats.valorInventario / stats.totalProductos).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}