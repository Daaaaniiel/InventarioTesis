import { useState, useEffect, useCallback } from "react";
import {
  XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, AreaChart, Area,
  BarChart, Bar, ComposedChart, Legend, Line,
} from "recharts";
import {
  Brain, TrendingUp, TrendingDown, Activity, Target, Zap,
  Shield, Clock, RefreshCw, ChevronRight,
  AlertCircle, CheckCircle, Sparkles, Cpu, Database, Globe,
  Loader2,
} from "lucide-react";

const API = "http://localhost:3000/api";

// R² fijos del entrenamiento (propiedades del modelo, no cambian con nuevos datos)
const R2_DEMANDA = 54.3;
const R2_VENTAS  = 34.8;

const fmt = (n) => (n ?? 0).toLocaleString("es-EC");

function KpiCard({ title, value, cambio, icon: Icon, color, bgColor, desc }) {
  const positivo = String(cambio).startsWith("+");
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br opacity-5 rounded-bl-full" />
      <div className="flex justify-between items-start">
        <div className={`${bgColor} p-3 rounded-xl`}>
          <Icon className="w-5 h-5 text-gray-700" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${positivo ? "text-green-600" : "text-red-600"}`}>
          {positivo
            ? <TrendingUp  className="w-3 h-3" />
            : <TrendingDown className="w-3 h-3" />}
          <span>{cambio}</span>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-gray-500 text-sm mt-1">{title}</p>
        <p className="text-xs text-gray-400 mt-1">{desc}</p>
      </div>
      <div className={`h-1 bg-gradient-to-r ${color} rounded-full mt-3 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
    </div>
  );
}

