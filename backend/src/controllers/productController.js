import { pool } from "../config/db.js";


// ================= GET =================
export const getProductos = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT 
        p.*,
        c.nombre AS categoria
      FROM productos p
      LEFT JOIN categorias c
      ON p.categoria_id = c.id
      ORDER BY p.id DESC
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Error obteniendo productos",
    });
  }
};


// ================= CREATE =================
export const createProducto = async (req, res) => {
  try {

    const {
      nombre,
      descripcion,
      precio,
      stock,
      stock_minimo,
      stock_maximo,
      categoria_id,
      sku,
      ubicacion,
      imagen,
      sub_categoria,
    } = req.body;

    await pool.query(
      `
      INSERT INTO productos (
        nombre,
        descripcion,
        precio,
        stock,
        stock_minimo,
        stock_maximo,
        categoria_id,
        sku,
        ubicacion,
        imagen,
        sub_categoria
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      `,
      [
        nombre,
        descripcion,
        precio,
        stock,
        stock_minimo,
        stock_maximo,
        categoria_id,
        sku,
        ubicacion,
        imagen,
        sub_categoria || "Chairs",
      ]
    );

    res.json({
      message: "Producto creado",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Error creando producto",
    });
  }
};


// ================= UPDATE =================
export const updateProducto = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      nombre,
      descripcion,
      precio,
      stock,
      stock_minimo,
      stock_maximo,
      categoria_id,
      sku,
      ubicacion,
      imagen,
      estado,
      sub_categoria,
    } = req.body;

    await pool.query(
      `
      UPDATE productos
      SET
        nombre=$1,
        descripcion=$2,
        precio=$3,
        stock=$4,
        stock_minimo=$5,
        stock_maximo=$6,
        categoria_id=$7,
        sku=$8,
        ubicacion=$9,
        imagen=$10,
        estado=$11,
        sub_categoria=$12
      WHERE id=$13
      `,
      [
        nombre,
        descripcion,
        precio,
        stock,
        stock_minimo,
        stock_maximo,
        categoria_id,
        sku,
        ubicacion,
        imagen,
        estado,
        sub_categoria || "Chairs",
        id,
      ]
    );

    res.json({
      message: "Producto actualizado",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Error actualizando producto",
    });
  }
};


// ================= DELETE =================
export const deleteProducto = async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      `DELETE FROM productos WHERE id=$1`,
      [id]
    );

    res.json({
      message: "Producto eliminado",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Error eliminando producto",
    });
  }
};