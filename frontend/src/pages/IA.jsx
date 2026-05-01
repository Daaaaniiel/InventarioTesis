import { useState, useEffect } from "react";
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
  Legend,
  ComposedChart,
  Scatter
} from "recharts";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Zap,
  Shield,
  Clock,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Download,
  RefreshCw,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Cpu,
  Database,
  Globe
} from "lucide-react";

export default function IAPremium() {
  const [periodo, setPeriodo] = useState("6m");
  const [prediccionActiva, setPrediccionActiva] = useState(true);
  const [confianza, setConfianza] = useState(87);
  const [animando, setAnimando] = useState(false);

  // Datos históricos de ventas
  const datosHistoricos = [
    { mes: "Ene", ventas: 420, prediccion: null, temporada: "Baja", confianza: 85 },
    { mes: "Feb", ventas: 580, prediccion: null, temporada: "Media", confianza: 87 },
    { mes: "Mar", ventas: 750, prediccion: null, temporada: "Alta", confianza: 88 },
    { mes: "Abr", ventas: 690, prediccion: null, temporada: "Media", confianza: 86 },
    { mes: "May", ventas: 890, prediccion: null, temporada: "Alta", confianza: 89 },
    { mes: "Jun", ventas: 1150, prediccion: null, temporada: "Muy Alta", confianza: 90 },
    { mes: "Jul", ventas: 1320, prediccion: null, temporada: "Muy Alta", confianza: 91 },
    { mes: "Ago", ventas: 1080, prediccion: null, temporada: "Alta", confianza: 88 },
    { mes: "Sep", ventas: 1420, prediccion: 1480, temporada: "Alta", confianza: 89 },
    { mes: "Oct", ventas: 1580, prediccion: 1650, temporada: "Muy Alta", confianza: 91 },
    { mes: "Nov", ventas: 1820, prediccion: 1910, temporada: "Muy Alta", confianza: 92 },
    { mes: "Dic", ventas: 2150, prediccion: 2280, temporada: "Pico", confianza: 93 },
  ];

  // Predicciones futuras
  const prediccionesFuturas = [
    { mes: "Ene 2025", demanda: 1950, intervaloMin: 1820, intervaloMax: 2080, probabilidad: 85 },
    { mes: "Feb 2025", demanda: 1780, intervaloMin: 1650, intervaloMax: 1910, probabilidad: 87 },
    { mes: "Mar 2025", demanda: 1920, intervaloMin: 1780, intervaloMax: 2060, probabilidad: 86 },
    { mes: "Abr 2025", demanda: 1880, intervaloMin: 1740, intervaloMax: 2020, probabilidad: 88 },
    { mes: "May 2025", demanda: 2050, intervaloMin: 1890, intervaloMax: 2210, probabilidad: 89 },
    { mes: "Jun 2025", demanda: 2350, intervaloMin: 2180, intervaloMax: 2520, probabilidad: 91 },
  ];

  // Datos por categoría
  const datosCategorias = [
    { nombre: "Electrónica", demanda: 2450, stock: 1850, tendencia: "+23%" },
    { nombre: "Periféricos", demanda: 3120, stock: 2780, tendencia: "+15%" },
    { nombre: "Audio", demanda: 1890, stock: 1650, tendencia: "+18%" },
    { nombre: "Accesorios", demanda: 980, stock: 1120, tendencia: "-5%" },
  ];

  // Recomendaciones IA
  const recomendaciones = [
    { 
      id: 1, 
      titulo: "Aumentar stock de Laptops", 
      descripcion: "La demanda ha crecido 32% en los últimos 3 meses",
      prioridad: "Alta",
      accion: "Reabastecer +200 unidades",
      impacto: "+$45,000 en ventas"
    },
    { 
      id: 2, 
      titulo: "Reducir inventario de Mouse", 
      descripcion: "Stock actual supera la demanda proyectada en 40%",
      prioridad: "Media",
      accion: "Promoción para rotación",
      impacto: "Liberar $12,000"
    },
    { 
      id: 3, 
      titulo: "Preparar temporada alta", 
      descripcion: "Se espera un pico del 65% en diciembre",
      prioridad: "Alta",
      accion: "Aumentar capacidad",
      impacto: "Evitar rotura de stock"
    },
  ];

  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];
  const metricasIA = {
    precision: 94,
    recall: 91,
    f1Score: 92.5,
    mae: 124.5
  };

  // Simular animación de confianza
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimando(true);
      setTimeout(() => setAnimando(false), 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Análisis Predictivo IA
              </h1>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-semibold">
                Beta
              </span>
            </div>
            <p className="text-gray-500 mt-1">
              Predicciones avanzadas con machine learning y análisis de tendencias
            </p>
          </div>
          
          <div className="flex gap-3">
            <button className="bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Reentrenar IA</span>
            </button>
            <button className="bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="text-sm">Exportar reporte</span>
            </button>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Ejecutar predicción</span>
            </button>
          </div>
        </div>

        {/* Stats Cards con IA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { 
              title: "Demanda Estimada", 
              value: "1,480 uds", 
                  cambio: "+18.5%", 
              icon: Target, 
              color: "from-blue-500 to-blue-600", 
              bgColor: "bg-blue-50",
              desc: "Próximo trimestre"
            },
            { 
              title: "Confianza del Modelo", 
              value: `${confianza}%`, 
              cambio: "+2.3%", 
              icon: Shield, 
              color: "from-emerald-500 to-emerald-600", 
              bgColor: "bg-emerald-50",
              desc: "Precisión predictiva"
            },
            { 
              title: "Tendencia", 
              value: "Crecimiento", 
              cambio: "+23%", 
              icon: TrendingUp, 
              color: "from-green-500 to-green-600", 
              bgColor: "bg-green-50",
              desc: "vs periodo anterior"
            },
            { 
              title: "Alertas Activas", 
              value: "3", 
              cambio: "-2", 
              icon: Activity, 
              color: "from-orange-500 to-orange-600", 
              bgColor: "bg-orange-50",
              desc: "Recomendaciones pendientes"
            },
          ].map((stat) => (
            <div key={stat.title} className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br opacity-5 rounded-bl-full" />
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
                <p className="text-xs text-gray-400 mt-1">{stat.desc}</p>
              </div>
              <div className={`h-1 bg-gradient-to-r ${stat.color} rounded-full mt-3 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
            </div>
          ))}
        </div>
      </div>

      {/* Gráfico Principal con Predicción */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Predicción de Demanda</h2>
              <p className="text-gray-500 text-sm mt-1">Ventas históricas vs proyección IA</p>
            </div>
            <div className="flex gap-2">
              {["3m", "6m", "12m"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriodo(p)}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    periodo === p
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={datosHistoricos}>
              <defs>
                <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
              <Legend />
              <Area
                type="monotone"
                dataKey="confianza"
                stroke="#8b5cf6"
                fill="url(#confidenceGradient)"
                name="Nivel de Confianza"
                yAxisId={1}
              />
              <Bar dataKey="ventas" fill="#3b82f6" name="Ventas Reales" radius={[4, 4, 0, 0]} />
              <Line
                type="monotone"
                dataKey="prediccion"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 6, strokeWidth: 2 }}
                name="Predicción IA"
              />
            </ComposedChart>
          </ResponsiveContainer>

          <div className="mt-4 p-3 bg-blue-50 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-700">Precisión del modelo:</span>
              <span className="text-sm font-bold text-blue-600">{metricasIA.precision}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Error medio (MAE):</span>
              <span className="text-sm font-bold text-gray-900">{metricasIA.mae} unidades</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">F1-Score:</span>
              <span className="text-sm font-bold text-gray-900">{metricasIA.f1Score}%</span>
            </div>
          </div>
        </div>

        {/* Métricas de IA */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Cpu className="w-5 h-5 text-purple-600" />
            <h2 className="font-bold text-gray-900 text-lg">Rendimiento IA</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Precisión Predictiva</span>
                <span className="font-semibold text-gray-900">{metricasIA.precision}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${metricasIA.precision}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Recall</span>
                <span className="font-semibold text-gray-900">{metricasIA.recall}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${metricasIA.recall}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Confianza del Modelo</span>
                <span className={`font-semibold ${animando ? 'text-blue-600 scale-110' : 'text-gray-900'} transition-all`}>
                  {confianza}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-700 ${animando ? 'animate-pulse' : ''}`} 
                  style={{ width: `${confianza}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Modelo: LSTM + Prophet</span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Último entrenamiento: Hoy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Predicciones Futuras */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-gray-900 text-lg">Proyección a 6 meses</h2>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>Crecimiento proyectado: +23%</span>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={prediccionesFuturas}>
              <defs>
                <linearGradient id="demandaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mes" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Area type="monotone" dataKey="demanda" stroke="#3b82f6" fill="url(#demandaGradient)" name="Demanda Proyectada" />
              <Line type="monotone" dataKey="intervaloMax" stroke="#f59e0b" strokeDasharray="3 3" name="Intervalo Superior" />
              <Line type="monotone" dataKey="intervaloMin" stroke="#f59e0b" strokeDasharray="3 3" name="Intervalo Inferior" />
            </AreaChart>
          </ResponsiveContainer>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 text-center">
              * Los intervalos representan un nivel de confianza del 95% en las predicciones
            </p>
          </div>
        </div>

        {/* Demanda por Categoría */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-6">Análisis por Categoría</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={datosCategorias} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis type="category" dataKey="nombre" stroke="#9ca3af" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="demanda" fill="#3b82f6" name="Demanda IA" radius={[0, 8, 8, 0]} />
              <Bar dataKey="stock" fill="#22c55e" name="Stock Actual" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            {datosCategorias.map((cat) => (
              <div key={cat.nombre} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">{cat.nombre}</span>
                <span className={`text-sm font-semibold ${cat.tendencia.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {cat.tendencia}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recomendaciones IA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <h2 className="font-bold text-gray-900 text-lg">Recomendaciones Inteligentes</h2>
              </div>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                Ver todas
              </button>
            </div>
            
            <div className="space-y-4">
              {recomendaciones.map((rec) => (
                <div key={rec.id} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{rec.titulo}</h3>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      rec.prioridad === "Alta" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      Prioridad {rec.prioridad}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{rec.descripcion}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-500">📋 {rec.accion}</span>
                      <span className="text-gray-500">💰 {rec.impacto}</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights Rápidos */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-purple-600" />
            <h2 className="font-bold text-gray-900 text-lg">Insights IA</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-3 bg-green-50 rounded-xl border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-700">Tendencia Positiva</span>
              </div>
              <p className="text-xs text-gray-600">La demanda ha crecido un 32% en el último trimestre</p>
            </div>
            
            <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-100">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-semibold text-yellow-700">Alerta de Stock</span>
              </div>
              <p className="text-xs text-gray-600">3 productos podrían quedar sin stock en 15 días</p>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">Oportunidad</span>
              </div>
              <p className="text-xs text-gray-600">Aumentar inventario de laptops para temporada alta</p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <button className="w-full py-2 bg-purple-50 text-purple-600 rounded-xl text-sm font-medium hover:bg-purple-100 transition-colors">
              Generar reporte completo
            </button>
          </div>
        </div>
      </div>

      {/* Footer con métricas de IA */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Modelo de IA entrenado</h3>
              <p className="text-white/70 text-sm">Algoritmo: LSTM + Redes Neuronales</p>
            </div>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold">98%</p>
              <p className="text-white/70 text-sm">Disponibilidad</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">&lt;2s</p>
              <p className="text-white/70 text-sm">Tiempo respuesta</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">1.2M</p>
              <p className="text-white/70 text-sm">Datos procesados</p>
            </div>
          </div>
          <button className="bg-white text-gray-900 px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-shadow">
            Ver documentación
          </button>
        </div>
      </div>
    </div>
  );
}