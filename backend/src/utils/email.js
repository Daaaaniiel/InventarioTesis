import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (to, token) => {
  const link = `${process.env.FRONTEND_URL}/verify/${token}`;

  //  SIEMPRE mostrar link (clave para tesis)
  console.log(" LINK DE VERIFICACIÓN:", link);

  //  MODO DESARROLLO
  if (process.env.NODE_ENV === "development") {
    console.log("MODO DEV: no dependemos del correo");
    
    return {
      success: true,
      dev: true,
      link
    };
  }

  //  MODO PRODUCCIÓN
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: "Verifica tu cuenta",
      html: `
        <h2>Verificación de cuenta</h2>
        <p>Haz clic en el botón:</p>
        <a href="${link}" style="
          background:#3b82f6;
          color:white;
          padding:10px 15px;
          border-radius:5px;
          text-decoration:none;
        ">
          Verificar cuenta
        </a>
      `,
    });

    console.log("📧 Email enviado:", response);

    return {
      success: true,
      dev: false
    };

  } catch (error) {
    console.error("Error enviando email:", error);

    //FALLBACK
    console.log("FALLBACK: usa este link manualmente:", link);

    return {
      success: false,
      fallback: true,
      link
    };
  }
};
////RECUPERAR CONTRASEÑA
export const sendResetEmail = async (to, token) => {
  const link = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  console.log("🔗 RESET LINK:", link);

  if (process.env.NODE_ENV === "development") {
    return { link, dev: true };
  }

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: "Recuperar contraseña",
      html: `
        <h2>Recuperación de contraseña</h2>
        <a href="${link}">Cambiar contraseña</a>
      `
    });

    return { success: true };

  } catch (err) {
    console.log("⚠️ FALLBACK:", link);
    return { link, fallback: true };
  }
};