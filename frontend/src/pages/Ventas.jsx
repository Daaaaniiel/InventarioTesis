import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  Calendar,
  Download,
  Filter,
  Search,
  ChevronDown,
  Eye,
  Printer,
  Mail,
  Award,
  Clock,
  CreditCard,
  Truck,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function VentasPremium() {
  const [periodo, setPeriodo] = useState("semanal");
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");

  // Datos de ventas mejorados
  const [ventas] = useState([
    { id: 1, producto: "Laptop HP Pavilion", cantidad: 2, total: 1799.98, fecha: "2024-01-15", cliente: "María García", metodo: "Tarjeta", estado: "completado", vendedor: "Carlos" },
    { id: 2, producto: "Mouse Logitech MX", cantidad: 5, total: 449.95, fecha: "2024-01-15", cliente: "Juan Pérez", metodo: "PayPal", estado: "completado", vendedor: "Ana" },
    { id: 3, producto: "Teclado Mecánico RGB", cantidad: 3, total: 389.97, fecha: "2024-01-14", cliente: "Laura López", metodo: "Tarjeta", estado: "pendiente", vendedor: "Carlos" },
    { id: 4, producto: "Monitor 4K UltraWide", cantidad: 1, total: 499.99, fecha: "2024-01-14", cliente: "Roberto Sánchez", metodo: "Transferencia", estado: "completado", vendedor: "Ana" },
    { id: 5, producto: "Auriculares Gaming", cantidad: 4, total: 319.96, fecha: "2024-01-13", cliente: "Sofía Ramírez", metodo: "Tarjeta", estado: "completado", vendedor: "Carlos" },
    { id: 6, producto: "Webcam 4K", cantidad: 2, total: 299.98, fecha: "2024-01-13", cliente: "Diego Torres", metodo: "PayPal", estado: "cancelado", vendedor: "Ana" },
    { id: 7, producto: "Silla Gamer", cantidad: 1, total: 299.99, fecha: "2024-01-12", cliente: "Valentina Gómez", metodo: "Tarjeta", estado: "completado", vendedor: "Carlos" },
  ]);

  // Datos para gráficos
  const ventasDiarias = [
    { dia: "Lun", ventas: 1250, transacciones: 12, objetivo: 1000 },
    { dia: "Mar", ventas: 1850, transacciones: 18, objetivo: 1000 },
    { dia: "Mié", ventas: 1420, transacciones: 15, objetivo: 1000 },
    { dia: "Jue", ventas: 2100, transacciones: 22, objetivo: 1000 },
    { dia: "Vie", ventas: 2780, transacciones: 28, objetivo: 1000 },
    { dia: "Sáb", ventas: 2350, transacciones: 24, objetivo: 1000 },
    { dia: "Dom", ventas: 980, transacciones: 10, objetivo: 1000 },
  ];

  const ventasPorCategoria = [
    { nombre: "Electrónica", ventas: 12500, porcentaje: 45 },
    { nombre: "Periféricos", ventas: 8900, porcentaje: 32 },
    { nombre: "Audio", ventas: 4200, porcentaje: 15 },
    { nombre: "Accesorios", ventas: 2200, porcentaje: 8 },
  ];

  const topProductos = [
    { nombre: "Laptop HP", ventas: 5400, crecimiento: 23 },
    { nombre: "Mouse Logitech", ventas: 3250, crecimiento: 15 },
    { nombre: "Teclado RGB", ventas: 2890, crecimiento: -5 },
    { nombre: "Monitor 4K", ventas: 2100, crecimiento: 42 },
  ];

  // Estadísticas
  const stats = {
    ventasTotales: ventas.reduce((sum, v) => sum + v.total, 0),
    transaccionesTotales: ventas.length,
    ticketPromedio: ventas.reduce((sum, v) => sum + v.total, 0) / ventas.length,
    clientesUnicos: [...new Set(ventas.map(v => v.cliente))].length,
    crecimiento: 23.5,
    metaCumplida: 87
  };

  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];

  const getEstadoBadge = (estado) => {
    const badges = {
      completado: "bg-green-100 text-green-800",
      pendiente: "bg-yellow-100 text-yellow-800",
      cancelado: "bg-red-100 text-red-800"
    };
    const icons = {
      completado: <CheckCircle className="w-3 h-3" />,
      pendiente: <Clock className="w-3 h-3" />,
      cancelado: <AlertCircle className="w-3 h-3" />
    };
    return { className: badges[estado] || badges.completado, icon: icons[estado] };
  };

  // Filtrar ventas
  const ventasFiltradas = ventas.filter(venta => {
    const matchesSearch = venta.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venta.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = estadoFiltro === "todos" || venta.estado === estadoFiltro;
    return matchesSearch && matchesEstado;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Gestión de Ventas
            </h1>
            <p className="text-gray-500 mt-1">Análisis y seguimiento de transacciones</p>
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
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Nueva Venta</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {[
            { title: "Ventas Totales", value: `$${stats.ventasTotales.toLocaleString()}`, cambio: "+23.5%", icon: DollarSign, color: "from-blue-500 to-blue-600", bgColor: "bg-blue-50" },
            { title: "Transacciones", value: stats.transaccionesTotales, cambio: "+12%", icon: ShoppingCart, color: "from-emerald-500 to-emerald-600", bgColor: "bg-emerald-50" },
            { title: "Ticket Promedio", value: `$${stats.ticketPromedio.toFixed(2)}`, cambio: "+8%", icon: CreditCard, color: "from-purple-500 to-purple-600", bgColor: "bg-purple-50" },
            { title: "Clientes", value: stats.clientesUnicos, cambio: "+18%", icon: Users, color: "from-orange-500 to-orange-600", bgColor: "bg-orange-50" },
            { title: "Meta Cumplida", value: `${stats.metaCumplida}%`, cambio: "+5%", icon: Award, color: "from-pink-500 to-pink-600", bgColor: "bg-pink-50" },
          ].map((stat) => (
            <div key={stat.title} className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start">
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <stat.icon className="w-5 h-5 text-gray-700" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${stat.cambio.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendingUp className="w-3 h-3" />
                  <span>{stat.cambio}</span>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-500 text-sm mt-1">{stat.title}</p>
              </div>
              <div className={`h-1 bg-gradient-to-r ${stat.color} rounded-full mt-3 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
            </div>
          ))}
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Ventas Diarias */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Ventas Diarias</h2>
              <p className="text-gray-500 text-sm mt-1">vs. objetivo diario</p>
            </div>
            <div className="flex gap-2">
              {["diario", "semanal", "mensual"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriodo(p)}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    periodo === p
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {p === "diario" ? "Día" : p === "semanal" ? "Semana" : "Mes"}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={ventasDiarias}>
              <defs>
                <linearGradient id="ventasGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="dia" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="ventas" stroke="#3b82f6" fill="url(#ventasGradient)" name="Ventas ($)" />
              <Line type="monotone" dataKey="objetivo" stroke="#22c55e" strokeDasharray="5 5" name="Objetivo" />
            </AreaChart>
          </ResponsiveContainer>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Mejor día</p>
              <p className="text-sm font-bold text-gray-900">Viernes</p>
              <p className="text-xs text-green-600">$2,780</p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Promedio día</p>
              <p className="text-sm font-bold text-gray-900">$1,819</p>
              <p className="text-xs text-blue-600">+18%</p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Días con meta</p>
              <p className="text-sm font-bold text-gray-900">5/7</p>
              <p className="text-xs text-green-600">71% cumplimiento</p>
            </div>
          </div>
        </div>

        {/* Ventas por Categoría */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-6">Ventas por Categoría</h2>
          
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ventasPorCategoria}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="ventas"
                label={({ name, porcentaje }) => `${name} ${porcentaje}%`}
              >
                {ventasPorCategoria.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2">
            {ventasPorCategoria.map((cat, idx) => (
              <div key={cat.nombre} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                  <span className="text-sm text-gray-600">{cat.nombre}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-sm font-semibold text-gray-900">${cat.ventas.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">{cat.porcentaje}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Productos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-gray-900 text-lg">Top Productos</h2>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              Ver todos
            </button>
          </div>
          
          <div className="space-y-4">
            {topProductos.map((producto, idx) => (
              <div key={producto.nombre} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-sm font-bold text-blue-700">
                    #{idx + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{producto.nombre}</p>
                    <p className="text-sm text-gray-500">${producto.ventas.toLocaleString()}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${producto.crecimiento >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {producto.crecimiento >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{Math.abs(producto.crecimiento)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Últimas Ventas */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-gray-900 text-lg">Últimas Transacciones</h2>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos</option>
                <option value="completado">Completado</option>
                <option value="pendiente">Pendiente</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 rounded-lg">
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Cantidad</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ventasFiltradas.map((venta) => {
                  const estado = getEstadoBadge(venta.estado);
                  return (
                    <tr key={venta.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{venta.producto}</td>
                      <td className="px-4 py-3 text-gray-600">{venta.cliente}</td>
                      <td className="px-4 py-3 text-gray-600">{venta.cantidad}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">${venta.total.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${estado.className}`}>
                          {estado.icon}
                          {venta.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {ventasFiltradas.length === 0 && (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No se encontraron ventas</p>
            </div>
          )}
        </div>
      </div>

      {/* Métricas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Truck className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">24h</span>
          </div>
          <h3 className="text-lg font-semibold mb-1">Entrega Express</h3>
          <p className="text-blue-100 text-sm">El 85% de los pedidos se entregan en menos de 24h</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">+32%</span>
          </div>
          <h3 className="text-lg font-semibold mb-1">Clientes Recurrentes</h3>
          <p className="text-purple-100 text-sm">Aumento en la fidelización de clientes</p>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Mail className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">78%</span>
          </div>
          <h3 className="text-lg font-semibold mb-1">Tasa de Conversión</h3>
          <p className="text-emerald-100 text-sm">Efectividad de campañas de marketing</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 bg-white rounded-2xl shadow-lg p-4">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex gap-4">
            <span>📊 Total de ventas: ${stats.ventasTotales.toLocaleString()}</span>
            <span>🔄 Ticket promedio: ${stats.ticketPromedio.toFixed(2)}</span>
            <span>👥 Clientes únicos: {stats.clientesUnicos}</span>
          </div>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            Ver reporte detallado →
          </button>
        </div>
      </div>
    </div>
  );
}