// ================================================
// 3.9.2. PRUEBAS DE INTEGRACIÓN
// Cubre los 3 flujos de la sección 3.9.2 de la tesis:
//   1. Frontend → Backend → Base de datos
//   2. Backend → Módulo IA → Backend
//   3. Base de datos → Triggers → Stock

import dotenv from "dotenv";
dotenv.config();
import request from "supertest";

const BASE_URL = "http://localhost:3000";

let token = "";
let productoIntegracionId = null;

// ------------------------------------------------
// LOGIN
// ------------------------------------------------
beforeAll(async () => {
  const res = await request(BASE_URL)
    .post("/api/auth/login")
    .send({
      email:    process.env.TEST_EMAIL || "admin@test.com",
      password: process.env.TEST_PASS  || "123456"
    });

  token = res.body.token;

  if (!token) {
    throw new Error(
      "No se pudo obtener token. Verifica TEST_EMAIL y TEST_PASS en .env"
    );
  }

  // Crear producto base para los tests de integración
  await request(BASE_URL)
    .post("/api/productos")
    .set("Authorization", `Bearer ${token}`)
    .send({
      nombre:        "Producto Integración TEST",
      descripcion:   "Usado en pruebas de integración",
      precio:        200.00,
      stock:         20,
      stock_minimo:  3,
      stock_maximo:  100,
      sku:           "INT-TEST-001",
      ubicacion:     "Bodega B",
      sub_categoria: "Tables",
      categoria_id:  2
    });

  const lista = await request(BASE_URL)
    .get("/api/productos")
    .set("Authorization", `Bearer ${token}`);

  const prod = lista.body.find(p => p.sku === "INT-TEST-001");
  productoIntegracionId = prod?.id;
});