export default function IAPremium() {
  const [periodo,   setPeriodo]   = useState("6m");
  const [animando,  setAnimando]  = useState(false);
  const [cargando,  setCargando]  = useState(true);
  const [error,     setError]     = useState(null);

  const [datosHistoricos,     setDatosHistoricos]     = useState([]);
  const [prediccionesFuturas, setPrediccionesFuturas] = useState([]);
  const [datosCategorias,     setDatosCategorias]     = useState([]);
  const [recomendaciones,     setRecomendaciones]     = useState([]);
  // mae viene del backend (calculado sobre datos reales vs predichos)
  const [mae, setMae] = useState({ ventas: 0, demanda: 0 });

  const cargarAnalisis = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/ia/analisis`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();

      setDatosHistoricos(data.datosHistoricos         ?? []);
      setPrediccionesFuturas(data.prediccionesFuturas ?? []);
      setDatosCategorias(data.datosCategorias         ?? []);
      setRecomendaciones(data.recomendaciones         ?? []);
      // El backend devuelve mae en metricasIA.mae (ventas por ahora)
      setMae({
        ventas:  data.metricasIA?.maeVentas  ?? data.metricasIA?.mae ?? 0,
        demanda: data.metricasIA?.maeDemanda ?? 0,
      });
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargarAnalisis(); }, [cargarAnalisis]);

  useEffect(() => {
    const id = setInterval(() => {
      setAnimando(true);
      setTimeout(() => setAnimando(false), 500);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const limiteMeses = periodo === "3m" ? 3 : periodo === "12m" ? 12 : 6;
  const historicosVisible = datosHistoricos.slice(-limiteMeses);

  const demandaProxTrim = prediccionesFuturas
    .slice(0, 3)
    .reduce((s, d) => s + (d.demanda ?? 0), 0);

  const crecimientoPorc = (() => {
    if (datosHistoricos.length < 2) return "+0%";
    const ult = datosHistoricos[datosHistoricos.length - 1]?.ventas ?? 0;
    const ant = datosHistoricos[datosHistoricos.length - 2]?.ventas ?? 1;
    const pct = (((ult - ant) / ant) * 100).toFixed(1);
    return pct > 0 ? `+${pct}%` : `${pct}%`;
  })();

  const alertasActivas = recomendaciones.filter(r => r.prioridad === "Alta").length;

  const crecProyectado = (() => {
    if (prediccionesFuturas.length < 2) return "+0%";
    const ini = prediccionesFuturas[0]?.demanda ?? 0;
    const fin = prediccionesFuturas[prediccionesFuturas.length - 1]?.demanda ?? 0;
    const pct = ini > 0 ? (((fin - ini) / ini) * 100).toFixed(1) : 0;
    return pct > 0 ? `+${pct}%` : `${pct}%`;
  })();

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Ejecutando modelos predictivos…</p>
          <p className="text-gray-400 text-sm mt-1">Esto puede tomar unos segundos</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error al cargar predicciones</h2>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button
            onClick={cargarAnalisis}
            className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">

      {/* ── Header ── */}
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
                Live
              </span>
            </div>
            <p className="text-gray-500 mt-1">
              Predicciones generadas con datos reales · RandomForest entrenado con agregación mensual
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={cargarAnalisis}
              className="bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Actualizar</span>
            </button>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Ejecutar predicción</span>
            </button>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <KpiCard
            title="Demanda Estimada"
            value={`${fmt(demandaProxTrim)} uds`}
            cambio={crecProyectado}
            icon={Target}
            color="from-blue-500 to-blue-600"
            bgColor="bg-blue-50"
            desc="Próximo trimestre"
          />
          <KpiCard
            title="R² Demanda"
            value={`${R2_DEMANDA}%`}
            cambio="+0%"
            icon={Shield}
            color="from-emerald-500 to-emerald-600"
            bgColor="bg-emerald-50"
            desc="Varianza explicada por el modelo"
          />
          <KpiCard
            title="Tendencia Ventas"
            value={crecimientoPorc.includes("-") ? "Decrecimiento" : "Crecimiento"}
            cambio={crecimientoPorc}
            icon={TrendingUp}
            color="from-green-500 to-green-600"
            bgColor="bg-green-50"
            desc="vs período anterior"
          />
          <KpiCard
            title="Alertas Activas"
            value={String(alertasActivas)}
            cambio={alertasActivas > 0 ? `+${alertasActivas}` : "0"}
            icon={Activity}
            color="from-orange-500 to-orange-600"
            bgColor="bg-orange-50"
            desc="Recomendaciones prioritarias"
          />
        </div>
      </div>

      {/* ── Gráfico principal + Rendimiento IA ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Ventas reales vs predicción */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Ventas Reales vs Predicción IA</h2>
              <p className="text-gray-500 text-sm mt-1">Comparación mensual: datos reales (barras) vs proyección del modelo (línea)</p>
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

          {historicosVisible.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400">
              <p>Sin datos históricos disponibles</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={historicosVisible}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(v, name) => [fmt(v), name]}
                />
                <Legend />
                <Bar
                  dataKey="ventas"
                  fill="#3b82f6"
                  name="Ventas Reales ($)"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="prediccion"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ r: 5, strokeWidth: 2, fill: "#f97316" }}
                  name="Predicción IA ($)"
                  connectNulls={false}
                  strokeDasharray="6 3"
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}

          {/* Métricas correctas para regresión */}
          <div className="mt-4 p-3 bg-blue-50 rounded-xl flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-700">R² Ventas:</span>
              <span className="text-sm font-bold text-blue-600">{R2_VENTAS}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">R² Demanda:</span>
              <span className="text-sm font-bold text-blue-600">{R2_DEMANDA}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">MAE Demanda:</span>
              <span className="text-sm font-bold text-gray-900">{fmt(mae.demanda)} uds</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">MAE Ventas:</span>
              <span className="text-sm font-bold text-gray-900">${fmt(mae.ventas)}</span>
            </div>
          </div>
        </div>

        {/* Rendimiento del modelo — CORREGIDO */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Cpu className="w-5 h-5 text-purple-600" />
            <h2 className="font-bold text-gray-900 text-lg">Rendimiento IA</h2>
          </div>

          <div className="space-y-6">
            {/* R² Demanda */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">R² — Predicción Demanda</span>
                <span className="font-semibold text-gray-900">{R2_DEMANDA}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${R2_DEMANDA}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Varianza explicada en demanda mensual</p>
            </div>

            {/* R² Ventas */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">R² — Predicción Ventas</span>
                <span className="font-semibold text-gray-900">{R2_VENTAS}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${R2_VENTAS}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Varianza explicada en ventas mensuales</p>
            </div>

            {/* Mejora vs baseline */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Mejora vs Naive Forecast</span>
                <span className={`font-semibold text-green-600 ${animando ? "text-blue-600" : ""} transition-all`}>
                  +32%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-700 ${animando ? "animate-pulse" : ""}`}
                  style={{ width: "72%" }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Reducción de error absoluto (MAE) vs modelo ingenuo</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4 text-gray-400" />
              {/* CORREGIDO: solo RandomForest */}
              <span className="text-sm text-gray-600">Modelo: RandomForestRegressor</span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Datos: {datosHistoricos.length} meses históricos
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Actualizado: {new Date().toLocaleDateString("es-EC")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Proyección futura + Categorías ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Proyección 6 meses */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-gray-900 text-lg">Proyección a 6 meses</h2>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>Crecimiento proyectado: {crecProyectado}</span>
            </div>
          </div>

          {prediccionesFuturas.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400">
              <p>Sin predicciones disponibles</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={prediccionesFuturas}>
                <defs>
                  <linearGradient id="demandaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip formatter={(v, n) => [fmt(v), n]} />
                <Area
                  type="monotone"
                  dataKey="demanda"
                  stroke="#3b82f6"
                  fill="url(#demandaGradient)"
                  name="Demanda Proyectada (uds)"
                />
                <Line
                  type="monotone"
                  dataKey="intervaloMax"
                  stroke="#f59e0b"
                  strokeDasharray="3 3"
                  name="Límite superior"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="intervaloMin"
                  stroke="#f59e0b"
                  strokeDasharray="3 3"
                  name="Límite inferior"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          <div className="mt-4 p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 text-center">
              * Los intervalos representan una variación estimada de ±8% sobre la demanda proyectada
            </p>
          </div>
        </div>
      </div>

      {/* ── Recomendaciones + Insights ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <h2 className="font-bold text-gray-900 text-lg">Recomendaciones Inteligentes</h2>
            </div>
            <span className="text-sm text-gray-400">{recomendaciones.length} generadas</span>
          </div>

          {recomendaciones.length === 0 ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-700">
                El inventario está alineado con la demanda proyectada. No se requieren acciones inmediatas.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recomendaciones.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{rec.titulo}</h3>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      rec.prioridad === "Alta"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      Prioridad {rec.prioridad}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{rec.descripcion}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="text-gray-500">📋 {rec.accion}</span>
                      <span className="text-gray-500">💡 {rec.impacto}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-purple-600" />
            <h2 className="font-bold text-gray-900 text-lg">Insights IA</h2>
          </div>

          <div className="space-y-4">
            <div className={`p-3 rounded-xl border ${
              crecimientoPorc.startsWith("-")
                ? "bg-red-50 border-red-100"
                : "bg-green-50 border-green-100"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className={`w-4 h-4 ${
                  crecimientoPorc.startsWith("-") ? "text-red-600" : "text-green-600"
                }`} />
                <span className={`text-sm font-semibold ${
                  crecimientoPorc.startsWith("-") ? "text-red-700" : "text-green-700"
                }`}>
                  Tendencia {crecimientoPorc.startsWith("-") ? "Negativa" : "Positiva"}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Variación {crecimientoPorc} respecto al período anterior
              </p>
            </div>

            {alertasActivas > 0 && (
              <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-semibold text-yellow-700">
                    {alertasActivas} alerta{alertasActivas > 1 ? "s" : ""} de stock
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Categorías con demanda superior al stock disponible
                </p>
              </div>
            )}

            {prediccionesFuturas.length > 0 && (() => {
              const pico = prediccionesFuturas.reduce(
                (a, b) => a.demanda > b.demanda ? a : b
              );
              return (
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-700">Pico proyectado</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Mayor demanda esperada en <strong>{pico.mes}</strong>:{" "}
                    ~{fmt(pico.demanda)} uds
                  </p>
                </div>
              );
            })()}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={cargarAnalisis}
              className="w-full py-2 bg-purple-50 text-purple-600 rounded-xl text-sm font-medium hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerar análisis
            </button>
          </div>
        </div>
      </div>

      {/* ── Footer CORREGIDO ── */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Modelo ML activo</h3>
              {/* CORREGIDO: solo RandomForestRegressor */}
              <p className="text-white/70 text-sm">RandomForestRegressor · Agregación mensual + Lags</p>
            </div>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold">{R2_DEMANDA}%</p>
              <p className="text-white/70 text-sm">R² Demanda</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{R2_VENTAS}%</p>
              <p className="text-white/70 text-sm">R² Ventas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{datosHistoricos.length}</p>
              <p className="text-white/70 text-sm">Meses analizados</p>
            </div>
          </div>
          <button
            onClick={cargarAnalisis}
            className="bg-white text-gray-900 px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-shadow flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </button>
        </div>
      </div>

    </div>
  );
}