import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (to, token) => {
  try {
    const link = `${process.env.FRONTEND_URL}/verify/${token}`;

    await resend.emails.send({
      from: "onboarding@resend.dev", // ✔ sin dominio
      to,
      subject: "Verifica tu cuenta",
      html: `
        <h2>Verificación de cuenta</h2>
        <p>Haz click en el siguiente enlace:</p>
        <a href="${link}">${link}</a>
      `,
    });

    console.log(" Email enviado a:", to);

  } catch (error) {
    console.error("Error enviando email:", error);
  }
};