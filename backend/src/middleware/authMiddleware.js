import jwt from "jsonwebtoken";

//  validar token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { id, rol }

    next();
  } catch (err) {
    return res.status(403).json({ error: "Token inválido" });
  }
};

//  solo admin
export const isAdmin = (req, res, next) => {
  if (req.user.rol !== "admin") {
    return res.status(403).json({ error: "Acceso solo admin" });
  }
  next();
};