import nodemailer from 'nodemailer';

/**
 * Sends a real-time email using SMTP configuration from environment variables.
 * For Gmail: Use an "App Password" (not your main password).
 */
export const sendEmail = async (to: string, subject: string, body: string) => {
  try {
    // Create a transporter using environment variables
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"TalentLens AI" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: body,
      // For a more professional look, we could add HTML here
      html: `<div style="font-family: sans-serif; line-height: 1.6; color: #333;">
              ${body.replace(/\n/g, '<br/>')}
            </div>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Error sending email:', error);
    throw new Error(error.message || 'Failed to send email');
  }
};
