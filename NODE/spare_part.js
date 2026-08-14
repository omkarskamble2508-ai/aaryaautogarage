const express = require("express");
const router = express.Router();

// This module expects `db` to be passed in via a factory function.
module.exports = function (db) {

    // =============================================
    // AUTO-CREATE CART TABLE (if not exists)
    // =============================================
    (async () => {
        try {
            await db.query(`
                CREATE TABLE IF NOT EXISTS cart (
                    cart_id INT AUTO_INCREMENT PRIMARY KEY,
                    customer_id INT NOT NULL,
                    part_id INT NOT NULL,
                    quantity INT DEFAULT 1,
                    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
                    FOREIGN KEY (part_id) REFERENCES spare_parts(part_id) ON DELETE CASCADE,
                    UNIQUE KEY unique_cart_item (customer_id, part_id)
                )
            `);
            console.log("Cart table ready");
        } catch (err) {
            console.error("Cart table creation error:", err.message);
        }

        try {
            await db.query(`
                CREATE TABLE IF NOT EXISTS orders (
                    order_id VARCHAR(6) PRIMARY KEY,
                    customer_id INT NOT NULL,
                    total_amount DECIMAL(10,2) NOT NULL,
                    status ENUM('Ordered', 'Accepted', 'Delivered', 'Declined') DEFAULT 'Ordered',
                    mobile_number VARCHAR(15) DEFAULT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
                )
            `);
            await db.query(`
                CREATE TABLE IF NOT EXISTS order_items (
                    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
                    order_id VARCHAR(6) NOT NULL,
                    part_id INT NOT NULL,
                    quantity INT NOT NULL,
                    price DECIMAL(10,2) NOT NULL,
                    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
                    FOREIGN KEY (part_id) REFERENCES spare_parts(part_id) ON DELETE CASCADE
                )
            `);
            console.log("Order tables ready");
        } catch (err) {
            console.error("Order table creation error:", err.message);
        }
    })();

    // =============================================
    // SPARE PARTS (Inventory) CRUD APIs
    // =============================================

    // Create a spare part
    router.post("/spare_parts", async (req, res) => {

        try {

            const { part_name, brand, applicability_base_model, applicable_model, categories, price, stock_quantity, image } = req.body;
            const sql = "INSERT INTO spare_parts(part_name,brand,applicability_base_model,applicable_model,categories,price,stock_quantity,image) VALUES(?,?,?,?,?,?,?,?)";
            await db.query(sql, [part_name, brand, applicability_base_model, applicable_model, categories, price, stock_quantity, image]);

            res.json({
                message: "Spare part inserted successfully"
            });

        } catch (err) {
            res.status(500).json({
                message: err.message
            });
        }
    });

    // Get all spare parts
    router.get("/spare_parts", async (req, res) => {

        try {
            const sql = "SELECT * FROM spare_parts";

            const [parts] = await db.query(sql);

            res.json(parts);

        } catch (err) {
            res.status(500).json({
                message: err.message
            });
        }
    });

    // Get spare part by id
    router.get("/spare_parts/:part_id", async (req, res) => {

        try {

            const { part_id } = req.params;
            const sql = "SELECT * FROM spare_parts WHERE part_id=?";
            const [part] = await db.query(sql, [part_id]);

            if (part.length === 0) {
                return res.status(404).json({
                    message: "Spare part not found"
                });
            }

            res.json(part[0]);

        } catch (err) {

            res.status(500).json({
                message: err.message
            });

        }

    });

    // Update spare part
    router.put("/spare_parts/:part_id", async (req, res) => {

        try {

            const { part_id } = req.params;
            const { part_name, brand, applicability_base_model, applicable_model, categories, price, stock_quantity, image } = req.body;
            const sql =
                "UPDATE spare_parts SET part_name=?, brand=?, applicability_base_model=?, applicable_model=?, categories=?, price=?, stock_quantity=?, image=? WHERE part_id=?";
            const [result] = await db.query(sql, [
                part_name,
                brand,
                applicability_base_model,
                applicable_model,
                categories,
                price,
                stock_quantity,
                image,
                part_id
            ]);

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "Spare part not found"
                });

            }

            res.json({
                message: "Spare part updated successfully"
            });

        } catch (err) {

            res.status(500).json({
                message: err.message
            });

        }

    });

    // Delete spare part
    router.delete("/spare_parts/:part_id", async (req, res) => {

        try {

            const { part_id } = req.params;
            const sql = "DELETE FROM spare_parts WHERE part_id=?";
            const [result] = await db.query(sql, [part_id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Spare part not found"
                });
            }

            res.json({
                message: "Spare part deleted successfully"
            });

        } catch (err) {

            res.status(500).json({
                message: err.message
            });

        }
    });

    // Bulk upload spare parts
    // router.post("/bulkupload", async (req, res) => {

    //     try {

    //         const parts = req.body.parts || [];

    //         if (!Array.isArray(parts) || parts.length === 0) {
    //             return res.status(400).json({
    //                 message: "No spare parts provided for bulk upload"
    //             });
    //         }

    //         const values = parts.map((p) => [p.part_name, p.brand, p.category, p.price, p.stock_quantity]);
    //         const sql = "INSERT INTO spare_parts(part_name,brand,category,price,stock_quantity) VALUES ?";

    //         await db.query(sql, [values]);

    //         res.json({
    //             message: "Bulk Upload Done !!"
    //         });

    //     } catch (err) {

    //         console.error("/bulkupload error:", err);
    //         res.status(500).json({
    //             message: err.message || "Bulk upload failed"
    //         });

    //     }
    // });



    // =============================================
    // PRODUCT (Spare Parts as Products) CRUD APIs
    // These endpoints are used by AddProduct, ProductList, Editproduct
    // =============================================

    // Create a product (spare part with customer association)
    router.post("/Product", async (req, res) => {

        try {

            const { part_name, brand, applicability_base_model, applicable_model, categories, price, stock_quantity, image } = req.body;
            const sql = "INSERT INTO spare_parts(part_name,brand,applicability_base_model,applicable_model,categories,price,stock_quantity,image,in_cart) VALUES(?,?,?,?,?,?,?,?,?)";
            await db.query(sql, [part_name, brand, applicability_base_model, applicable_model, categories, price, stock_quantity, image, false]);

            res.json({
                message: "Product added successfully"
            });

        } catch (err) {
            res.status(500).json({
                message: err.message
            });
        }
    });

    // Get all products
    router.get("/Product", async (req, res) => {

        try {
            const sql = `
                SELECT sp.part_id AS pid, sp.part_name AS pname, sp.brand AS pdisc, 
                       sp.price AS pmrp, sp.image AS pimage, sp.categories, sp.applicability_base_model, sp.applicable_model, sp.stock_quantity,
                       sp.created_at
                FROM spare_parts sp
                ORDER BY sp.created_at DESC`;

            const [products] = await db.query(sql);

            res.json(products);

        } catch (err) {
            res.status(500).json({
                message: err.message
            });
        }
    });

    // Get product by id
    router.get("/Product/:pid", async (req, res) => {

        try {

            const { pid } = req.params;
            const sql = `SELECT part_id AS pid, part_name AS pname, brand AS pdisc, 
                         price AS pmrp, image AS pimage, categories, applicability_base_model, applicable_model, stock_quantity
                         FROM spare_parts WHERE part_id=?`;
            const [product] = await db.query(sql, [pid]);

            if (product.length === 0) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            res.json(product[0]);

        } catch (err) {

            res.status(500).json({
                message: err.message
            });

        }

    });

    // Update product
    router.put("/Product/:pid", async (req, res) => {

        try {

            const { pid } = req.params;
            const { part_name, brand, applicability_base_model, applicable_model, categories, price, stock_quantity, image } = req.body;
            const sql =
                "UPDATE spare_parts SET part_name=?, brand=?, applicability_base_model=?, applicable_model=?, categories=?, price=?, stock_quantity=?, image=? WHERE part_id=?";
            const [result] = await db.query(sql, [
                part_name,
                brand,
                applicability_base_model,
                applicable_model,
                categories,
                price,
                stock_quantity,
                image,
                pid
            ]);

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "Product not found"
                });

            }

            res.json({
                message: "Product updated successfully"
            });

        } catch (err) {

            res.status(500).json({
                message: err.message
            });

        }

    });

    // Delete product
    router.delete("/Product/:pid", async (req, res) => {

        try {

            const { pid } = req.params;
            const sql = "DELETE FROM spare_parts WHERE part_id=?";
            const [result] = await db.query(sql, [pid]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            res.json({
                message: "Product deleted successfully"
            });

        } catch (err) {

            res.status(500).json({
                message: err.message
            });

        }
    });

    // Search products
    router.post("/psearch", async (req, res) => {

        try {

            const { customer_name } = req.body;

            const sql = `
                SELECT sp.part_id AS pid, sp.part_name AS pname, sp.brand AS pdisc, 
                       sp.price AS pmrp, sp.image AS pimage, sp.categories, sp.applicability_base_model, sp.applicable_model, sp.stock_quantity
                FROM spare_parts sp
                WHERE sp.part_name LIKE ? OR sp.brand LIKE ?`;

            const [products] = await db.query(sql, [
                `%${customer_name}%`,
                `%${customer_name}%`,
            ]);

            res.json(products);

        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Server Error"
            });
        }
    });

    // Products pagination (used by ProductList)
    router.get("/pagination", async (req, res) => {

        try {

            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 5;
            const offset = (page - 1) * limit;

            const countQuery = "SELECT COUNT(*) AS total FROM spare_parts";
            const [countResult] = await db.query(countQuery);
            const total = countResult[0].total;
            const totalPages = Math.ceil(total / limit);

            const sql = `
                SELECT sp.part_id AS pid, sp.part_name AS pname, sp.brand AS pdisc, 
                       sp.price AS pmrp, sp.image AS pimage, sp.categories, sp.applicability_base_model, sp.applicable_model, sp.stock_quantity,
                       sp.created_at
                FROM spare_parts sp
                ORDER BY sp.created_at DESC
                LIMIT ? OFFSET ?`;
            const [result] = await db.query(sql, [limit, offset]);

            res.json({
                data: result,
                total,
                page,
                limit,
                totalPages
            });

        } catch (err) {
            res.status(500).json({
                message: err.message
            });
        }
    });

    // =============================================
    // CART APIs (using separate cart table)
    // =============================================

    // Add item to cart (insert or increment quantity)
    router.post("/cart/add", async (req, res) => {

        try {

            const { customer_id, part_id } = req.body;

            if (!customer_id || !part_id) {
                return res.status(400).json({
                    message: "customer_id and part_id are required"
                });
            }

            // Use INSERT ... ON DUPLICATE KEY to handle re-adding same item
            const sql = `
                INSERT INTO cart (customer_id, part_id, quantity, added_at)
                VALUES (?, ?, 1, NOW())
                ON DUPLICATE KEY UPDATE quantity = quantity + 1, added_at = NOW()
            `;
            await db.query(sql, [customer_id, part_id]);

            res.json({
                message: "Added to cart successfully"
            });

        } catch (err) {
            res.status(500).json({
                message: err.message
            });
        }
    });

    // Remove item from cart
    router.delete("/cart/remove/:cart_id", async (req, res) => {

        try {

            const { cart_id } = req.params;

            const sql = "DELETE FROM cart WHERE cart_id=?";
            const [result] = await db.query(sql, [cart_id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Cart item not found"
                });
            }

            res.json({
                message: "Removed from cart successfully"
            });

        } catch (err) {
            res.status(500).json({
                message: err.message
            });
        }
    });

    // Get cart items for a customer (joined with spare_parts details)
    router.get("/cart/:customer_id", async (req, res) => {

        try {

            const { customer_id } = req.params;
            const sql = `
                SELECT c.cart_id, c.customer_id, c.part_id, c.quantity, c.added_at,
                       sp.part_name, sp.brand, sp.categories, sp.price, sp.stock_quantity, sp.image
                FROM cart c
                JOIN spare_parts sp ON c.part_id = sp.part_id
                WHERE c.customer_id = ?
                ORDER BY c.added_at DESC
            `;
            const [cartItems] = await db.query(sql, [customer_id]);

            res.json(cartItems);

        } catch (err) {
            res.status(500).json({
                message: err.message
            });
        }
    });

    // Update cart item quantity
    router.put("/cart/update/:cart_id", async (req, res) => {

        try {

            const { cart_id } = req.params;
            const { quantity } = req.body;

            if (!quantity || quantity < 1) {
                return res.status(400).json({
                    message: "Quantity must be at least 1"
                });
            }

            const sql = "UPDATE cart SET quantity=? WHERE cart_id=?";
            const [result] = await db.query(sql, [quantity, cart_id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Cart item not found"
                });
            }

            res.json({
                message: "Cart updated successfully"
            });

        } catch (err) {
            res.status(500).json({
                message: err.message
            });
        }
    });

    // Clear entire cart for a customer
    router.delete("/cart/clear/:customer_id", async (req, res) => {

        try {

            const { customer_id } = req.params;

            await db.query("DELETE FROM cart WHERE customer_id=?", [customer_id]);

            res.json({
                message: "Cart cleared successfully"
            });

        } catch (err) {
            res.status(500).json({
                message: err.message
            });
        }
    });

    // Get cart count for a customer
    router.get("/cart/count/:customer_id", async (req, res) => {

        try {

            const { customer_id } = req.params;
            const sql = "SELECT COALESCE(SUM(quantity), 0) AS totalItems FROM cart WHERE customer_id=?";
            const [result] = await db.query(sql, [customer_id]);

            res.json({
                totalItems: result[0].totalItems
            });

        } catch (err) {
            res.status(500).json({
                message: err.message
            });
        }
    });

    // Get low stock spare parts
    router.get("/spare_parts_low_stock", async (req, res) => {

        try {

            const sql = "SELECT * FROM spare_parts WHERE stock_quantity <= 5";
            const [parts] = await db.query(sql);

            res.json(parts);

        } catch (err) {
            res.status(500).json({
                message: err.message
            });
        }
    });

    // =============================================
    // ORDERS APIs
    // =============================================

    router.post("/orders/create", async (req, res) => {
        try {
            const { customer_id, mobile_number } = req.body;
            
            // Get cart items
            const [cartItems] = await db.query(`
                SELECT c.part_id, c.quantity, sp.price, sp.part_name, sp.image 
                FROM cart c 
                JOIN spare_parts sp ON c.part_id = sp.part_id 
                WHERE c.customer_id = ?
            `, [customer_id]);
            
            if (cartItems.length === 0) {
                return res.status(400).json({ message: "Cart is empty" });
            }

            // Calculate total
            const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

            // Generate 6-char alphanumeric ID
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let order_id = '';
            for (let i = 0; i < 6; i++) {
                order_id += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            // Create order with mobile_number
            await db.query(
                "INSERT INTO orders (order_id, customer_id, total_amount, status, mobile_number) VALUES (?, ?, ?, 'Ordered', ?)",
                [order_id, customer_id, total, mobile_number || null]
            );

            // Update customer mobile number if provided
            if (mobile_number) {
                await db.query("UPDATE customers SET mobile_number = ? WHERE customer_id = ?", [mobile_number, customer_id]);
            }

            // Insert order items
            for (const item of cartItems) {
                await db.query(
                    "INSERT INTO order_items (order_id, part_id, quantity, price) VALUES (?, ?, ?, ?)",
                    [order_id, item.part_id, item.quantity, item.price]
                );
            }

            // Clear cart
            await db.query("DELETE FROM cart WHERE customer_id = ?", [customer_id]);

            // Send confirmation email
            const [customerInfo] = await db.query("SELECT email, name FROM customers WHERE customer_id = ?", [customer_id]);
            if(customerInfo.length > 0 && customerInfo[0].email) {
                const itemsHtml = cartItems.map(item => `
                    <tr>
                        <td style="padding: 12px 10px; border-bottom: 1px solid #E2E8F0;">
                            <img src="${item.image}" alt="${item.part_name}" style="width: 45px; height: 45px; object-fit: contain; border-radius: 6px; background: #F8FAFC; border: 1px solid #E2E8F0;" />
                        </td>
                        <td style="padding: 12px 10px; border-bottom: 1px solid #E2E8F0;">
                            <p style="margin: 0; font-size: 14px; font-weight: 700; color: #111827;">${item.part_name}</p>
                        </td>
                        <td style="padding: 12px 10px; border-bottom: 1px solid #E2E8F0; text-align: center; color: #4B5563; font-size: 14px;">x${item.quantity}</td>
                        <td style="padding: 12px 10px; border-bottom: 1px solid #E2E8F0; text-align: right; color: #111827; font-weight: 700; font-size: 14px;">₹${(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                `).join('');

                const transporter = require("./mailer");
                await transporter.sendMail({
                    from: `"${process.env.MAIL_FROM_NAME || 'AARYA AUTO GARAGE'}" <${process.env.MAIL_FROM_ADDRESS || 'aaryaautogarage@gmail.com'}>`,
                    to: customerInfo[0].email,
                    subject: `Order Confirmation — #${order_id}`,
                    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#EEF2F7;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF2F7;padding:28px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:18px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">

<tr><td style="background:linear-gradient(145deg,#0F172A 0%,#1E293B 60%,#0F172A 100%);padding:40px 40px 30px;text-align:center;border-bottom:4px solid #E84A2F;">
        <img src="https://res.cloudinary.com/ji14ydop/image/upload/v1786474190/spare-parts/cofw2n9l05u57enk4aev.png" width="68" height="68" style="border-radius:50%;border:3px solid rgba(232,74,47,0.4);margin-bottom:14px;display:block;margin-left:auto;margin-right:auto;"/>
        <h1 style="color:#FFFFFF;margin:0 0 5px;font-size:24px;font-weight:800;letter-spacing:-0.5px;">Aarya Auto Garage</h1>
        <p style="color:#10B981;margin:0;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Order Confirmed ✓</p>
    </td></tr>
<tr><td style="background:linear-gradient(90deg,#059669,#10B981);padding:14px 40px;text-align:center;">
    <p style="margin:0;color:#FFFFFF;font-size:14px;font-weight:700;letter-spacing:1px;">🎉 &nbsp; YOUR ORDER HAS BEEN PLACED SUCCESSFULLY &nbsp; 🎉</p>
</td></tr>
<tr><td style="padding:35px 40px 30px;">
    <h2 style="margin:0 0 10px;color:#0F172A;font-size:20px;font-weight:700;">Hello, ${customerInfo[0].name}!</h2>
    <p style="margin:0 0 6px;color:#475569;font-size:15px;line-height:1.7;">Thank you for shopping with us. Your order <strong style="color:#0F172A;">#${order_id}</strong> has been received and is currently being processed.</p>
    <p style="margin:0 0 28px;color:#475569;font-size:14px;line-height:1.7;">We will notify you as soon as it is accepted and ready for delivery or pickup.</p>

    <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:1.5px;">Order Summary</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid #E2E8F0;margin-bottom:20px;">
        <tr style="background:#F8FAFC;">
            <td style="padding:10px 14px;font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;">Item</td>
            <td style="padding:10px 14px;font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;text-align:center;">Qty</td>
            <td style="padding:10px 14px;font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;text-align:right;">Price</td>
        </tr>
        ${itemsHtml}
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0F172A,#1E293B);border-radius:10px;margin-bottom:28px;">
        <tr><td style="padding:18px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="color:#94A3B8;font-size:13px;">Order ID</td>
                    <td style="color:#FFFFFF;font-size:13px;font-weight:600;text-align:right;">#${order_id}</td>
                </tr>
                <tr>
                    <td style="color:#94A3B8;font-size:13px;padding-top:8px;">Status</td>
                    <td style="color:#10B981;font-size:13px;font-weight:700;text-align:right;padding-top:8px;">Processing</td>
                </tr>
                <tr>
                    <td style="color:#94A3B8;font-size:15px;font-weight:700;padding-top:12px;border-top:1px solid rgba(255,255,255,0.08);">Total Amount</td>
                    <td style="color:#FF6B35;font-size:20px;font-weight:900;text-align:right;padding-top:12px;border-top:1px solid rgba(255,255,255,0.08);">₹${total.toLocaleString()}</td>
                </tr>
            </table>
        </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
        <a href="https://aaryaautogarage.pages.dev/myorders" style="background:linear-gradient(135deg,#E84A2F,#c23b22);color:#FFFFFF;padding:13px 36px;text-decoration:none;border-radius:50px;font-weight:700;font-size:14px;display:inline-block;box-shadow:0 4px 16px rgba(232,74,47,0.3);">📦 Track My Order</a>
    </td></tr></table>
</td></tr>
<tr><td style="background:linear-gradient(145deg,#0F172A,#1E293B);padding:28px 40px;text-align:center;border-top:3px solid #E84A2F;">
        <p style="margin:0 0 8px;color:#94A3B8;font-size:13px;">Need help? Reach us at <a href="mailto:aaryaautogarage@gmail.com" style="color:#FF6B35;text-decoration:none;font-weight:700;">aaryaautogarage@gmail.com</a></p>
        <div style="margin:14px 0;height:1px;background:rgba(255,255,255,0.06);"></div>
        <p style="margin:0;color:#475569;font-size:11px;">© 2026 Aarya Auto Garage. All rights reserved. &nbsp;|&nbsp; 📍 Shop No 12, Main Road, Radhanagari</p>
    </td></tr>
</table></td></tr></table></body></html>`
                }).catch(e => console.error("Email error:", e));

                // Send admin notification email
                await transporter.sendMail({
                    from: `"${process.env.MAIL_FROM_NAME || 'AARYA AUTO GARAGE'} SYSTEM" <${process.env.MAIL_FROM_ADDRESS || 'aaryaautogarage@gmail.com'}>`,
                    to: process.env.MAIL_FROM_ADDRESS || 'aaryaautogarage@gmail.com',
                    subject: `⚡ New Order Received — #${order_id}`,
                    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#EEF2F7;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF2F7;padding:28px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:18px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">

<tr><td style="background:linear-gradient(145deg,#0F172A 0%,#1E293B 60%,#0F172A 100%);padding:40px 40px 30px;text-align:center;border-bottom:4px solid #E84A2F;">
        <img src="https://res.cloudinary.com/ji14ydop/image/upload/v1786474190/spare-parts/cofw2n9l05u57enk4aev.png" width="68" height="68" style="border-radius:50%;border:3px solid rgba(232,74,47,0.4);margin-bottom:14px;display:block;margin-left:auto;margin-right:auto;"/>
        <h1 style="color:#FFFFFF;margin:0 0 5px;font-size:24px;font-weight:800;letter-spacing:-0.5px;">Aarya Auto Garage</h1>
        <p style="color:#FF6B35;margin:0;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">New Order Alert 🔔</p>
    </td></tr>
<tr><td style="background:linear-gradient(90deg,#E84A2F,#FF6B35);padding:14px 40px;text-align:center;">
    <p style="margin:0;color:#FFFFFF;font-size:14px;font-weight:700;letter-spacing:1px;">⚡ &nbsp; ACTION REQUIRED — NEW ORDER RECEIVED &nbsp; ⚡</p>
</td></tr>
<tr><td style="padding:35px 40px 30px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border-radius:12px;border:1px solid #E2E8F0;border-left:4px solid #E84A2F;margin-bottom:24px;">
        <tr><td style="padding:20px 24px;">
            <p style="margin:0 0 14px;font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:1.5px;">Customer Information</p>
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:5px 0;color:#64748B;font-size:14px;width:90px;">👤 Name</td><td style="padding:5px 0;color:#0F172A;font-size:14px;font-weight:600;">${customerInfo[0].name}</td></tr>
                <tr><td style="padding:5px 0;color:#64748B;font-size:14px;">📧 Email</td><td style="padding:5px 0;color:#0F172A;font-size:14px;font-weight:600;">${customerInfo[0].email}</td></tr>
                <tr><td style="padding:5px 0;color:#64748B;font-size:14px;">📞 Mobile</td><td style="padding:5px 0;color:#0F172A;font-size:14px;font-weight:600;">${mobile_number || 'N/A'}</td></tr>
                <tr><td style="padding:5px 0;color:#64748B;font-size:14px;">🆔 Order ID</td><td style="padding:5px 0;color:#E84A2F;font-size:14px;font-weight:700;font-family:monospace;">#${order_id}</td></tr>
            </table>
        </td></tr>
    </table>

    <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:1.5px;">Items Ordered</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid #E2E8F0;margin-bottom:20px;">
        <tr style="background:#F8FAFC;">
            <td style="padding:10px 14px;font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;">Item</td>
            <td style="padding:10px 14px;font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;text-align:center;">Qty</td>
            <td style="padding:10px 14px;font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;text-align:right;">Price</td>
        </tr>
        ${itemsHtml}
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0F172A,#1E293B);border-radius:10px;margin-bottom:28px;">
        <tr><td style="padding:16px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="color:#94A3B8;font-size:15px;font-weight:700;">Total Amount</td>
                    <td style="color:#FF6B35;font-size:22px;font-weight:900;text-align:right;">₹${total.toLocaleString()}</td>
                </tr>
            </table>
        </td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
        <a href="https://aaryaautogarage.pages.dev/admin/orders" style="background:linear-gradient(135deg,#E84A2F,#c23b22);color:#FFFFFF;padding:13px 36px;text-decoration:none;border-radius:50px;font-weight:700;font-size:14px;display:inline-block;box-shadow:0 4px 16px rgba(232,74,47,0.3);">🖥️ Open Admin Panel</a>
    </td></tr></table>
</td></tr>
<tr><td style="background:linear-gradient(145deg,#0F172A,#1E293B);padding:28px 40px;text-align:center;border-top:3px solid #E84A2F;">
        <p style="margin:0 0 8px;color:#94A3B8;font-size:13px;">Need help? Reach us at <a href="mailto:aaryaautogarage@gmail.com" style="color:#FF6B35;text-decoration:none;font-weight:700;">aaryaautogarage@gmail.com</a></p>
        <div style="margin:14px 0;height:1px;background:rgba(255,255,255,0.06);"></div>
        <p style="margin:0;color:#475569;font-size:11px;">© 2026 Aarya Auto Garage. All rights reserved. &nbsp;|&nbsp; 📍 Shop No 12, Main Road, Radhanagari</p>
    </td></tr>
</table></td></tr></table></body></html>`
                }).catch(e => console.error("Admin Email error:", e));
            }

            res.json({ message: "Order placed successfully", order_id });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // Get orders for customer
    router.get("/orders/customer/:customer_id", async (req, res) => {
        try {
            const { customer_id } = req.params;
            const [orders] = await db.query(`
                SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC
            `, [customer_id]);

            for (let order of orders) {
                const [items] = await db.query(`
                    SELECT oi.*, sp.part_name, sp.image 
                    FROM order_items oi 
                    JOIN spare_parts sp ON oi.part_id = sp.part_id 
                    WHERE oi.order_id = ?
                `, [order.order_id]);
                order.items = items;
            }

            res.json(orders);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // Admin: Get all orders
    router.get("/orders/admin", async (req, res) => {
        try {
            const [orders] = await db.query(`
                SELECT o.*, c.name, c.email 
                FROM orders o 
                JOIN customers c ON o.customer_id = c.customer_id 
                ORDER BY o.created_at DESC
            `);

            for (let order of orders) {
                const [items] = await db.query(`
                    SELECT oi.*, sp.part_name 
                    FROM order_items oi 
                    JOIN spare_parts sp ON oi.part_id = sp.part_id 
                    WHERE oi.order_id = ?
                `, [order.order_id]);
                order.items = items;
            }

            res.json(orders);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // Admin: Update order status
    router.put("/orders/admin/:order_id", async (req, res) => {
        try {
            const { order_id } = req.params;
            const { status } = req.body;

            const [currentOrder] = await db.query("SELECT status FROM orders WHERE order_id = ?", [order_id]);
            if (currentOrder.length === 0) return res.status(404).json({ message: "Order not found" });

            // If marking as delivered and it wasn't already delivered
            if (status === 'Delivered' && currentOrder[0].status !== 'Delivered') {
                const [items] = await db.query("SELECT part_id, quantity FROM order_items WHERE order_id = ?", [order_id]);
                console.log(`[Order ${order_id}] Delivering order, found ${items.length} items to decrement.`);
                for (const item of items) {
                    const q = Number(item.quantity);
                    console.log(`[Order ${order_id}] Decrementing part_id ${item.part_id} by ${q}`);
                    await db.query(
                        "UPDATE spare_parts SET stock_quantity = stock_quantity - ? WHERE part_id = ?", 
                        [q, item.part_id]
                    );
                }
            }

            await db.query("UPDATE orders SET status = ? WHERE order_id = ?", [status, order_id]);
            
            if (status === 'Delivered' || status === 'Declined') {
                const [orderInfo] = await db.query("SELECT c.email, c.name FROM orders o JOIN customers c ON o.customer_id = c.customer_id WHERE o.order_id = ?", [order_id]);
                if (orderInfo.length > 0 && orderInfo[0].email) {
                    const transporter = require("./mailer");
                    
                    if (status === 'Delivered') {
                        await transporter.sendMail({
                            from: `"${process.env.MAIL_FROM_NAME || 'AARYA AUTO GARAGE'}" <${process.env.MAIL_FROM_ADDRESS || 'aaryaautogarage@gmail.com'}>`,
                            to: orderInfo[0].email,
                            subject: `✅ Your Order Has Been Delivered — #${order_id}`,
                        html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#EEF2F7;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF2F7;padding:28px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:18px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">

<tr><td style="background:linear-gradient(145deg,#0F172A 0%,#1E293B 60%,#0F172A 100%);padding:40px 40px 30px;text-align:center;border-bottom:4px solid #E84A2F;">
        <img src="https://res.cloudinary.com/ji14ydop/image/upload/v1786474190/spare-parts/cofw2n9l05u57enk4aev.png" width="68" height="68" style="border-radius:50%;border:3px solid rgba(232,74,47,0.4);margin-bottom:14px;display:block;margin-left:auto;margin-right:auto;"/>
        <h1 style="color:#FFFFFF;margin:0 0 5px;font-size:24px;font-weight:800;letter-spacing:-0.5px;">Aarya Auto Garage</h1>
        <p style="color:#10B981;margin:0;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Order Delivered ✓</p>
    </td></tr>
<tr><td style="background:linear-gradient(90deg,#059669,#10B981);padding:14px 40px;text-align:center;">
    <p style="margin:0;color:#FFFFFF;font-size:14px;font-weight:700;letter-spacing:1px;">✅ &nbsp; YOUR ORDER HAS BEEN DELIVERED &nbsp; ✅</p>
</td></tr>
<tr><td style="padding:35px 40px 30px;">
    <h2 style="margin:0 0 10px;color:#0F172A;font-size:20px;font-weight:700;">Great news, ${orderInfo[0].name}! 🎉</h2>
    <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.75;">Your order <strong style="color:#0F172A;">#${order_id}</strong> has been successfully delivered / picked up. We hope your parts are exactly what you needed!</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#ECFDF5,#D1FAE5);border-radius:12px;border:1px solid #A7F3D0;border-left:4px solid #059669;margin-bottom:28px;">
        <tr><td style="padding:20px 24px;text-align:center;">
            <div style="font-size:36px;margin-bottom:8px;">📦</div>
            <p style="margin:0 0 4px;font-size:16px;font-weight:800;color:#065F46;">Delivery Complete</p>
            <p style="margin:0;color:#047857;font-size:13px;">Order <strong>#${order_id}</strong> marked as delivered</p>
        </td></tr>
    </table>

    <p style="margin:0 0 20px;color:#475569;font-size:14px;line-height:1.75;">If you have any issues with the parts or need further assistance, our team is always ready to help. Don't hesitate to contact us!</p>

    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
        <a href="mailto:aaryaautogarage@gmail.com" style="background:linear-gradient(135deg,#059669,#047857);color:#FFFFFF;padding:13px 36px;text-decoration:none;border-radius:50px;font-weight:700;font-size:14px;display:inline-block;box-shadow:0 4px 16px rgba(5,150,105,0.35);">Contact Support</a>
    </td></tr></table>
</td></tr>
<tr><td style="background:linear-gradient(145deg,#0F172A,#1E293B);padding:28px 40px;text-align:center;border-top:3px solid #E84A2F;">
        <p style="margin:0 0 8px;color:#94A3B8;font-size:13px;">Need help? Reach us at <a href="mailto:aaryaautogarage@gmail.com" style="color:#FF6B35;text-decoration:none;font-weight:700;">aaryaautogarage@gmail.com</a></p>
        <div style="margin:14px 0;height:1px;background:rgba(255,255,255,0.06);"></div>
        <p style="margin:0;color:#475569;font-size:11px;">© 2026 Aarya Auto Garage. All rights reserved. &nbsp;|&nbsp; 📍 Shop No 12, Main Road, Radhanagari</p>
    </td></tr>
</table></td></tr></table></body></html>`
                        }).catch(e => console.error("Email error:", e));
                    } else if (status === 'Declined') {
                        await transporter.sendMail({
                            from: `"${process.env.MAIL_FROM_NAME || 'AARYA AUTO GARAGE'}" <${process.env.MAIL_FROM_ADDRESS || 'aaryaautogarage@gmail.com'}>`,
                            to: orderInfo[0].email,
                            subject: `⚠️ Update on Your Order — #${order_id}`,
                        html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#EEF2F7;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF2F7;padding:28px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:18px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">

<tr><td style="background:linear-gradient(145deg,#0F172A 0%,#1E293B 60%,#0F172A 100%);padding:40px 40px 30px;text-align:center;border-bottom:4px solid #E84A2F;">
        <img src="https://res.cloudinary.com/ji14ydop/image/upload/v1786474190/spare-parts/cofw2n9l05u57enk4aev.png" width="68" height="68" style="border-radius:50%;border:3px solid rgba(232,74,47,0.4);margin-bottom:14px;display:block;margin-left:auto;margin-right:auto;"/>
        <h1 style="color:#FFFFFF;margin:0 0 5px;font-size:24px;font-weight:800;letter-spacing:-0.5px;">Aarya Auto Garage</h1>
        <p style="color:#EF4444;margin:0;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Order Update</p>
    </td></tr>
<tr><td style="background:linear-gradient(90deg,#DC2626,#EF4444);padding:14px 40px;text-align:center;">
    <p style="margin:0;color:#FFFFFF;font-size:14px;font-weight:700;letter-spacing:1px;">⚠️ &nbsp; IMPORTANT UPDATE ABOUT YOUR ORDER &nbsp; ⚠️</p>
</td></tr>
<tr><td style="padding:35px 40px 30px;">
    <h2 style="margin:0 0 10px;color:#0F172A;font-size:20px;font-weight:700;">Hello, ${orderInfo[0].name}</h2>
    <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.75;">We regret to inform you that your order <strong style="color:#0F172A;">#${order_id}</strong> could not be fulfilled at this time.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#FFF5F5,#FEE2E2);border-radius:12px;border:1px solid #FCA5A5;border-left:4px solid #EF4444;margin-bottom:24px;">
        <tr><td style="padding:20px 24px;text-align:center;">
            <div style="font-size:36px;margin-bottom:8px;">❌</div>
            <p style="margin:0 0 4px;font-size:16px;font-weight:800;color:#7F1D1D;">Order Declined</p>
            <p style="margin:0;color:#991B1B;font-size:13px;">Order <strong>#${order_id}</strong> has been declined</p>
        </td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border-radius:12px;border:1px solid #E2E8F0;margin-bottom:24px;">
        <tr><td style="padding:20px 24px;">
            <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:1.5px;">Possible Reasons</p>
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:6px 0;color:#475569;font-size:14px;line-height:1.5;">🔸 &nbsp; The requested part may be temporarily out of stock</td></tr>
                <tr><td style="padding:6px 0;color:#475569;font-size:14px;line-height:1.5;">🔸 &nbsp; A payment or processing issue occurred</td></tr>
                <tr><td style="padding:6px 0;color:#475569;font-size:14px;line-height:1.5;">🔸 &nbsp; Please contact us for a full explanation</td></tr>
            </table>
        </td></tr>
    </table>

    <p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.75;">We sincerely apologize for the inconvenience. Please reach out to us and we will do our best to assist you promptly.</p>
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
        <a href="mailto:aaryaautogarage@gmail.com" style="background:linear-gradient(135deg,#E84A2F,#c23b22);color:#FFFFFF;padding:13px 36px;text-decoration:none;border-radius:50px;font-weight:700;font-size:14px;display:inline-block;box-shadow:0 4px 16px rgba(232,74,47,0.3);">📩 Contact Us for Help</a>
    </td></tr></table>
</td></tr>
<tr><td style="background:linear-gradient(145deg,#0F172A,#1E293B);padding:28px 40px;text-align:center;border-top:3px solid #E84A2F;">
        <p style="margin:0 0 8px;color:#94A3B8;font-size:13px;">Need help? Reach us at <a href="mailto:aaryaautogarage@gmail.com" style="color:#FF6B35;text-decoration:none;font-weight:700;">aaryaautogarage@gmail.com</a></p>
        <div style="margin:14px 0;height:1px;background:rgba(255,255,255,0.06);"></div>
        <p style="margin:0;color:#475569;font-size:11px;">© 2026 Aarya Auto Garage. All rights reserved. &nbsp;|&nbsp; 📍 Shop No 12, Main Road, Radhanagari</p>
    </td></tr>
</table></td></tr></table></body></html>`
                        }).catch(e => console.error("Email error:", e));
                    }
                }
            }

            res.json({ message: "Order updated successfully" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // =============================================
    // DASHBOARD API
    // =============================================

    // Get dashboard statistics
    router.get("/dashboard/stats", async (req, res) => {

        try {

            // Total customers
            const [customerCount] = await db.query("SELECT COUNT(*) AS total FROM customers");

            // Total spare parts
            const [partsCount] = await db.query("SELECT COUNT(*) AS total FROM spare_parts");

            // Total cart items
            const [cartCount] = await db.query("SELECT COALESCE(SUM(quantity), 0) AS total FROM cart");

            // Low stock count
            const [lowStockCount] = await db.query("SELECT COUNT(*) AS total FROM spare_parts WHERE stock_quantity <= 5");

            // Total inventory value
            const [inventoryValue] = await db.query("SELECT COALESCE(SUM(price * stock_quantity), 0) AS total FROM spare_parts");

            // Total categories
            const [categoryCount] = await db.query("SELECT COUNT(DISTINCT categories) AS total FROM spare_parts");

            // Recent 5 customers
            const [recentCustomers] = await db.query(
                "SELECT customer_id AS id, name, email, created_at FROM customers ORDER BY created_at DESC LIMIT 5"
            );

            // Recent 5 spare parts
            const [recentParts] = await db.query(
                "SELECT part_id, part_name, brand, categories, price, stock_quantity, image, created_at FROM spare_parts ORDER BY created_at DESC LIMIT 5"
            );

            // Low stock parts (for alerts)
            const [lowStockParts] = await db.query(
                "SELECT part_id, part_name, brand, stock_quantity FROM spare_parts WHERE stock_quantity <= 5 ORDER BY stock_quantity ASC LIMIT 10"
            );

            // Category-wise count
            const [allCategories] = await db.query("SELECT categories, stock_quantity FROM spare_parts");

            const getMainCategory = (catString) => {
                if (!catString) return "Uncategorized";
                const s = catString.toUpperCase();
                if (s.includes("BRAKE") || s.includes("CLUTCH")) return "Brakes & Clutch";
                if (s.includes("ENGINE")) return "Engine Parts";
                if (s.includes("FILTER")) return "Filters";
                if (s.includes("CHAIN") || s.includes("SPROCKET")) return "Chain & Sprockets";
                if (s.includes("LIGHT") || s.includes("BULB")) return "Lights";
                if (s.includes("CABLE")) return "Cables";
                if (s.includes("BODY") || s.includes("FIBER") || s.includes("VISOR") || s.includes("COWL")) return "Body Parts";
                if (s.includes("LOCK") || s.includes("KEY")) return "Locks & Keys";
                if (s.includes("CDI") || s.includes("RELAY") || s.includes("WIRING") || s.includes("SWITCH")) return "Electricals";
                if (s.includes("MIRROR")) return "Mirrors";
                if (s.includes("BEARING") || s.includes("BUSH")) return "Bearings";
                if (s.includes("SUSPENSION") || s.includes("SHOCK") || s.includes("FORK")) return "Suspension";
                if (s.includes("SEAT") || s.includes("COVER")) return "Seat & Covers";
                
                const first = catString.split(",")[0].trim();
                return first ? (first.charAt(0).toUpperCase() + first.slice(1).toLowerCase()) : "Other";
            };

            const groupedStats = {};
            for (const part of allCategories) {
                const main = getMainCategory(part.categories);
                if (!groupedStats[main]) {
                    groupedStats[main] = { count: 0, totalStock: 0 };
                }
                groupedStats[main].count += 1;
                groupedStats[main].totalStock += (part.stock_quantity || 0);
            }

            const categoryStats = Object.keys(groupedStats).map(cat => ({
                categories: cat,
                count: groupedStats[cat].count,
                totalStock: groupedStats[cat].totalStock
            })).sort((a, b) => b.count - a.count);

            res.json({
                totalCustomers: customerCount[0].total,
                totalParts: partsCount[0].total,
                totalCartItems: cartCount[0].total,
                lowStockCount: lowStockCount[0].total,
                inventoryValue: inventoryValue[0].total,
                totalCategories: categoryStats.length,
                recentCustomers,
                recentParts,
                lowStockParts,
                categoryStats
            });

        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: err.message
            });
        }
    });

    return router;
};
