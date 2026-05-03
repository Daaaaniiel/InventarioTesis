import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

// 🔹 GET TODOS
export const getUsuarios = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        nombres,
        apellidos,
        cedula,
        telefono,
        direccion,
        email,
        rol,
        activo
      FROM usuarios
    `);

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: "Error servidor" });
  }
};

// 🔹 GET UNO
export const getUsuario = async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "SELECT id, email, rol, activo FROM usuarios WHERE id=$1",
    [id]
  );

  res.json(result.rows[0]);
};

//  CREAR (ADMIN)
export const createUsuario = async (req, res) => {
  try {
    const {
      email,
      password,
      rol,
      nombres,
      apellidos,
      cedula,
      telefono,
      direccion
    } = req.body;

    // ================= VALIDACIONES =================

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Email inválido" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password mínimo 6 caracteres" });
    }

    if (!nombres || nombres.trim().length < 2) {
      return res.status(400).json({ error: "Nombres inválidos" });
    }

    if (!apellidos || apellidos.trim().length < 2) {
      return res.status(400).json({ error: "Apellidos inválidos" });
    }

    const regex = /^\d{10}$/;

    if (!regex.test(cedula)) {
      return res.status(400).json({ error: "Cédula inválida" });
    }

    if (!regex.test(telefono)) {
      return res.status(400).json({ error: "Teléfono inválido" });
    }

    // ================= DUPLICADOS =================
    const exist = await pool.query(
      "SELECT * FROM usuarios WHERE email=$1 OR cedula=$2",
      [email, cedula]
    );

    if (exist.rows.length > 0) {
      return res.status(400).json({ error: "Usuario ya existe" });
    }

    // ================= PROCESO =================
    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO usuarios 
       (email, password, rol, nombres, apellidos, cedula, telefono, direccion, verificado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,true)`,
      [
        email,
        hashed,
        rol || "vendedor",
        nombres,
        apellidos,
        cedula,
        telefono,
        direccion
      ]
    );

    res.json({ message: "Usuario creado correctamente" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en servidor" });
  }
};




export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nombres,
      apellidos,
      cedula,
      telefono,
      direccion,
      email,
      rol
    } = req.body;

    // 🔥 VALIDACIONES
    if (!nombres || !apellidos || !email) {
      return res.status(400).json({ error: "Campos obligatorios faltantes" });
    }

    if (!/^\d{10}$/.test(cedula)) {
      return res.status(400).json({ error: "Cédula inválida" });
    }

    if (!/^\d{10}$/.test(telefono)) {
      return res.status(400).json({ error: "Teléfono inválido" });
    }

    // 🔥 EVITAR DUPLICADOS (email o cédula)
    const existe = await pool.query(
      `SELECT * FROM usuarios 
       WHERE (email = $1 OR cedula = $2) AND id != $3`,
      [email, cedula, id]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({
        error: "Email o cédula ya en uso"
      });
    }

    await pool.query(
      `UPDATE usuarios SET
        nombres=$1,
        apellidos=$2,
        cedula=$3,
        telefono=$4,
        direccion=$5,
        email=$6,
        rol=$7
       WHERE id=$8`,
      [nombres, apellidos, cedula, telefono, direccion, email, rol, id]
    );

    res.json({ message: "Usuario actualizado correctamente" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en servidor" });
  }
};

// 🔹 DESACTIVAR USUARIO (SOFT DELETE)
export const deleteUsuario = async (req, res) => {
  const { id } = req.params;

  //  evitar que se elimine a sí mismo
  if (req.user.id == id) {
    return res.status(400).json({ error: "No puedes desactivarte a ti mismo" });
  }

  await pool.query(
    "UPDATE usuarios SET activo = false WHERE id = $1",
    [id]
  );

  res.json({ message: "Usuario desactivado" });
};