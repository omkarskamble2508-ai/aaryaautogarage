import os
import re
import random
import cloudinary
import cloudinary.uploader
import mysql.connector

# Cloudinary Configuration from your Customer.js
cloudinary.config(
  cloud_name = 'ji14ydop',
  api_key = '742681517725688',
  api_secret = 'WsLAwb0RW0rcMdXEnO_E_Hsl9-8',
  secure = True
)

# Connect to the local MySQL database
try:
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="finalproject"
    )
    cursor = db.cursor()
    print("Database connected successfully.")
except Exception as e:
    print(f"Error connecting to database: {e}")
    exit(1)

def parse_price(price_str):
    """ Converts a price string like '₹1,577.00' to a float 1577.00 """
    cleaned = re.sub(r'[^\d.]', '', price_str)
    try:
        return float(cleaned)
    except ValueError:
        return 0.0

products_file = r"c:\sort\images\products.txt"
images_dir = r"c:\sort\images\images"

with open(products_file, 'r', encoding='utf-8') as f:
    content = f.read()

# The products in the text file are separated by a line of dashes
blocks = content.split("----------------------------------------")

for block in blocks:
    block = block.strip()
    if not block:
        continue
    
    lines = block.split('\n')
    
    image_file = None
    part_name = ""
    price = 0.0
    app_base_model = ""
    app_model = ""
    brand = ""
    categories = ""
    
    for line in lines:
        line = line.strip()
        if line.startswith("IMAGE"):
            # e.g., "IMAGE 1 - IMAGE_1.png" -> "IMAGE_1.png"
            parts = line.split("-")
            if len(parts) > 1:
                image_file = parts[1].strip()
        elif line.startswith("Name:"):
            part_name = line[5:].strip()
        elif line.startswith("Price:"):
            price = parse_price(line[6:].strip())
        elif line.startswith("Applicability Base Model:"):
            app_base_model = line[len("Applicability Base Model:"):].strip()
        elif line.startswith("Applicable Model:"):
            app_model = line[len("Applicable Model:"):].strip()
        elif line.startswith("Brand:"):
            # Some brands have a hyphen like "- HERO"
            brand = line[6:].strip().lstrip('-').strip()
        elif line.startswith("Categories:"):
            categories = line[11:].strip()
            
    if image_file and part_name:
        image_path = os.path.join(images_dir, image_file)
        if not os.path.exists(image_path):
            print(f"Image '{image_path}' not found. Skipping '{part_name}'.")
            continue
            
        print(f"\nProcessing '{part_name}'...")
        print(f"Uploading '{image_file}' to Cloudinary...")
        try:
            # Uploading image to 'spare-parts' folder in Cloudinary
            upload_result = cloudinary.uploader.upload(image_path, folder="spare-parts")
            secure_url = upload_result.get('secure_url')
        except Exception as e:
            print(f"Failed to upload '{image_file}': {e}")
            continue
            
        print(f"Uploaded successfully: {secure_url}")
        print("Saving to database...")
        
        # We default stock_quantity to a random number between 7 and 15
        sql = """INSERT INTO spare_parts 
                 (part_name, brand, applicability_base_model, applicable_model, categories, price, stock_quantity, image) 
                 VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
                 
        val = (part_name, brand, app_base_model, app_model, categories, price, random.randint(7, 15), secure_url)
        
        try:
            cursor.execute(sql, val)
            db.commit()
            print("Successfully saved to database.")
        except Exception as e:
            print(f"Database error for '{part_name}': {e}")

cursor.close()
db.close()
print("\nAll products have been processed!")
