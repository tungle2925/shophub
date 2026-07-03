from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlmodel import SQLModel, Field, Session, create_engine, select
from typing import Optional, List
import os

# ─── Database ────────────────────────────────────────────────
DATABASE_URL = "postgresql://postgres:shophub123@localhost:5432/shophub_db"
engine = create_engine(DATABASE_URL, echo=True)

# ─── Models ──────────────────────────────────────────────────
class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(min_length=3, max_length=100)
    price: float = Field(gt=0)
    category: str = Field(min_length=3, max_length=50)
    description: str
    image_path: str

class ProductCreate(SQLModel):
    name: str = Field(min_length=3, max_length=100)
    price: float = Field(gt=0)
    category: str = Field(min_length=3, max_length=50)
    description: str
    imageUrl: str

class ProductRead(SQLModel):
    id: int
    name: str
    price: float
    category: str
    description: str
    imageUrl: str

class ProductUpdate(SQLModel):
    name: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    description: Optional[str] = None
    imageUrl: Optional[str] = None

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    full_name: str
    password_hash: str
    role: str = Field(default="customer")

class UserCreate(SQLModel):
    email: str
    full_name: str
    password: str
    role: Optional[str] = "customer"

class UserRead(SQLModel):
    id: int
    email: str
    full_name: str
    role: str

# ─── App ─────────────────────────────────────────────────────
app = FastAPI(title="ShopHub API with PostgreSQL", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# ─── Create Tables ───────────────────────────────────────────
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# ─── Dependency ──────────────────────────────────────────────
def get_session():
    with Session(engine) as session:
        yield session

IMAGE_DIR = os.path.join(os.path.dirname(__file__), "data_images")

# ─── Routes ──────────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "ShopHub API with PostgreSQL đang chạy!"}

@app.get("/products", response_model=List[ProductRead])
def get_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    session: Session = Depends(get_session)
):
    query = select(Product)
    if category:
        query = query.where(Product.category == category)
    if search:
        query = query.where(Product.name.ilike(f"%{search}%"))
    products = session.exec(query).all()
    return [ProductRead(
        id=p.id, name=p.name, price=p.price,
        category=p.category, description=p.description,
        imageUrl=p.image_path
    ) for p in products]

@app.get("/products/{product_id}", response_model=ProductRead)
def get_product(product_id: int, session: Session = Depends(get_session)):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    return ProductRead(
        id=product.id, name=product.name, price=product.price,
        category=product.category, description=product.description,
        imageUrl=product.image_path
    )

@app.post("/products", response_model=ProductRead, status_code=201)
def create_product(payload: ProductCreate, session: Session = Depends(get_session)):
    product = Product(
        name=payload.name, price=payload.price,
        category=payload.category, description=payload.description,
        image_path=payload.imageUrl
    )
    session.add(product)
    session.commit()
    session.refresh(product)
    return ProductRead(
        id=product.id, name=product.name, price=product.price,
        category=product.category, description=product.description,
        imageUrl=product.image_path
    )

@app.put("/products/{product_id}", response_model=ProductRead)
def update_product(product_id: int, payload: ProductUpdate, session: Session = Depends(get_session)):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    if payload.name is not None: product.name = payload.name
    if payload.price is not None: product.price = payload.price
    if payload.category is not None: product.category = payload.category
    if payload.description is not None: product.description = payload.description
    if payload.imageUrl is not None: product.image_path = payload.imageUrl
    session.add(product)
    session.commit()
    session.refresh(product)
    return ProductRead(
        id=product.id, name=product.name, price=product.price,
        category=product.category, description=product.description,
        imageUrl=product.image_path
    )

@app.delete("/products/{product_id}", status_code=204)
def delete_product(product_id: int, session: Session = Depends(get_session)):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    session.delete(product)
    session.commit()
    return

@app.get("/images/{filename}")
def get_image(filename: str):
    filepath = os.path.join(IMAGE_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Không tìm thấy ảnh")
    return FileResponse(filepath)