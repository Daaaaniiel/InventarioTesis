import { pool } from "../config/db.js";


// ==========================================
// OBTENER TODAS LAS VENTAS
// ==========================================
export const getVentas = async (req, res) => {

  try {

    const result = await pool.query(
      `
      SELECT
        v.id,
        v.fecha,
        v.cliente,
        v.metodo_pago,
        v.estado,
        v.total,
        v.vendedor_id,

        json_agg(
          json_build_object(
            'detalle_id', dv.id,
            'producto_id', p.id,
            'producto', p.nombre,
            'cantidad', dv.cantidad,
            'precio_unitario', dv.precio_unitario,
            'subtotal', dv.subtotal
          )
        ) AS detalles

      FROM ventas v

      LEFT JOIN detalle_venta dv
        ON v.id = dv.venta_id

      LEFT JOIN productos p
        ON p.id = dv.producto_id

      GROUP BY v.id

      ORDER BY v.id DESC
      `
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error obteniendo ventas"
    });
  }
};


// ==========================================
// OBTENER UNA VENTA
// ==========================================
export const getVentaById = async (req, res) => {

  try {

    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        v.id,
        v.fecha,
        v.cliente,
        v.metodo_pago,
        v.estado,
        v.total,
        v.vendedor_id,

        json_agg(
          json_build_object(
            'detalle_id', dv.id,
            'producto_id', p.id,
            'producto', p.nombre,
            'cantidad', dv.cantidad,
            'precio_unitario', dv.precio_unitario,
            'subtotal', dv.subtotal
          )
        ) AS detalles

      FROM ventas v

      LEFT JOIN detalle_venta dv
        ON v.id = dv.venta_id

      LEFT JOIN productos p
        ON p.id = dv.producto_id

      WHERE v.id = $1

      GROUP BY v.id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Venta no encontrada"
      });
    }

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error obteniendo venta"
    });
  }
};


// ==========================================
// CREAR VENTA
// ==========================================
export const createVenta = async (req, res) => {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    const {
  cliente,
  metodo_pago,
  estado,
  detalles
} = req.body;
const vendedor_id = req.user.id;
    // ======================================
    // VALIDAR PRODUCTOS
    // ======================================
    if (!detalles || detalles.length === 0) {

      return res.status(400).json({
        message: "Debe agregar productos"
      });
    }

    // ======================================
    // CREAR CABECERA
    // ======================================
    const ventaResult = await client.query(
      `
      INSERT INTO ventas
      (
        cliente,
        metodo_pago,
        estado,
        vendedor_id
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        cliente,
        metodo_pago,
        estado,
        vendedor_id
      ]
    );

    const venta = ventaResult.rows[0];

    // ======================================
    // INSERTAR DETALLES
    // ======================================
    for (const item of detalles) {

      const productoDB = await client.query(
        `
        SELECT *
        FROM productos
        WHERE id = $1
        `,
        [item.producto_id]
      );

      const producto = productoDB.rows[0];

      // ==============================
      // VALIDAR PRODUCTO
      // ==============================
      if (!producto) {

        throw new Error(
          `Producto ${item.producto_id} no existe`
        );
      }

      // ==============================
      // VALIDAR STOCK
      // ==============================
      if (
        Number(producto.stock) <
        Number(item.cantidad)
      ) {

        throw new Error(
          `Stock insuficiente para ${producto.nombre}`
        );
      }

      // ==============================
      // SUBTOTAL
      // ==============================
      const subtotal =
        Number(producto.precio) *
        Number(item.cantidad);

      // ==============================
      // INSERTAR DETALLE
      // ==============================
      await client.query(
        `
        INSERT INTO detalle_venta
        (
          venta_id,
          producto_id,
          cantidad,
          precio_unitario,
          subtotal
        )
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
          venta.id,
          item.producto_id,
          item.cantidad,
          producto.precio,
          subtotal
        ]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Venta creada correctamente",
      venta_id: venta.id
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  } finally {

    client.release();
  }
};


// ==========================================
// ACTUALIZAR VENTA
// ==========================================
export const updateVenta = async (req, res) => {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    const { id } = req.params;

    const {
      cliente,
      metodo_pago,
      estado
    } = req.body;

    // ======================================
    // ACTUALIZAR CABECERA
    // ======================================
    const ventaExiste = await client.query(
      `
      SELECT *
      FROM ventas
      WHERE id = $1
      `,
      [id]
    );

    if (ventaExiste.rows.length === 0) {

      return res.status(404).json({
        message: "Venta no encontrada"
      });
    }

    await client.query(
      `
      UPDATE ventas
      SET
        cliente = $1,
        metodo_pago = $2,
        estado = $3
      WHERE id = $4
      `,
      [
        cliente,
        metodo_pago,
        estado,
        id
      ]
    );

    await client.query("COMMIT");

    res.json({
      message: "Venta actualizada"
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error(error);

    res.status(500).json({
      message: "Error actualizando venta"
    });

  } finally {

    client.release();
  }
};


// ==========================================
// ELIMINAR VENTA
// ==========================================
export const deleteVenta = async (req, res) => {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    const { id } = req.params;

    // ======================================
    // VALIDAR EXISTENCIA
    // ======================================
    const ventaExiste = await client.query(
      `
      SELECT *
      FROM ventas
      WHERE id = $1
      `,
      [id]
    );

    if (ventaExiste.rows.length === 0) {

      return res.status(404).json({
        message: "Venta no encontrada"
      });
    }

    // ======================================
    // ELIMINAR VENTA
    // detalle_venta se elimina por CASCADE
    // ======================================
    await client.query(
      `
      DELETE FROM ventas
      WHERE id = $1
      `,
      [id]
    );

    await client.query("COMMIT");

    res.json({
      message: "Venta eliminada"
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error(error);

    res.status(500).json({
      message: "Error eliminando venta"
    });

  } finally {

    client.release();
  }
};