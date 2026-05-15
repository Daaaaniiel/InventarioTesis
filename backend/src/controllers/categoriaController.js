import { pool } from "../config/db.js";

// ================= GET =================
export const getCategorias = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT *
      FROM categorias
      ORDER BY id DESC
    `);

    res.json(result.rows);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error al obtener categorías"
    });
  }
};

// ================= CREATE =================
export const createCategoria = async (req, res) => {

  try {

    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({
        error: "El nombre es obligatorio"
      });
    }

    const existe = await pool.query(
      "SELECT * FROM categorias WHERE nombre = $1",
      [nombre]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({
        error: "La categoría ya existe"
      });
    }

    await pool.query(
      `
      INSERT INTO categorias
      (nombre, descripcion)
      VALUES ($1, $2)
      `,
      [nombre, descripcion]
    );

    res.json({
      message: "Categoría creada"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Error al crear categoría"
    });
  }
};

// ================= UPDATE =================
export const updateCategoria = async (req, res) => {

  try {

    const { id } = req.params;

    const { nombre, descripcion } = req.body;

    await pool.query(
      `
      UPDATE categorias
      SET nombre = $1,
          descripcion = $2
      WHERE id = $3
      `,
      [nombre, descripcion, id]
    );

    res.json({
      message: "Categoría actualizada"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Error al actualizar"
    });
  }
};

// ================= DELETE =================
export const deleteCategoria = async (req, res) => {

  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM categorias WHERE id = $1",
      [id]
    );

    res.json({
      message: "Categoría eliminada"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Error al eliminar"
    });
  }
};