import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import {
  DollarSign,
  Warehouse,
  TrendingUp,
  AlertCircle,
  Clock,
} from "lucide-react";

import { useEffect, useState } from "react";

export default function DashboardPremium() {

  const [ventasData, setVentasData] = useState([]);
  const [productosData, setProductosData] = useState([]);
  const [actividadData, setActividadData] = useState([]);
  const [prediccionIA, setPrediccionIA] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {

    try {

      setLoading(true);
      setError(null);

      // ======================================
      // 1. DATOS DEL DASHBOARD (ventas + ultima venta)
      // ======================================
      const dashRes = await fetch(
        "http://localhost:3000/api/ventas/dashboard",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const dashData = await dashRes.json();

      setVentasData(dashData.ventasPorMes || []);

      // ======================================
      // 2. PRODUCTOS
      // ======================================
      const productosRes = await fetch(
        "http://localhost:3000/api/productos",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const productos = await productosRes.json();

      // ======================================
      // 3. IA CON DATOS REALES DE LA ÚLTIMA VENTA
      // ======================================
      const ultima = dashData.ultimaVenta;

      // Si hay una venta real, usamos esos datos
      // Si no, usamos valores por defecto del dataset
      const fecha = ultima
        ? new Date(ultima.fecha)
        : new Date();

      const inputIA = {
        "Ship Mode":     ultima?.ship_mode     || "Standard Class",
        "Segment":       ultima?.segment       || "Consumer",
        "City":          "Los Angeles",
        "State":         "California",
        "Region":        ultima?.region        || "West",
        "Category":      ultima?.categoria     || "Furniture",
        "Sub-Category":  ultima?.sub_categoria || "Chairs",
        "Discount":      parseFloat(ultima?.descuento) || 0,
        "Shipping Days": ultima?.shipping_days || 3,
        "Month":         fecha.getMonth() + 1,
        "Day":           fecha.getDate(),
        "Year":          fecha.getFullYear(),
        "WeekDay":       fecha.getDay(),
        "Weekend":       fecha.getDay() >= 5 ? 1 : 0
      };

      const iaRes = await fetch(
        "http://localhost:3000/api/ia/prediccion",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(inputIA)
        }
      );

      const ia = await iaRes.json();

      setPrediccionIA(ia);

      // ======================================
      // 4. STOCK VS DEMANDA
      // ======================================
      const productosIA = productos
        .slice(0, 5)
        .map((p) => ({
          producto: p.nombre,
          stock: Number(p.stock),
          demanda: Math.round(ia.demanda_predicha)
        }));

      setProductosData(productosIA);

      // ======================================
      // 5. ACTIVIDAD
      // ======================================
      setActividadData([
        {
          id: 1,
          mensaje: `IA predice ventas de $${ia.ventas_predichas}`,
          tiempo: "Ahora"
        },
        {
          id: 2,
          mensaje: `Demanda estimada: ${Math.round(ia.demanda_predicha)} unidades`,
          tiempo: "Ahora"
        },
        {
          id: 3,
          mensaje: ultima
            ? `Basado en última venta — ${ultima.categoria || "Furniture"} / ${ultima.sub_categoria || "Chairs"}`
            : "Usando valores por defecto del modelo",
          tiempo: "Info"
        }
      ]);

    } catch (error) {

      console.error(error);
      setError("Error cargando el dashboard");

    } finally {

      setLoading(false);
    }
  };

  // ============================================
  // LOADING
  // ============================================
  if (loading) {
    return (
      <div className="p-10 text-xl flex items-center gap-3">
        <div className="animate-spin w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full" />
        Cargando dashboard...
      </div>
    );
  }

  // ============================================
  // ERROR
  // ============================================
  if (error) {
    return (
      <div className="p-10 text-red-600 text-xl">
        {error}
        <button
          onClick={cargarDashboard}
          className="ml-4 text-blue-600 underline text-base"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // ============================================
  // MÉTRICAS
  // ============================================
  const ventasTotales = ventasData.reduce(
    (acc, item) => acc + Number(item.ventas), 0
  );

  const stockTotal = productosData.reduce(
    (acc, item) => acc + item.stock, 0
  );

  const demandaTotal = productosData.reduce(
    (acc, item) => acc + item.demanda, 0
  );

  const productosCriticos = productosData.filter(
    (p) => p.stock < p.demanda
  ).length;

  const COLORS = [
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
  ];

  // ============================================
  // UI
  // ============================================
  return (

    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="mb-8 flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold">
            Dashboard Inteligente
          </h1>
          <p className="text-gray-500">
            Datos reales + IA
          </p>
        </div>

        <button
          onClick={cargarDashboard}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
        >
          Actualizar
        </button>

      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

        {[
          {
            title: "Ventas Totales",
            value: `$${ventasTotales.toFixed(2)}`,
            icon: DollarSign,
            color: "text-blue-600"
          },
          {
            title: "Stock Total",
            value: stockTotal,
            icon: Warehouse,
            color: "text-green-600"
          },
          {
            title: "Demanda IA",
            value: demandaTotal,
            icon: TrendingUp,
            color: "text-purple-600"
          },
          {
            title: "Productos Críticos",
            value: productosCriticos,
            icon: AlertCircle,
            color: productosCriticos > 0 ? "text-red-600" : "text-gray-400"
          }

        ].map((item) => (

          <div
            key={item.title}
            className="bg-white p-6 rounded-2xl shadow"
          >
            <item.icon className={`w-8 h-8 ${item.color} mb-3`} />
            <p className="text-gray-500 text-sm">
              {item.title}
            </p>
            <h2 className="text-2xl font-bold">
              {item.value}
            </h2>
          </div>
        ))}

      </div>

      {/* PREDICCIÓN IA DESTACADA */}
      {prediccionIA && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          <div className="bg-blue-600 text-white p-6 rounded-2xl shadow">
            <p className="text-blue-200 text-sm mb-1">Predicción IA — Ventas</p>
            <h2 className="text-4xl font-bold">
              ${prediccionIA.ventas_predichas}
            </h2>
            <p className="text-blue-200 text-sm mt-2">
              Estimado para la próxima venta
            </p>
          </div>

          <div className="bg-green-600 text-white p-6 rounded-2xl shadow">
            <p className="text-green-200 text-sm mb-1">Predicción IA — Demanda</p>
            <h2 className="text-4xl font-bold">
              {Math.round(prediccionIA.demanda_predicha)} unidades
            </h2>
            <p className="text-green-200 text-sm mt-2">
              Unidades estimadas a vender
            </p>
          </div>

        </div>
      )}

      {/* GRÁFICAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* VENTAS */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-xl font-bold mb-6">
            Ventas Reales vs Predicción IA
          </h2>

          {ventasData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400">
              Sin ventas registradas aún
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart
                data={[
                  ...ventasData,
                  {
                    mes: "Pred IA",
                    ventas: prediccionIA?.ventas_predichas
                  }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="ventas"
                  stroke="#3b82f6"
                  fill="#93c5fd"
                  name="Ventas ($)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

        </div>

        {/* STOCK VS DEMANDA */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-xl font-bold mb-6">
            Stock vs Demanda IA
          </h2>

          {productosData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400">
              Sin productos registrados aún
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={productosData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  dataKey="producto"
                  type="category"
                  width={120}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="stock" fill="#3b82f6" name="Stock actual" />
                <Bar dataKey="demanda" fill="#22c55e" name="Demanda IA" />
              </BarChart>
            </ResponsiveContainer>
          )}

        </div>

      </div>

      {/* ABAJO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PIE */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-xl font-bold mb-6">
            Distribución de Stock
          </h2>

          {productosData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400">
              Sin productos aún
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productosData}
                  dataKey="stock"
                  nameKey="producto"
                  outerRadius={100}
                  label
                >
                  {productosData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}

        </div>

        {/* ACTIVIDAD */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-xl font-bold mb-6">
            Actividad IA
          </h2>

          <div className="space-y-4">

            {actividadData.map((a) => (

              <div key={a.id} className="flex gap-3 items-start">

                <Clock className="w-5 h-5 text-blue-600 mt-1" />

                <div>
                  <p className="font-medium">{a.mensaje}</p>
                  <p className="text-sm text-gray-500">{a.tiempo}</p>
                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}