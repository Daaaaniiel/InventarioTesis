import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/email.js";

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { email, password, rol } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const exists = await pool.query(
      "SELECT * FROM usuarios WHERE email=$1",
      [email]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ error: "Usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //  generar token
    const token = crypto.randomBytes(32).toString("hex");

    await pool.query(
      `INSERT INTO usuarios (email, password, rol, verify_token)
       VALUES ($1, $2, $3, $4)`,
      [email, hashedPassword, rol || "vendedor", token]
    );

    //  enviar correo
    await sendVerificationEmail(email, token);

    res.json({
      message: "Usuario creado. Revisa tu correo para verificar tu cuenta",
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

    // 🔥 validar verificación
    if (!user.verificado) {
      return res.status(403).json({
        error: "Debes verificar tu correo antes de iniciar sesión",
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

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