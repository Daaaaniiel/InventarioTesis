import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

import {
  ShoppingCart,
  DollarSign,
  Users,
  Download,
  Search,
  Eye,
  Printer,
  Award,
  Clock,
  CreditCard,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Plus,
  X,
  Trash2
} from "lucide-react";

export default function VentasPremium() {

  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  // =========================
  // FORM NUEVA VENTA
  // =========================
  const [nuevaVenta, setNuevaVenta] = useState({
    cliente: "",
    metodo_pago: "",
    estado: "completado",
    ship_mode: "Standard Class",
    segment: "Consumer",
    region: "West",
    shipping_days: 3,
    detalles: []
  });

  // =========================
  // FETCH VENTAS
  // =========================
  const fetchVentas = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/ventas",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await res.json();
      setVentas(data);
    } catch (error) {
      console.error("Error obteniendo ventas:", error);
    }
  };

  // =========================
  // FETCH PRODUCTOS
  // =========================
  const fetchProductos = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/productos",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error("Error obteniendo productos:", error);
    }
  };

  useEffect(() => {
    fetchVentas();
    fetchProductos();
  }, []);

  // =========================
  // AGREGAR DETALLE
  // =========================
  const agregarDetalle = () => {
    setNuevaVenta({
      ...nuevaVenta,
      detalles: [
        ...nuevaVenta.detalles,
        {
          producto_id: "",
          cantidad: 1,
          precio_unitario: 0,
          subtotal: 0,
          descuento: 0
        }
      ]
    });
  };

  // =========================
  // ELIMINAR DETALLE
  // =========================
  const eliminarDetalle = (index) => {
    const nuevosDetalles = [...nuevaVenta.detalles];
    nuevosDetalles.splice(index, 1);
    setNuevaVenta({ ...nuevaVenta, detalles: nuevosDetalles });
  };

  // =========================
  // CAMBIAR DETALLE
  // =========================
  const cambiarDetalle = (index, campo, valor) => {

    const nuevosDetalles = [...nuevaVenta.detalles];
    nuevosDetalles[index][campo] = valor;

    // Si cambia producto
    if (campo === "producto_id") {
      const producto = productos.find(p => p.id === Number(valor));
      if (producto) {
        nuevosDetalles[index].precio_unitario = Number(producto.precio);
        const descuento = nuevosDetalles[index].descuento || 0;
        nuevosDetalles[index].subtotal =
          Number(producto.precio) * nuevosDetalles[index].cantidad * (1 - descuento);
      }
    }

    // Si cambia cantidad
    if (campo === "cantidad") {
      const descuento = nuevosDetalles[index].descuento || 0;
      nuevosDetalles[index].subtotal =
        nuevosDetalles[index].precio_unitario * Number(valor) * (1 - descuento);
    }

    // Si cambia descuento
    if (campo === "descuento") {
      const desc = Number(valor) / 100;
      nuevosDetalles[index].descuento = desc;
      nuevosDetalles[index].subtotal =
        nuevosDetalles[index].precio_unitario *
        nuevosDetalles[index].cantidad *
        (1 - desc);
    }

    setNuevaVenta({ ...nuevaVenta, detalles: nuevosDetalles });
  };

  // =========================
  // CREAR VENTA
  // =========================
  const crearVenta = async (e) => {

    e.preventDefault();

    try {

      const res = await fetch(
        "http://localhost:3000/api/ventas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(nuevaVenta)
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return alert(data.message);
      }

      alert("Venta creada correctamente");

      setShowModal(false);

      setNuevaVenta({
        cliente: "",
        metodo_pago: "",
        estado: "completado",
        ship_mode: "Standard Class",
        segment: "Consumer",
        region: "West",
        shipping_days: 3,
        detalles: []
      });

      fetchVentas();

    } catch (error) {
      console.error(error);
      alert("Error creando venta");
    }
  };

  // =========================
  // FILTROS
  // =========================
  const ventasFiltradas = ventas.filter((venta) => {

    const matchesSearch =
      venta.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.metodo_pago?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEstado =
      estadoFiltro === "todos" || venta.estado === estadoFiltro;

    return matchesSearch && matchesEstado;
  });

  // =========================
  // STATS
  // =========================
  const stats = {
    ventasTotales: ventas.reduce((sum, v) => sum + Number(v.total || 0), 0),
    transaccionesTotales: ventas.length,
    ticketPromedio: ventas.length > 0
      ? ventas.reduce((sum, v) => sum + Number(v.total || 0), 0) / ventas.length
      : 0,
    clientesUnicos: [...new Set(ventas.map(v => v.cliente))].length,
  };

  // =========================
  // VENTAS DIARIAS
  // =========================
  const ventasDiariasMap = {};
  ventas.forEach((venta) => {
    const fecha = new Date(venta.fecha).toLocaleDateString();
    if (!ventasDiariasMap[fecha]) {
      ventasDiariasMap[fecha] = { dia: fecha, ventas: 0, objetivo: 1000 };
    }
    ventasDiariasMap[fecha].ventas += Number(venta.total);
  });
  const ventasDiarias = Object.values(ventasDiariasMap);

  // =========================
  // ESTADOS PIE
  // =========================
  const estadosMap = {};
  ventas.forEach((venta) => {
    if (!estadosMap[venta.estado]) {
      estadosMap[venta.estado] = { nombre: venta.estado, cantidad: 0 };
    }
    estadosMap[venta.estado].cantidad += 1;
  });
  const ventasEstados = Object.values(estadosMap);

  const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

  // =========================
  // BADGES
  // =========================
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
    return {
      className: badges[estado] || badges.completado,
      icon: icons[estado]
    };
  };

  const inputClass = "w-full mt-1 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300";

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">

      {/* HEADER */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Ventas</h1>
            <p className="text-gray-500 mt-1">Dashboard conectado al backend</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchVentas}
              className="bg-white px-4 py-2 rounded-xl shadow-sm flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Sincronizar
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva Venta
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-auto p-5">

          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl shadow-2xl max-h-screen overflow-y-auto">

            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold">Nueva Venta</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={crearVenta} className="space-y-5">

              {/* DATOS BÁSICOS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div>
                  <label className="text-sm font-medium">Cliente</label>
                  <input
                    type="text"
                    required
                    value={nuevaVenta.cliente}
                    onChange={(e) => setNuevaVenta({ ...nuevaVenta, cliente: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Método Pago</label>
                  <select
                    value={nuevaVenta.metodo_pago}
                    onChange={(e) => setNuevaVenta({ ...nuevaVenta, metodo_pago: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">Seleccionar</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Efectivo">Efectivo</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Estado</label>
                  <select
                    value={nuevaVenta.estado}
                    onChange={(e) => setNuevaVenta({ ...nuevaVenta, estado: e.target.value })}
                    className={inputClass}
                  >
                    <option value="completado">Completado</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

              </div>

              {/* DATOS PARA LA IA */}
              <div className="border border-blue-200 rounded-xl p-4 bg-blue-50">

                <h3 className="font-bold text-blue-700 mb-3">
                  🤖 Datos para Predicción IA
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>
                    <label className="text-sm font-medium">Tipo de Envío</label>
                    <select
                      value={nuevaVenta.ship_mode}
                      onChange={(e) => setNuevaVenta({ ...nuevaVenta, ship_mode: e.target.value })}
                      className={inputClass}
                    >
                      <option value="Standard Class">Standard Class</option>
                      <option value="Second Class">Second Class</option>
                      <option value="First Class">First Class</option>
                      <option value="Same Day">Same Day</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Segmento de Cliente</label>
                    <select
                      value={nuevaVenta.segment}
                      onChange={(e) => setNuevaVenta({ ...nuevaVenta, segment: e.target.value })}
                      className={inputClass}
                    >
                      <option value="Consumer">Consumer</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Home Office">Home Office</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Región</label>
                    <select
                      value={nuevaVenta.region}
                      onChange={(e) => setNuevaVenta({ ...nuevaVenta, region: e.target.value })}
                      className={inputClass}
                    >
                      <option value="West">West</option>
                      <option value="East">East</option>
                      <option value="Central">Central</option>
                      <option value="South">South</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Días de Envío</label>
                    <input
                      type="number"
                      min="1"
                      max="7"
                      value={nuevaVenta.shipping_days}
                      onChange={(e) => setNuevaVenta({ ...nuevaVenta, shipping_days: Number(e.target.value) })}
                      className={inputClass}
                    />
                  </div>

                </div>

              </div>

              {/* DETALLES / PRODUCTOS */}
              <div>

                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg">Productos</h3>
                  <button
                    type="button"
                    onClick={agregarDetalle}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
                  >
                    Agregar Producto
                  </button>
                </div>

                <div className="space-y-3">

                  {nuevaVenta.detalles.map((detalle, index) => (

                    <div
                      key={index}
                      className="grid grid-cols-12 gap-3 items-end border border-gray-200 rounded-xl p-4"
                    >

                      {/* PRODUCTO */}
                      <div className="col-span-4">
                        <label className="text-sm font-medium">Producto</label>
                        <select
                          value={detalle.producto_id}
                          onChange={(e) => cambiarDetalle(index, "producto_id", e.target.value)}
                          className={inputClass}
                        >
                          <option value="">Seleccionar</option>
                          {productos.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.nombre}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* CANTIDAD */}
                      <div className="col-span-2">
                        <label className="text-sm font-medium">Cantidad</label>
                        <input
                          type="number"
                          min="1"
                          value={detalle.cantidad}
                          onChange={(e) => cambiarDetalle(index, "cantidad", e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      {/* DESCUENTO */}
                      <div className="col-span-2">
                        <label className="text-sm font-medium">Desc. %</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="5"
                          placeholder="0"
                          onChange={(e) => cambiarDetalle(index, "descuento", e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      {/* PRECIO */}
                      <div className="col-span-2">
                        <label className="text-sm font-medium">Precio</label>
                        <input
                          type="number"
                          readOnly
                          value={detalle.precio_unitario}
                          className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2 bg-gray-100"
                        />
                      </div>

                      {/* SUBTOTAL */}
                      <div className="col-span-1">
                        <label className="text-sm font-medium">Sub.</label>
                        <input
                          type="number"
                          readOnly
                          value={Number(detalle.subtotal).toFixed(2)}
                          className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2 bg-gray-100"
                        />
                      </div>

                      {/* ELIMINAR */}
                      <div className="col-span-1">
                        <button
                          type="button"
                          onClick={() => eliminarDetalle(index)}
                          className="bg-red-100 hover:bg-red-200 text-red-600 p-3 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ))}

                </div>

              </div>

              {/* TOTAL */}
              <div className="bg-gray-100 rounded-xl p-4 flex justify-between items-center">
                <span className="font-semibold text-lg">Total:</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${nuevaVenta.detalles
                    .reduce((acc, item) => acc + Number(item.subtotal), 0)
                    .toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
              >
                Guardar Venta
              </button>

            </form>

          </div>

        </div>
      )}

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="font-bold text-lg mb-5">Ventas Diarias</h2>
          {ventasDiarias.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400">
              Sin ventas aún
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={ventasDiarias}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="ventas"
                  stroke="#3b82f6"
                  fill="#93c5fd"
                  name="Ventas"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="font-bold text-lg mb-5">Estados de Ventas</h2>
          {ventasEstados.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400">
              Sin ventas aún
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ventasEstados}
                  dataKey="cantidad"
                  nameKey="nombre"
                  outerRadius={100}
                  label
                >
                  {ventasEstados.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>

      {/* TABLA */}
      <div className="bg-white rounded-2xl shadow-lg p-6">

        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-lg">Últimas Ventas</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl"
              />
            </div>
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl"
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
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3">Cliente</th>
                <th className="text-left px-4 py-3">Método Pago</th>
                <th className="text-left px-4 py-3">Envío</th>
                <th className="text-left px-4 py-3">Segmento</th>
                <th className="text-left px-4 py-3">Estado</th>
                <th className="text-left px-4 py-3">Total</th>
                <th className="text-left px-4 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {ventasFiltradas.map((venta) => {
                const estado = getEstadoBadge(venta.estado);
                return (
                  <tr key={venta.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{venta.cliente}</td>
                    <td className="px-4 py-3">{venta.metodo_pago}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{venta.ship_mode}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{venta.segment}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${estado.className}`}>
                        {estado.icon}
                        {venta.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      ${Number(venta.total).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(venta.fecha).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}