// ================================================
// FLUJO 1 — Frontend → Backend → Base de datos
// Verifica que las peticiones HTTP se persisten
// correctamente en PostgreSQL con integridad referencial
// ================================================
describe("Flujo 1 — Frontend → Backend → Base de datos", () => {

  test("1.1 GET /api/productos retorna datos con JOIN a categorias", async () => {

    const res = await request(BASE_URL)
      .get("/api/productos")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    // Cada producto debe tener el nombre de categoría (resultado del JOIN)
    const prod = res.body[0];
    expect(prod).toHaveProperty("id");
    expect(prod).toHaveProperty("nombre");
    expect(prod).toHaveProperty("precio");
    expect(prod).toHaveProperty("stock");
    // La categoría viene del JOIN con la tabla categorias
    expect(prod).toHaveProperty("categoria");
  });

  test("1.2 POST /api/ventas persiste en BD con integridad referencial", async () => {

    const res = await request(BASE_URL)
      .post("/api/ventas")
      .set("Authorization", `Bearer ${token}`)
      .send({
        cliente:       "Cliente Integración",
        metodo_pago:   "Tarjeta",
        estado:        "completado",
        ship_mode:     "First Class",
        segment:       "Corporate",
        region:        "East",
        shipping_days: 1,
        detalles: [
          {
            producto_id: productoIntegracionId,
            cantidad:    1,
            descuento:   0.05
          }
        ]
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("venta_id");

    // Verificar que la venta se puede recuperar desde BD
    const ventaRes = await request(BASE_URL)
      .get(`/api/ventas/${res.body.venta_id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(ventaRes.statusCode).toBe(200);
    expect(ventaRes.body).toHaveProperty("id", res.body.venta_id);
    expect(ventaRes.body).toHaveProperty("detalles");
    expect(Array.isArray(ventaRes.body.detalles)).toBe(true);
    expect(ventaRes.body.detalles.length).toBeGreaterThan(0);
  });

  test("1.3 Ruta protegida rechaza petición sin token (HTTP 401)", async () => {

    const res = await request(BASE_URL)
      .get("/api/productos");
      // Sin Authorization header

    expect(res.statusCode).toBe(401);
  });

  test("1.4 Ruta de admin rechaza token de vendedor (HTTP 403)", async () => {

    // Login como vendedor
    const loginVendedor = await request(BASE_URL)
      .post("/api/auth/login")
      .send({
        email:    process.env.TEST_EMAIL_VENDEDOR || "vendedor@test.com",
        password: process.env.TEST_PASS_VENDEDOR  || "123456"
      });

    const tokenVendedor = loginVendedor.body.token;

    if (!tokenVendedor) {
      console.warn(
        " No hay usuario vendedor configurado. " +
        "Configura TEST_EMAIL_VENDEDOR y TEST_PASS_VENDEDOR en .env"
      );
      return;
    }

    const res = await request(BASE_URL)
      .post("/api/productos")
      .set("Authorization", `Bearer ${tokenVendedor}`)
      .send({
        nombre:        "Producto no autorizado",
        precio:        10,
        stock:         1,
        stock_minimo:  0,
        stock_maximo:  10,
        sku:           "NO-AUTH-001",
        sub_categoria: "Chairs",
        categoria_id:  2
      });

    expect(res.statusCode).toBe(403);
  });
});


// ================================================
// FLUJO 2 — Backend → Módulo IA → Backend
// Verifica que Node.js ejecuta predict.py via
// python-shell y procesa el JSON de respuesta
// ================================================
describe("Flujo 2 — Backend → Módulo IA → Backend", () => {

  test("2.1 POST /api/ia/prediccion ejecuta predict.py y retorna JSON", async () => {

    const payload = {
      "Ship Mode":     "Second Class",
      "Segment":       "Consumer",
      "City":          "Los Angeles",
      "State":         "California",
      "Region":        "West",
      "Category":      "Furniture",
      "Sub-Category":  "Chairs",
      "Discount":      0.1,
      "Shipping Days": 3,
      "Month":         5,
      "Day":           14,
      "Year":          2025,
      "WeekDay":       2,
      "Weekend":       0
    };

    const res = await request(BASE_URL)
      .post("/api/ia/prediccion")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("ventas_predichas");
    expect(res.body).toHaveProperty("demanda_predicha");

    // Los valores deben ser numéricos y positivos
    expect(typeof res.body.ventas_predichas).toBe("number");
    expect(typeof res.body.demanda_predicha).toBe("number");
    expect(res.body.ventas_predichas).toBeGreaterThan(0);
    expect(res.body.demanda_predicha).toBeGreaterThan(0);
  });

  test("2.2 IA con categoría inválida retorna error controlado (no crash)", async () => {

    const res = await request(BASE_URL)
      .post("/api/ia/prediccion")
      .set("Authorization", `Bearer ${token}`)
      .send({
        "Ship Mode":     "Second Class",
        "Segment":       "Consumer",
        "City":          "Los Angeles",
        "State":         "California",
        "Region":        "West",
        "Category":      "Furniture",
        "Sub-Category":  "CATEGORIA_INVALIDA_XYZ",
        "Discount":      0.1,
        "Shipping Days": 3,
        "Month":         5,
        "Day":           14,
        "Year":          2025,
        "WeekDay":       2,
        "Weekend":       0
      });

    // Debe retornar error JSON, no crashear el servidor
    expect([200, 500]).toContain(res.statusCode);
    expect(res.body).toBeDefined();

    // Si es error, debe tener mensaje descriptivo
    if (res.statusCode === 500) {
      expect(res.body).toHaveProperty("message");
    }
  });

  test("2.3 Dashboard GET /api/ventas/dashboard construye input IA desde BD", async () => {

    const res = await request(BASE_URL)
      .get("/api/ventas/dashboard")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("ventasPorMes");
    expect(Array.isArray(res.body.ventasPorMes)).toBe(true);

    // Si hay ventas, debe retornar ultimaVenta con campos para la IA
    if (res.body.ultimaVenta) {
      const u = res.body.ultimaVenta;
      expect(u).toHaveProperty("ship_mode");
      expect(u).toHaveProperty("segment");
      expect(u).toHaveProperty("region");
      expect(u).toHaveProperty("shipping_days");
      expect(u).toHaveProperty("categoria");
    }
  });
});


// ================================================
// FLUJO 3 — Base de datos → Triggers → Stock
// Verifica que trg_stock y trg_total se disparan
// automáticamente al insertar en detalle_venta
// ================================================
describe("Flujo 3 — Base de datos → Triggers → Stock y Total", () => {

  let stockAntes = 0;
  let ventaId = null;

  test("3.1 trg_stock — stock se decrementa automáticamente al crear venta", async () => {

    // Stock inicial
    const productosRes = await request(BASE_URL)
      .get("/api/productos")
      .set("Authorization", `Bearer ${token}`);

    const prod = productosRes.body.find(p => p.id === productoIntegracionId);
    stockAntes = Number(prod.stock);

    // Crear venta con 3 unidades
    const ventaRes = await request(BASE_URL)
      .post("/api/ventas")
      .set("Authorization", `Bearer ${token}`)
      .send({
        cliente:       "Cliente Trigger Test",
        metodo_pago:   "Efectivo",
        estado:        "completado",
        ship_mode:     "Same Day",
        segment:       "Home Office",
        region:        "South",
        shipping_days: 0,
        detalles: [
          {
            producto_id: productoIntegracionId,
            cantidad:    3,
            descuento:   0
          }
        ]
      });

    expect(ventaRes.statusCode).toBe(201);
    ventaId = ventaRes.body.venta_id;

    // Verificar stock después — trigger debe haberlo decrementado
    const productosRes2 = await request(BASE_URL)
      .get("/api/productos")
      .set("Authorization", `Bearer ${token}`);

    const prodDespues = productosRes2.body.find(
      p => p.id === productoIntegracionId
    );

    expect(Number(prodDespues.stock)).toBe(stockAntes - 3);
  });

  test("3.2 trg_total — total de la venta calculado automáticamente", async () => {

    if (!ventaId) {
      console.warn(" ventaId no disponible, omitiendo test 3.2");
      return;
    }

    const ventaRes = await request(BASE_URL)
      .get(`/api/ventas/${ventaId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(ventaRes.statusCode).toBe(200);

    const venta = ventaRes.body;
    const totalEsperado = venta.detalles.reduce(
      (acc, d) => acc + Number(d.subtotal), 0
    );

    // El trigger trg_total debe haber calculado el total exactamente
    expect(Number(venta.total)).toBeCloseTo(totalEsperado, 2);
  });

  test("3.3 Atomicidad — venta inválida no deja registros parciales", async () => {

    // Intentar venta con producto inexistente
    const res = await request(BASE_URL)
      .post("/api/ventas")
      .set("Authorization", `Bearer ${token}`)
      .send({
        cliente:       "Cliente Atomicidad",
        metodo_pago:   "Efectivo",
        estado:        "completado",
        ship_mode:     "Standard Class",
        segment:       "Consumer",
        region:        "West",
        shipping_days: 3,
        detalles: [
          {
            producto_id: 999999,    // producto que no existe
            cantidad:    1,
            descuento:   0
          }
        ]
      });

    expect(res.statusCode).toBe(500);

    // El stock del producto real NO debe haberse modificado
    const productosRes = await request(BASE_URL)
      .get("/api/productos")
      .set("Authorization", `Bearer ${token}`);

    const prod = productosRes.body.find(p => p.id === productoIntegracionId);

    // Stock debe ser igual al que quedó después del test 3.1 (stockAntes - 3)
    expect(Number(prod.stock)).toBe(stockAntes - 3);
  });
});


// ================================================
// LIMPIEZA
// ================================================
afterAll(async () => {
  if (productoIntegracionId) {
    await request(BASE_URL)
      .delete(`/api/productos/${productoIntegracionId}`)
      .set("Authorization", `Bearer ${token}`);
  }
});