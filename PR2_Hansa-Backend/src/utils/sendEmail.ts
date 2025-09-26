import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (to: string, code: string) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('EMAIL_USER y EMAIL_PASS deben estar configurados');
  }

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Hansa Sistema" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Código de verificación - Hansa',
    text: `Tu código de verificación es: ${code}\n\nEste código expira en 10 minutos.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #9D0045;">Código de verificación</h2>
        <p>Tu código de verificación es:</p>
        <div style="background-color: #f8dee8; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #9D0045; font-size: 32px; margin: 0;">${code}</h1>
        </div>
        <p><strong>Este código expira en 10 minutos.</strong></p>
        <p>Si no solicitaste este código, puedes ignorar este correo.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
