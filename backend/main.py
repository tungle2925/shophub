import json
import os
import uuid
from typing import Optional, List

import aiofiles
from fastapi import FastAPI, HTTPException, Query, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

# ─── App & CORS ───────────────────────────────────────────────
app = FastAPI(title="ShopHub Product API", version="1.1.0")

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# ─── Paths ────────────────────────────────────────────────────
DATA_FILE = os.path.join(os.path.dirname(__file__), "data", "products.json")
IMAGE_DIR = os.path.join(os.path.dirname(__file__), "data_images")
os.makedirs(IMAGE_DIR, exist_ok=True)

# ─── Schemas ──────────────────────────────────────────────────
class ProductPublic(BaseModel):
    id: int
    name: str
    price: float
    category: str
    description: str
    imageUrl: str

class ProductCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    price: float = Field(..., gt=0)
    category: str = Field(..., min_length=3, max_length=50)
    description: str = Field(..., min_length=5)
    imageUrl: Optional[str] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=100)
    price: Optional[float] = Field(None, gt=0)
    category: Optional[str] = Field(None, min_length=3, max_length=50)
    description: Optional[str] = Field(None, min_length=5)
    imageUrl: Optional[str] = None

class ProductListResponse(BaseModel):
    total: int
    page: int
    size: int
    items: List[ProductPublic]

# ─── Helpers ──────────────────────────────────────────────────
def read_products():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def write_products(products):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

def to_public(p: dict) -> ProductPublic:
    image_path = p.get("imagePath", "")
    if image_path.startswith("http"):
        image_url = image_path
    else:
        filename = os.path.basename(image_path)
        image_url = f"/images/{filename}"
    return ProductPublic(
        id=p["id"],
        name=p["name"],
        price=p["price"],
        category=p["category"],
        description=p["description"],
        imageUrl=image_url,
    )

def next_id(products):
    return max((p["id"] for p in products), default=0) + 1

# ─── Routes ───────────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "ShopHub API đang chạy!"}

@app.get("/products", response_model=ProductListResponse)
def get_products(
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
):
    products = read_products()

    if category:
        products = [p for p in products if p["category"].lower() == category.lower()]
    if min_price is not None:
        products = [p for p in products if p["price"] >= min_price]
    if max_price is not None:
        products = [p for p in products if p["price"] <= max_price]
    if search:
        products = [p for p in products if search.lower() in p["name"].lower() or search.lower() in p["description"].lower()]

    total = len(products)
    start = (page - 1) * size
    end = start + size
    items = [to_public(p) for p in products[start:end]]

    return ProductListResponse(total=total, page=page, size=size, items=items)

@app.get("/products/{product_id}", response_model=ProductPublic)
def get_product(product_id: int):
    products = read_products()
    for p in products:
        if p["id"] == product_id:
            return to_public(p)
    raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")

@app.post("/products", response_model=ProductPublic, status_code=201)
async def create_product(
    name: str = Form(...),
    price: float = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    imageUrl: Optional[str] = Form(None),
    image_file: Optional[UploadFile] = File(None),
):
    products = read_products()

    if image_file:
        ext = os.path.splitext(image_file.filename)[1]
        filename = f"{uuid.uuid4()}{ext}"
        filepath = os.path.join(IMAGE_DIR, filename)
        async with aiofiles.open(filepath, "wb") as f:
            content = await image_file.read()
            await f.write(content)
        image_path = f"data_images/{filename}"
    elif imageUrl:
        image_path = imageUrl
    else:
        raise HTTPException(status_code=400, detail="Cần cung cấp ảnh (file hoặc URL)")

    new_product = {
        "id": next_id(products),
        "name": name,
        "price": price,
        "category": category,
        "description": description,
        "imagePath": image_path,
        "costPrice": None,
    }
    products.append(new_product)
    write_products(products)
    return to_public(new_product)

@app.put("/products/{product_id}", response_model=ProductPublic)
async def update_product(
    product_id: int,
    name: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    category: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    imageUrl: Optional[str] = Form(None),
    image_file: Optional[UploadFile] = File(None),
):
    products = read_products()
    for i, p in enumerate(products):
        if p["id"] == product_id:
            if name: p["name"] = name
            if price: p["price"] = price
            if category: p["category"] = category
            if description: p["description"] = description

            if image_file:
                ext = os.path.splitext(image_file.filename)[1]
                filename = f"{uuid.uuid4()}{ext}"
                filepath = os.path.join(IMAGE_DIR, filename)
                async with aiofiles.open(filepath, "wb") as f:
                    content = await image_file.read()
                    await f.write(content)
                p["imagePath"] = f"data_images/{filename}"
            elif imageUrl:
                p["imagePath"] = imageUrl

            products[i] = p
            write_products(products)
            return to_public(p)
    raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")

@app.delete("/products/{product_id}", status_code=204)
def delete_product(product_id: int):
    products = read_products()
    for i, p in enumerate(products):
        if p["id"] == product_id:
            image_path = p.get("imagePath", "")
            if image_path.startswith("data_images/"):
                full_path = os.path.join(os.path.dirname(__file__), image_path)
                if os.path.exists(full_path):
                    os.remove(full_path)
            products.pop(i)
            write_products(products)
            return
    raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")

@app.get("/images/{filename}")
def get_image(filename: str):
    filepath = os.path.join(IMAGE_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Không tìm thấy ảnh")
    return FileResponse(filepath)