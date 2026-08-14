const nodemailer = require("nodemailer");

/**
 * Brevo (formerly Sendinblue) SMTP Transporter
 * ─────────────────────────────────────────────
 * SMTP Server : smtp-relay.brevo.com
 * Port        : 587  (STARTTLS)
 * Login       : b588b8001@smtp-brevo.com
 * Auth        : SMTP API Key (xsmtpsib-…)
 */
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,          // STARTTLS on port 587
    auth: {
        user: process.env.BREVO_LOGIN || "b588b8001@smtp-brevo.com",
        pass: process.env.BREVO_SMTP_KEY
    },
    tls: {
        rejectUnauthorized: false   // allow self-signed certs in dev
    }
});

// Quick connectivity test on startup (non-blocking)
transporter.verify((err, _) => {
    if (err) {
        console.error("[Brevo SMTP] Connection error:", err.message);
    } else {
        console.log("[Brevo SMTP] Ready to send emails ✓");
    }
});

module.exports = transporter;
