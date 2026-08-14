const axios = require("axios");

/**
 * Brevo (formerly Sendinblue) HTTP API Transporter
 * ─────────────────────────────────────────────
 * Replaces nodemailer because Render free tier blocks outbound SMTP ports (25, 465, 587).
 * This uses the standard HTTP port 443 which is never blocked.
 */
const transporter = {
    sendMail: async (mailOptions) => {
        try {
            // Helper to parse ' "Name" <email@domain.com> ' formats
            const extractEmail = (str) => {
                const match = str.match(/<([^>]+)>/);
                return match ? match[1] : str.replace(/"[^"]+"/g, '').trim();
            };
            const extractName = (str) => {
                const match = str.match(/"([^"]+)"/);
                return match ? match[1] : undefined;
            };

            const senderEmail = extractEmail(mailOptions.from);
            const senderName = extractName(mailOptions.from) || "AARYA AUTO GARAGE";
            const recipientEmail = extractEmail(mailOptions.to);

            const payload = {
                sender: { name: senderName, email: senderEmail },
                to: [{ email: recipientEmail }],
                subject: mailOptions.subject,
                htmlContent: mailOptions.html
            };

            const response = await axios.post("https://api.brevo.com/v3/smtp/email", payload, {
                headers: {
                    'accept': 'application/json',
                    'api-key': process.env.BREVO_SMTP_KEY,
                    'content-type': 'application/json'
                }
            });

            console.log("[Brevo HTTP] Email sent successfully:", response.data);
            return response.data;
        } catch (error) {
            console.error("[Brevo HTTP] Failed to send email:");
            if (error.response) {
                console.error(error.response.data);
            } else {
                console.error(error.message);
            }
            throw error;
        }
    },
    
    // Mock the verify function so server startup doesn't crash
    verify: (callback) => {
        if (!process.env.BREVO_SMTP_KEY) {
            callback(new Error("BREVO_SMTP_KEY is missing from environment variables!"), null);
        } else {
            console.log("[Brevo HTTP] Ready to send emails ✓");
            callback(null, true);
        }
    }
};

module.exports = transporter;
