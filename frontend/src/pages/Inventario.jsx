import { useEffect, useState } from "react";
import {
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronDown,
  Eye,
  Truck,
  Warehouse,
  X
} from "lucide-react";

export default function InventarioPremium() {

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [selectedCategory, setSelectedCategory] = useState("todos");

  const [inventario, setInventario] = useState([]);
  const [categorias, setCategorias] = useState(["todos"]);

  // ==============================
  // MODAL STOCK
  // ==============================
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStock, setNewStock] = useState(0);

  const token = localStorage.getItem("token");


  // ==============================
// MODAL DETALLES
// ==============================
const [showDetailsModal, setShowDetailsModal] = useState(false);
const [detailProduct, setDetailProduct] = useState(null);

  // ==============================
  // CARGAR PRODUCTOS
  // ==============================
  const fetchProductos = async () => {
    try {

      const res = await fetch(
        "http://localhost:3000/api/productos",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      setInventario(data);

    } catch (error) {
      console.error("Error cargando inventario:", error);
    }
  };

  // ==============================
  // CARGAR CATEGORÍAS
  // ==============================
  const fetchCategorias = async () => {
    try {

      const res = await fetch(
        "http://localhost:3000/api/categorias",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      setCategorias([
        "todos",
        ...data.map((cat) => cat.nombre)
      ]);

    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

  // ==============================
  // ACTUALIZAR STOCK
  // ==============================
  const updateStock = async () => {

    try {

      const res = await fetch(
        `http://localhost:3000/api/productos/${selectedProduct.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            ...selectedProduct,
            stock: Number(newStock)
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error actualizando stock");
        return;
      }

      await fetchProductos();

      setShowStockModal(false);
      setSelectedProduct(null);
      setNewStock(0);

    } catch (error) {
      console.error(error);
      alert("Error del servidor");
    }
  };

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  // ==============================
  // STATS
  // ==============================
  const stats = {

    totalProductos: inventario.length,

    totalUnidades: inventario.reduce(
      (sum, item) => sum + Number(item.stock || 0),
      0
    ),

    valorInventario: inventario.reduce(
      (sum, item) =>
        sum + (
          Number(item.stock || 0) *
          Number(item.precio || 0)
        ),
      0
    ),

    productosCriticos: inventario.filter(
      (item) => Number(item.stock) === 0
    ).length
  };

  // ==============================
  // FILTROS
  // ==============================
  const filteredInventory = inventario.filter((item) => {

    const matchesSearch =
      item.nombre?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const estado =
      Number(item.stock) === 0
        ? "critico"
        : Number(item.stock) <
          Number(item.stock_minimo || 10)
        ? "bajo"
        : "normal";

    const matchesStatus =
      filterStatus === "todos" ||
      estado === filterStatus;

    const matchesCategory =
      selectedCategory === "todos" ||
      item.categoria === selectedCategory;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCategory
    );
  });

  // ==============================
  // ESTADO STOCK
  // ==============================
  const getEstadoConfig = (
    stock,
    stockMinimo = 10
  ) => {

    if (stock === 0) {
      return {
        bgColor: "bg-red-50",
        textColor: "text-red-700",
        borderColor: "border-red-200",
        icon: AlertTriangle,
        label: "Agotado"
      };
    }

    if (stock < stockMinimo) {
      return {
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-700",
        borderColor: "border-yellow-200",
        icon: Clock,
        label: "Stock Bajo"
      };
    }

    return {
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-200",
      icon: CheckCircle,
      label: "Normal"
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">

      {/* HEADER */}
      <div className="mb-8">

        <div className="flex justify-between items-start mb-6">

          <div>
            <h1 className="text-3xl font-bold">
              Control de Inventario
            </h1>

            <p className="text-gray-500 mt-1">
              Gestión inteligente de stock
            </p>
          </div>

          <div className="flex gap-3">

            <button
              onClick={fetchProductos}
              className="bg-white px-4 py-2 rounded-xl shadow-sm flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Sincronizar
            </button>

            <button className="bg-white px-4 py-2 rounded-xl shadow-sm flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </button>

          </div>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

          {[
            {
              title: "Productos",
              value: stats.totalProductos,
              icon: Package
            },
            {
              title: "Unidades",
              value: stats.totalUnidades,
              icon: Warehouse
            },
            {
              title: "Valor",
              value: `$${stats.valorInventario.toFixed(2)}`,
              icon: TrendingUp
            },
            {
              title: "Críticos",
              value: stats.productosCriticos,
              icon: AlertTriangle
            }
          ].map((stat) => (

            <div
              key={stat.title}
              className="bg-white rounded-2xl shadow-lg p-5"
            >

              <div className="flex justify-between">

                <div className="bg-gray-100 p-3 rounded-xl">
                  <stat.icon className="w-5 h-5" />
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {stat.value}
                  </p>

                  <p className="text-sm text-gray-500">
                    {stat.title}
                  </p>
                </div>

              </div>

            </div>
          ))}
        </div>
      </div>

      {/* INVENTARIO */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredInventory.map((item) => {

          const estado = getEstadoConfig(
            Number(item.stock),
            Number(item.stock_minimo || 10)
          );

          return (

            <div
              key={item.id}
              className={`bg-white rounded-2xl shadow-lg border-l-4 ${estado.borderColor}`}
            >

              <div className="p-6">

                <div className="flex justify-between mb-4">

                  <div>
                    <h3 className="font-bold text-lg">
                      {item.nombre}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {item.categoria}
                    </p>
                  </div>

                  <div className={`px-2 py-1 rounded-lg text-xs font-medium ${estado.bgColor} ${estado.textColor}`}>
                    {estado.label}
                  </div>

                </div>

                <div className="mb-4">

                  <p className="text-3xl font-bold">
                    {item.stock}
                  </p>

                  <p className="text-sm text-gray-500">
                    unidades
                  </p>

                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">

                  <div>
                    <p className="text-xs text-gray-500">
                      Precio
                    </p>

                    <p className="font-semibold">
                      ${Number(item.precio).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Valor total
                    </p>

                    <p className="font-semibold">
                      $
                      {(
                        Number(item.stock) *
                        Number(item.precio)
                      ).toFixed(2)}
                    </p>
                  </div>

                </div>

                {/* BOTONES */}
                <div className="flex gap-2">

                  <button
                    onClick={() => {
                      setSelectedProduct(item);
                      setNewStock(item.stock);
                      setShowStockModal(true);
                    }}
                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 flex items-center justify-center gap-2"
                  >
                    <Truck className="w-4 h-4" />
                    Reabastecer
                  </button>

                  <button
  onClick={() => {
    setDetailProduct(item);
    setShowDetailsModal(true);
  }}
  className="flex-1 px-3 py-2 bg-gray-50 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-100 flex items-center justify-center gap-2"
>
  <Eye className="w-4 h-4" />
  Detalles
</button>

                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* MODAL STOCK */}
      {showStockModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">

            <div className="flex justify-between items-center mb-6">

              <div>
                <h2 className="text-2xl font-bold">
                  Reabastecer Stock
                </h2>

                <p className="text-gray-500">
                  {selectedProduct?.nombre}
                </p>
              </div>

              <button
                onClick={() => setShowStockModal(false)}
              >
                <X />
              </button>

            </div>

            {/* RANGE */}
            <div className="mb-6">

              <div className="flex justify-between mb-2">
                <span>Nuevo stock</span>
                <span className="font-bold">
                  {newStock}
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="500"
                value={newStock}
                onChange={(e) =>
                  setNewStock(e.target.value)
                }
                className="w-full"
              />

            </div>

            {/* INPUT */}
            <div className="mb-6">

              <input
                type="number"
                value={newStock}
                onChange={(e) =>
                  setNewStock(e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-xl"
              />

            </div>

            {/* BOTONES */}
            <div className="flex gap-3">

              <button
                onClick={() => setShowStockModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-xl"
              >
                Cancelar
              </button>

              <button
                onClick={updateStock}
                className="flex-1 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                Actualizar
              </button>

            </div>

          </div>

        </div>
      )}
      {/* MODAL DETALLES */}
{showDetailsModal && detailProduct && (

  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">

      {/* HEADER */}
      <div className="flex justify-between items-center p-6 border-b">

        <div>
          <h2 className="text-2xl font-bold">
            Detalles del Producto
          </h2>

          <p className="text-gray-500">
            Información completa
          </p>
        </div>

        <button
          onClick={() => setShowDetailsModal(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X />
        </button>

      </div>

      {/* BODY */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <p className="text-sm text-gray-500">
            ID
          </p>

          <p className="font-semibold">
            #{detailProduct.id}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Nombre
          </p>

          <p className="font-semibold">
            {detailProduct.nombre}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            SKU
          </p>

          <p className="font-semibold">
            {detailProduct.sku || "N/A"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Categoría
          </p>

          <p className="font-semibold">
            {detailProduct.categoria}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Precio
          </p>

          <p className="font-semibold">
            ${Number(detailProduct.precio).toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Stock Actual
          </p>

          <p className="font-semibold">
            {detailProduct.stock}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Stock Mínimo
          </p>

          <p className="font-semibold">
            {detailProduct.stock_minimo || 10}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Stock Máximo
          </p>

          <p className="font-semibold">
            {detailProduct.stock_maximo || 100}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Estado
          </p>

          <p className="font-semibold">
            {Number(detailProduct.stock) === 0
              ? "Agotado"
              : Number(detailProduct.stock) <
                Number(detailProduct.stock_minimo || 10)
              ? "Stock Bajo"
              : "Normal"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Valor Total
          </p>

          <p className="font-semibold">
            $
            {(
              Number(detailProduct.stock) *
              Number(detailProduct.precio)
            ).toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Fecha Creación
          </p>

          <p className="font-semibold">
            {detailProduct.created_at
              ? new Date(detailProduct.created_at).toLocaleDateString()
              : "N/A"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Última Actualización
          </p>

          <p className="font-semibold">
            {detailProduct.updated_at
              ? new Date(detailProduct.updated_at).toLocaleDateString()
              : "N/A"}
          </p>
        </div>

      </div>

      {/* FOOTER */}
      <div className="p-6 border-t flex justify-end">

        <button
          onClick={() => setShowDetailsModal(false)}
          className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          Cerrar
        </button>

      </div>

    </div>

  </div>
)}
    </div>
    
  );
}