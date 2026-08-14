const fs = require('fs');

let content = fs.readFileSync('spare_part.js', 'utf8');

// Update table creation query - removed customer_id FK since customer_id is not in spare_parts anymore
content = content.replace(
    /FOREIGN KEY \(customer_id\) REFERENCES customers\(customer_id\) ON DELETE CASCADE,\s*FOREIGN KEY \(part_id\) REFERENCES spare_parts\(part_id\) ON DELETE CASCADE,\s*UNIQUE KEY unique_cart_item \(customer_id, part_id\)/g,
    'FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,\n                    FOREIGN KEY (part_id) REFERENCES spare_parts(part_id) ON DELETE CASCADE,\n                    UNIQUE KEY unique_cart_item (customer_id, part_id)'
);

// Update /spare_parts POST
content = content.replace(
    /const \{ part_name, brand, category, price, stock_quantity \} = req\.body;\s*const sql = "INSERT INTO spare_parts\(part_name,brand,category,price,stock_quantity\) VALUES\(\?,\?,\?,\?,\?\)";\s*await db\.query\(sql, \[part_name, brand, category, price, stock_quantity\]\);/g,
    `const { part_name, brand, applicability_base_model, applicable_model, categories, price, stock_quantity, image } = req.body;
            const sql = "INSERT INTO spare_parts(part_name,brand,applicability_base_model,applicable_model,categories,price,stock_quantity,image) VALUES(?,?,?,?,?,?,?,?)";
            await db.query(sql, [part_name, brand, applicability_base_model, applicable_model, categories, price, stock_quantity, image]);`
);

// Update /spare_parts/:part_id PUT
content = content.replace(
    /const \{ part_name, brand, category, price, stock_quantity \} = req\.body;\s*const sql =\s*"UPDATE spare_parts SET part_name=\?, brand=\?, category=\?, price=\?, stock_quantity=\? WHERE part_id=\?";\s*const \[result\] = await db\.query\(sql, \[\s*part_name,\s*brand,\s*category,\s*price,\s*stock_quantity,\s*part_id\s*\]\);/g,
    `const { part_name, brand, applicability_base_model, applicable_model, categories, price, stock_quantity, image } = req.body;
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
            ]);`
);

// Update /Product POST
content = content.replace(
    /const \{ pname, pdisc, pmrp, pimage, E_id \} = req\.body;\s*const sql = "INSERT INTO spare_parts\(part_name,brand,category,price,stock_quantity,in_cart,customer_id\) VALUES\(\?,\?,\?,\?,\?,\?,\?\)";\s*await db\.query\(sql, \[pname, pdisc, "General", pmrp, 0, false, E_id \|\| null\]\);/g,
    `const { part_name, brand, applicability_base_model, applicable_model, categories, price, stock_quantity, image } = req.body;
            const sql = "INSERT INTO spare_parts(part_name,brand,applicability_base_model,applicable_model,categories,price,stock_quantity,image,in_cart) VALUES(?,?,?,?,?,?,?,?,?)";
            await db.query(sql, [part_name, brand, applicability_base_model, applicable_model, categories, price, stock_quantity, image, false]);`
);

// Update /Product GET
content = content.replace(
    /SELECT sp\.part_id AS pid, sp\.part_name AS pname, sp\.brand AS pdisc,\s*sp\.price AS pmrp, sp\.category AS pimage, sp\.customer_id AS E_id,\s*sp\.created_at\s*FROM spare_parts sp/g,
    `SELECT sp.part_id AS pid, sp.part_name AS pname, sp.brand AS pdisc, 
                       sp.price AS pmrp, sp.image AS pimage, sp.categories, sp.applicability_base_model, sp.applicable_model, sp.stock_quantity,
                       sp.created_at
                FROM spare_parts sp`
);

// Update /Product/:pid GET
content = content.replace(
    /SELECT part_id AS pid, part_name AS pname, brand AS pdisc,\s*price AS pmrp, category AS pimage, customer_id AS E_id\s*FROM spare_parts WHERE part_id=\?/g,
    `SELECT part_id AS pid, part_name AS pname, brand AS pdisc, 
                         price AS pmrp, image AS pimage, categories, applicability_base_model, applicable_model, stock_quantity
                         FROM spare_parts WHERE part_id=?`
);

