const nodemailer = require("nodemailer");

/**
 * Brevo SMTP Transporter - Using Port 2525 to bypass Render blocks
 */
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 2525, // Bypass Render port 587 block
    secure: false, // STARTTLS
    auth: {
        user: process.env.BREVO_LOGIN || "b588b8001@smtp-brevo.com",
        pass: process.env.BREVO_SMTP_KEY
    },
    tls: {
        rejectUnauthorized: false
    }
});

transporter.verify((err, _) => {
    if (err) {
        console.error("[Brevo SMTP 2525] Connection error:", err.message);
    } else {
        console.log("[Brevo SMTP 2525] Ready to send emails ✓");
    }
});

module.exports = transporter;
