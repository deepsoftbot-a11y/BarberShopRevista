import { Resend } from "resend";
import { formatTZ } from "./datetime";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.FROM_EMAIL ?? "reservas@barberia.com";

interface ConfirmationData {
  to: string;
  customerName: string;
  serviceName: string;
  startAt: Date;
  code: string;
}

export async function sendConfirmationEmail(data: ConfirmationData) {
  const { to, customerName, serviceName, startAt, code } = data;
  const fechaStr = formatTZ(startAt, "EEEE d 'de' MMMM yyyy");
  const horaStr = formatTZ(startAt, "HH:mm");

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Reserva confirmada – ${code}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="color:#1a1a1a">¡Reserva confirmada!</h2>
        <p>Hola <strong>${customerName}</strong>, tu cita ha sido registrada.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:8px 0;color:#666">Servicio</td><td style="padding:8px 0;font-weight:600">${serviceName}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Fecha</td><td style="padding:8px 0;font-weight:600;text-transform:capitalize">${fechaStr}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Hora</td><td style="padding:8px 0;font-weight:600">${horaStr}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Código</td><td style="padding:8px 0;font-weight:600;letter-spacing:2px">${code}</td></tr>
        </table>
        <p style="color:#666;font-size:14px">Si necesitas cancelar o cambiar tu cita, comunícate directamente con la barbería.</p>
      </div>
    `,
  });
}