// Update /Product/:pid PUT
content = content.replace(
    /const \{ pname, pdisc, pmrp, pimage, E_id \} = req\.body;\s*const sql =\s*"UPDATE spare_parts SET part_name=\?, brand=\?, price=\?, category=\?, customer_id=\? WHERE part_id=\?";\s*const \[result\] = await db\.query\(sql, \[\s*pname,\s*pdisc,\s*pmrp,\s*pimage,\s*E_id \|\| null,\s*pid\s*\]\);/g,
    `const { part_name, brand, applicability_base_model, applicable_model, categories, price, stock_quantity, image } = req.body;
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
            ]);`
);

// Update /psearch POST
content = content.replace(
    /SELECT sp\.part_id AS pid, sp\.part_name AS pname, sp\.brand AS pdisc,\s*sp\.price AS pmrp, sp\.category AS pimage, sp\.customer_id AS E_id,\s*c\.name AS customer_name\s*FROM spare_parts sp\s*LEFT JOIN customers c ON sp\.customer_id = c\.customer_id\s*WHERE c\.name LIKE \? OR sp\.part_name LIKE \?/g,
    `SELECT sp.part_id AS pid, sp.part_name AS pname, sp.brand AS pdisc, 
                       sp.price AS pmrp, sp.image AS pimage, sp.categories, sp.applicability_base_model, sp.applicable_model, sp.stock_quantity
                FROM spare_parts sp
                WHERE sp.part_name LIKE ? OR sp.brand LIKE ?`
);

// In /psearch POST, also update the query parameters
content = content.replace(
    /const \[products\] = await db\.query\(sql, \[\s*\`%\$\{customer_name\}%\`,\s*\`%\$\{customer_name\}%\`,\s*\]\);/g,
    `const [products] = await db.query(sql, [
                \`%\${customer_name}%\`,
                \`%\${customer_name}%\`,
            ]);`
);

// Update /pagination GET
content = content.replace(
    /SELECT sp\.part_id AS pid, sp\.part_name AS pname, sp\.brand AS pdisc,\s*sp\.price AS pmrp, sp\.category AS pimage, sp\.customer_id AS E_id,\s*sp\.created_at\s*FROM spare_parts sp/g,
    `SELECT sp.part_id AS pid, sp.part_name AS pname, sp.brand AS pdisc, 
                       sp.price AS pmrp, sp.image AS pimage, sp.categories, sp.applicability_base_model, sp.applicable_model, sp.stock_quantity,
                       sp.created_at
                FROM spare_parts sp`
);

// Update /cart/:customer_id GET
content = content.replace(
    /c\.cart_id, c\.customer_id, c\.part_id, c\.quantity, c\.added_at,\s*sp\.part_name, sp\.brand, sp\.category, sp\.price, sp\.stock_quantity/g,
    `c.cart_id, c.customer_id, c.part_id, c.quantity, c.added_at,
                       sp.part_name, sp.brand, sp.categories, sp.price, sp.stock_quantity, sp.image`
);

// Update /dashboard/stats GET (total categories)
content = content.replace(
    /SELECT COUNT\(DISTINCT category\) AS total FROM spare_parts/g,
    `SELECT COUNT(DISTINCT categories) AS total FROM spare_parts`
);

// Update /dashboard/stats GET (category stats)
content = content.replace(
    /SELECT category, COUNT\(\*\) AS count, SUM\(stock_quantity\) AS totalStock FROM spare_parts GROUP BY category ORDER BY count DESC/g,
    `SELECT categories, COUNT(*) AS count, SUM(stock_quantity) AS totalStock FROM spare_parts GROUP BY categories ORDER BY count DESC`
);

// Update /dashboard/stats GET (recent parts)
content = content.replace(
    /SELECT part_id, part_name, brand, category, price, stock_quantity, created_at FROM spare_parts ORDER BY created_at DESC LIMIT 5/g,
    `SELECT part_id, part_name, brand, categories, price, stock_quantity, image, created_at FROM spare_parts ORDER BY created_at DESC LIMIT 5`
);

fs.writeFileSync('spare_part_updated.js', content);
console.log("File updated");
