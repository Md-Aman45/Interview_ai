const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});




async function sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
        from: `"InterviewAI <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Reset your password - InterviewAI',
        html: `
                <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:40px 20px">
                <div style="font-size:24px;font-weight:700;color:#0f172a;margin-bottom:8px">Reset your password</div>
                <p style="color:#64748b;font-size:14px;line-height:1.6;margin-bottom:28px">
                    Click the button below to reset your password. This link expires in 1 hour.
                </p>
                <a href="${resetUrl}" style="display:inline-block;background:#4f46e5;color:#fff;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none">
                    Reset password
                </a>
                <p style="color:#94a3b8;font-size:12px;margin-top:28px">
                    If you didn't request this, ignore this email.
                </p>
            </div>
        `
    });
}



module.exports = { sendPasswordResetEmail };