import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail, sendResetEmail } from "../utils/email.js";

// ================= REGISTER =================
export const register = async (req, res) => {
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

    // email básico
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Email inválido" });
    }

    // password
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener mínimo 6 caracteres" });
    }

    // nombres / apellidos
    if (!nombres || nombres.trim().length < 2) {
      return res.status(400).json({ error: "Nombres inválidos" });
    }

    if (!apellidos || apellidos.trim().length < 2) {
      return res.status(400).json({ error: "Apellidos inválidos" });
    }

    // cédula y teléfono (10 dígitos)
    const regex = /^\d{10}$/;

    if (!regex.test(cedula)) {
      return res.status(400).json({ error: "Cédula inválida (10 dígitos)" });
    }

    if (!regex.test(telefono)) {
      return res.status(400).json({ error: "Teléfono inválido (10 dígitos)" });
    }

    // ================= EVITAR DUPLICADOS =================
    const exist = await pool.query(
      "SELECT * FROM usuarios WHERE email=$1 OR cedula=$2",
      [email, cedula]
    );

    if (exist.rows.length > 0) {
      return res.status(400).json({ error: "Usuario ya existe" });
    }

    // ================= PROCESO =================
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");

    await pool.query(
      `INSERT INTO usuarios 
       (email, password, rol, nombres, apellidos, cedula, telefono, direccion, verify_token)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        email,
        hashedPassword,
        rol || "vendedor",
        nombres,
        apellidos,
        cedula,
        telefono,
        direccion,
        token
      ]
    );

    // ================= EMAIL =================
    const emailResult = await sendVerificationEmail(email, token);

    res.json({
      message: "Usuario creado correctamente",
      devLink: emailResult?.link || null,
      note: emailResult?.dev
        ? "Modo desarrollo: usa el link manual"
        : "Revisa tu correo"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en servidor" });
  }
};


// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM usuarios WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Usuario no existe" });
    }

    const user = result.rows[0];

    //  1. VALIDAR SI ESTÁ ACTIVO
    if (!user.activo) {
      return res.status(403).json({
        error: "Usuario desactivado, contacta al administrador",
      });
    }

    //  2. VALIDAR VERIFICACIÓN DE EMAIL
    if (!user.verificado) {
      return res.status(403).json({
        error: "Debes verificar tu correo antes de iniciar sesión",
      });
    }

    // 3. VALIDAR PASSWORD
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    //  4. GENERAR JWT
    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        rol: user.rol,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en servidor" });
  }
};


// ================= VERIFY EMAIL =================

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const result = await pool.query(
      "SELECT * FROM usuarios WHERE verify_token=$1",
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Token inválido" });
    }

    await pool.query(
      `UPDATE usuarios
       SET verificado = true,
           verify_token = NULL
       WHERE id = $1`,
      [result.rows[0].id]
    );

    res.json({ message: "Cuenta verificada correctamente" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en servidor" });
  }
};






// ================= SOLICITAR RESET =================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await pool.query(
      "SELECT * FROM usuarios WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.json({ message: "Si existe el correo, se enviará link" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 min

    await pool.query(
      `UPDATE usuarios
       SET reset_token=$1, reset_expires=$2
       WHERE email=$3`,
      [token, expires, email]
    );

    const emailResult = await sendResetEmail(email, token);

    res.json({
      message: "Si existe el correo, se enviará link",
      devLink: emailResult?.link || null
    });

  } catch {
    res.status(500).json({ error: "Error servidor" });
  }
};




// ================= RESETEAR CONTRASEÑA =================
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const result = await pool.query(
      `SELECT * FROM usuarios
       WHERE reset_token=$1 AND reset_expires > NOW()`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Token inválido o expirado" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      `UPDATE usuarios
       SET password=$1,
           reset_token=NULL,
           reset_expires=NULL
       WHERE id=$2`,
      [hashed, result.rows[0].id]
    );

    res.json({ message: "Contraseña actualizada" });

  } catch {
    res.status(500).json({ error: "Error servidor" });
  }
};