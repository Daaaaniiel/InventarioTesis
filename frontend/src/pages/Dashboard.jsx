import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Package,
  Warehouse,
  DollarSign,
  ShoppingCart,
  MoreHorizontal,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useState } from "react";

export default function DashboardPremium() {
  const [periodo, setPeriodo] = useState("mensual");
  const [mostrarPrediccion, setMostrarPrediccion] = useState(false);

  // Datos simulados mejorados
  const ventasData = [
    { mes: "Ene", ventas: 400, meta: 350 },
    { mes: "Feb", ventas: 600, meta: 550 },
    { mes: "Mar", ventas: 800, meta: 750 },
    { mes: "Abr", ventas: 700, meta: 800 },
    { mes: "May", ventas: 950, meta: 900 },
    { mes: "Jun", ventas: 1200, meta: 1100 },
    { mes: "Jul", ventas: 1350, meta: 1250 },
    { mes: "Ago", ventas: 1100, meta: 1150 },
    { mes: "Sep", ventas: 1450, meta: 1300 },
    { mes: "Oct", ventas: 1600, meta: 1450 },
    { mes: "Nov", ventas: 1850, meta: 1700 },
    { mes: "Dic", ventas: 2100, meta: 2000 },
  ];

  const prediccionData = [
    { producto: "Laptop Gaming", stock: 45, demanda: 120, categoria: "Electrónica" },
    { producto: "Mouse RGB", stock: 180, demanda: 95, categoria: "Periféricos" },
    { producto: "Teclado Mecánico", stock: 62, demanda: 110, categoria: "Periféricos" },
    { producto: "Monitor 4K", stock: 28, demanda: 75, categoria: "Electrónica" },
    { producto: "Auriculares", stock: 95, demanda: 85, categoria: "Audio" },
  ];

  const productosTop = [
    { nombre: "Laptop Gaming Pro", ventas: 12450, crecimiento: 23.5, imagen: "💻" },
    { nombre: "Mouse Inalámbrico", ventas: 8920, crecimiento: 15.2, imagen: "🖱️" },
    { nombre: "Teclado Mecánico", ventas: 7450, crecimiento: -5.8, imagen: "⌨️" },
    { nombre: "Monitor UltraWide", ventas: 6210, crecimiento: 42.1, imagen: "🖥️" },
  ];

  const actividadesRecientes = [
    { id: 1, usuario: "María García", accion: "agregó stock", producto: "Laptop Gaming", tiempo: "Hace 5 min", tipo: "exito" },
    { id: 2, usuario: "Carlos López", accion: "actualizó precio", producto: "Mouse RGB", tiempo: "Hace 15 min", tipo: "exito" },
    { id: 3, usuario: "Sistema IA", accion: "predice déficit", producto: "Teclado Mecánico", tiempo: "Hace 1 hora", tipo: "alerta" },
    { id: 4, usuario: "Ana Martínez", accion: "completó pedido", producto: "Monitor 4K", tiempo: "Hace 2 horas", tipo: "exito" },
    { id: 5, usuario: "Robot IA", accion: "reorden automática", producto: "Auriculares", tiempo: "Hace 3 horas", tipo: "pendiente" },
  ];

  // Colores para gráficos
  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

  // Calcular métricas principales
  const ventasTotales = ventasData.reduce((sum, item) => sum + item.ventas, 0);
  const ventasMesActual = ventasData[ventasData.length - 1].ventas;
  const ventasMesAnterior = ventasData[ventasData.length - 2].ventas;
  const crecimientoVentas = ((ventasMesActual - ventasMesAnterior) / ventasMesAnterior) * 100;
  
  const stockTotal = prediccionData.reduce((sum, item) => sum + item.stock, 0);
  const demandaTotal = prediccionData.reduce((sum, item) => sum + item.demanda, 0);
  const deficitProductos = prediccionData.filter(item => item.stock < item.demanda).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header Premium */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Dashboard Premium
            </h1>
            <p className="text-gray-500 mt-1">Panel de control con IA integrada</p>
          </div>
          
          <div className="flex gap-3">
            <div className="bg-white rounded-xl px-4 py-2 shadow-sm flex gap-2">
              {["semanal", "mensual", "anual"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriodo(p)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    periodo === p
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {p === "semanal" ? "Semanal" : p === "mensual" ? "Mensual" : "Anual"}
                </button>
              ))}
            </div>
            <button className="bg-white rounded-xl p-2 shadow-sm hover:shadow-md transition-shadow">
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Cards Premium con efecto glass */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { 
            title: "Ventas Totales", 
            value: `$${ventasTotales.toLocaleString()}`, 
            cambio: crecimientoVentas, 
            icon: DollarSign, 
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50"
          },
          { 
            title: "Stock Total", 
            value: stockTotal.toLocaleString(), 
            cambio: -8.2, 
            icon: Warehouse, 
            color: "from-emerald-500 to-emerald-600",
            bgColor: "bg-emerald-50"
          },
          { 
            title: "Demanda IA", 
            value: demandaTotal.toLocaleString(), 
            cambio: 12.5, 
            icon: TrendingUp, 
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50"
          },
          { 
            title: "Productos Críticos", 
            value: deficitProductos, 
            cambio: -15.3, 
            icon: AlertCircle, 
            color: "from-red-500 to-red-600",
            bgColor: "bg-red-50"
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`${item.bgColor} p-3 rounded-xl`}>
                  <item.icon className="w-6 h-6" style={{ color: item.color.includes('blue') ? '#2563eb' : item.color.includes('emerald') ? '#059669' : item.color.includes('purple') ? '#7c3aed' : '#dc2626' }} />
                </div>
                <div className={`flex items-center gap-1 ${item.cambio >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.cambio >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span className="text-sm font-semibold">{Math.abs(item.cambio).toFixed(1)}%</span>
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium">{item.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
            </div>
            <div className={`h-1 bg-gradient-to-r ${item.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
          </div>
        ))}
      </div>

      {/* Gráficas principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Área Chart con predicción */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Ventas Mensuales</h2>
              <p className="text-gray-500 text-sm mt-1">vs. Meta mensual</p>
            </div>
            <button 
              onClick={() => setMostrarPrediccion(!mostrarPrediccion)}
              className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1"
            >
              {mostrarPrediccion ? "Ocultar" : "Mostrar"} predicción IA
              <ChevronRight className={`w-4 h-4 transition-transform ${mostrarPrediccion ? 'rotate-90' : ''}`} />
            </button>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={mostrarPrediccion ? [...ventasData, { mes: "Pred", ventas: 2450, meta: 2300 }] : ventasData}>
              <defs>
                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMeta" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mes" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "white", 
                  borderRadius: "12px", 
                  border: "none", 
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" 
                }}
              />
              <Area type="monotone" dataKey="ventas" stroke="#3b82f6" strokeWidth={3} fill="url(#colorVentas)" />
              <Area type="monotone" dataKey="meta" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" fill="url(#colorMeta)" />
            </AreaChart>
          </ResponsiveContainer>
          
          {mostrarPrediccion && (
            <div className="mt-4 p-3 bg-blue-50 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">Predicción IA para próximo mes</p>
                <p className="text-xs text-gray-500">Basado en tendencias estacionales y crecimiento histórico</p>
              </div>
              <p className="text-lg font-bold text-blue-600">+18.2%</p>
            </div>
          )}
        </div>

        {/* Bar Chart mejorado */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Stock vs Demanda IA</h2>
              <p className="text-gray-500 text-sm mt-1">Análisis predictivo por producto</p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Stock Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Demanda IA</span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={prediccionData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis type="category" dataKey="producto" stroke="#9ca3af" width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "white", 
                  borderRadius: "12px", 
                  border: "none", 
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" 
                }}
              />
              <Bar dataKey="stock" fill="#3b82f6" radius={[0, 8, 8, 0]} />
              <Bar dataKey="demanda" fill="#22c55e" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Segunda fila de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Top Productos */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-gray-900 text-lg">Top Productos</h2>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              Ver todos
            </button>
          </div>
          
          <div className="space-y-4">
            {productosTop.map((producto, index) => (
              <div key={producto.nombre} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-xl">
                    {producto.imagen}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{producto.nombre}</p>
                    <p className="text-sm text-gray-500">${producto.ventas.toLocaleString()}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 ${producto.crecimiento >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {producto.crecimiento >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="text-sm font-semibold">{Math.abs(producto.crecimiento)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart - Distribución */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-1">
          <h2 className="font-bold text-gray-900 text-lg mb-6">Distribución por Categoría</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={prediccionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="stock"
              >
                {prediccionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-gray-900 text-lg">Actividad Reciente</h2>
            <div className="relative">
              <div className="w-2 h-2 bg-green-500 rounded-full absolute -top-1 -right-1"></div>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <div className="space-y-4">
            {actividadesRecientes.map((actividad) => (
              <div key={actividad.id} className="flex items-start gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center ${
                  actividad.tipo === "exito" ? "bg-green-100" : actividad.tipo === "alerta" ? "bg-red-100" : "bg-yellow-100"
                }`}>
                  {actividad.tipo === "exito" && <CheckCircle className="w-4 h-4 text-green-600" />}
                  {actividad.tipo === "alerta" && <AlertCircle className="w-4 h-4 text-red-600" />}
                  {actividad.tipo === "pendiente" && <Clock className="w-4 h-4 text-yellow-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">{actividad.usuario}</span> {actividad.accion} de{" "}
                    <span className="font-medium">{actividad.producto}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{actividad.tiempo}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2 text-center text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors">
            Ver todas las actividades
          </button>
        </div>
      </div>

      {/* Footer informativo */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Análisis Predictivo IA</h3>
              <p className="text-white/80 text-sm">Recomendaciones basadas en machine learning</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold">94%</p>
              <p className="text-white/80 text-sm">Precisión IA</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">-23%</p>
              <p className="text-white/80 text-sm">Reducción stock</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">+31%</p>
              <p className="text-white/80 text-sm">Eficiencia</p>
            </div>
          </div>
          <button className="bg-white text-blue-600 px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-shadow">
            Ver informe completo
          </button>
        </div>
      </div>
    </div>
  );
}